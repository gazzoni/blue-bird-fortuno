export const dashboardQueries = {
  whatsappOccurrences: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE chat_type IN ('Grupo', 'Privado')
  `,
  
  whatsappOccurrences24h: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE chat_type IN ('Grupo', 'Privado')
    AND created_at >= NOW() - INTERVAL '24 hours'
  `,
  
  emailOccurrences: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE channel = 'email'
  `,
  
  emailOccurrences24h: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE channel = 'email'
    AND created_at >= NOW() - INTERVAL '24 hours'
  `,
  
  pendingOccurrences: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE status = 'Pendente'
  `,
  
  occurrencesByDay: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total
    FROM occurrences 
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
  
  occurrencesByStatus: `
    SELECT 
      status,
      COUNT(*) as total
    FROM occurrences 
    GROUP BY status
  `,
  
  recentOccurrences: `
    SELECT 
      id,
      created_at,
      category,
      chat_name,
      status,
      chat_type
    FROM occurrences 
    ORDER BY created_at DESC 
    LIMIT 5
  `
};