// supabase/functions/delete-account/index.ts
//
// Borra por completo la cuenta del usuario que llama, incluida su fila en
// auth.users. Necesita la service_role key, que solo existe aquí — nunca
// en la app.
//
// Desplegar:  supabase functions deploy delete-account
//
// La función lee el JWT del usuario del header Authorization, así que nadie
// puede borrar una cuenta ajena: solo se borra quien llama.

import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Falta Authorization' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Cliente con el token del usuario: solo para saber QUIÉN llama
        const userClient = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: userData, error: userError } = await userClient.auth.getUser();
        if (userError || !userData.user) {
            return new Response(JSON.stringify({ error: 'Sesión inválida' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userId = userData.user.id;

        // Cliente admin: el que sí puede borrar
        const admin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // El perfil primero; el CASCADE arrastra reseñas, favoritos, visitas, ajustes
        await admin.from('profiles').delete().eq('id', userId);

        const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});