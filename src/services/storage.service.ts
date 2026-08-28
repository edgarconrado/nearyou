// services/storage.service.ts
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export class StorageService {
  private static ZONES_BUCKET = 'zones';

  /**
   * Subir una imagen de zona al storage
   * @param file - URI del archivo (puede ser de la galería o cámara)
   * @param zoneName - Nombre de la zona para generar un nombre único
   * @returns URL pública de la imagen
   */
  static async uploadZoneImage(
    file: string,
    zoneName: string
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      // Leer el archivo como base64
      const base64 = await FileSystem.readAsStringAsync(file, {
        encoding: 'base64',
      });

      // Generar nombre único para el archivo
      const fileExt = file.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${zoneName.toLowerCase().replace(/\s+/g, '-')}.${fileExt}`;
      const filePath = `${fileName}`;

      // Convertir base64 a ArrayBuffer
      const arrayBuffer = decode(base64);

      // Determinar el tipo MIME
      const contentType = this.getContentType(fileExt);

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(this.ZONES_BUCKET)
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage
        .from(this.ZONES_BUCKET)
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Actualizar la imagen de una zona (elimina la anterior y sube la nueva)
   */
  static async updateZoneImage(
    file: string,
    zoneName: string,
    oldImageUrl?: string | null
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      // Si hay una imagen anterior, eliminarla
      if (oldImageUrl) {
        await this.deleteImageByUrl(oldImageUrl);
      }

      // Subir nueva imagen
      return await this.uploadZoneImage(file, zoneName);
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Eliminar una imagen por su URL
   */
  static async deleteImageByUrl(imageUrl: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Extraer el path del archivo de la URL
      const filePath = this.extractPathFromUrl(imageUrl);

      if (!filePath) {
        throw new Error('Invalid image URL');
      }

      const { error } = await supabase.storage
        .from(this.ZONES_BUCKET)
        .remove([filePath]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Eliminar una imagen por su path
   */
  static async deleteImage(filePath: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.storage
        .from(this.ZONES_BUCKET)
        .remove([filePath]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Obtener URL pública de una imagen
   */
  static getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.ZONES_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Listar todas las imágenes en el bucket
   */
  static async listImages(): Promise<{ files: any[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.ZONES_BUCKET)
        .list();

      if (error) throw error;

      return { files: data, error: null };
    } catch (error) {
      return { files: null, error: error as Error };
    }
  }

  /**
   * Obtener el tipo MIME según la extensión del archivo
   */
  private static getContentType(extension: string): string {
    const types: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    };

    return types[extension.toLowerCase()] || 'image/jpeg';
  }

  /**
   * Extraer el path del archivo de una URL de Supabase Storage
   */
  private static extractPathFromUrl(url: string): string | null {
    try {
      // Ejemplo de URL: https://xxx.supabase.co/storage/v1/object/public/zones/image.jpg
      const parts = url.split('/storage/v1/object/public/zones/');
      return parts[1] || null;
    } catch (error) {
      return null;
    }
  }
}