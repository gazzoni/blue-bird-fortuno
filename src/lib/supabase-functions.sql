-- Função SQL para agrupar ocorrências por dia
-- Execute esta função no editor SQL do Supabase

CREATE OR REPLACE FUNCTION get_occurrences_by_day(
  start_date timestamp with time zone DEFAULT '1900-01-01',
  end_date timestamp with time zone DEFAULT '2100-01-01'
)
RETURNS TABLE (
  date date,
  count bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
  FROM occurrences 
  WHERE created_at >= start_date 
    AND created_at <= end_date
  GROUP BY DATE(created_at)
  ORDER BY date;
END;
$$;

-- Função para obter métricas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
  start_date timestamp with time zone DEFAULT '1900-01-01',
  end_date timestamp with time zone DEFAULT '2100-01-01'
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'whatsapp_total', (
      SELECT COUNT(*) 
      FROM occurrences 
      WHERE chat_type IN ('group', 'private') 
        AND created_at >= start_date 
        AND created_at <= end_date
    ),
    'email_total', (
      SELECT COUNT(*) 
      FROM occurrences 
      WHERE channel = 'email' 
        AND created_at >= start_date 
        AND created_at <= end_date
    ),
    'pending_total', (
      SELECT COUNT(*) 
      FROM occurrences 
      WHERE status = 'Pendente' 
        AND created_at >= start_date 
        AND created_at <= end_date
    )
  ) INTO result;
  
  RETURN result;
END;
$$;