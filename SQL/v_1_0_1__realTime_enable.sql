-- Habilitar Realtime en la tabla zones
ALTER PUBLICATION supabase_realtime ADD TABLE zones;

-- Verificar que está habilitado (opcional)
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';