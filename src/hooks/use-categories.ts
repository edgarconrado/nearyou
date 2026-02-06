// hooks/use-categories.ts
import type { Category } from '@/services/categories.service';
import { CategoriesService } from '@/services/categories.service';
import { useEffect, useState } from 'react';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await CategoriesService.getAllActiveCategories();

      if (fetchError) {
        throw fetchError;
      }

      console.log("Categories" + data);
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadCategories();
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
}