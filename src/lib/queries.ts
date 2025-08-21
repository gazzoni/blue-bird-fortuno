export const dashboardQueries = {
  whatsappOccurrences: `
    SELECT COUNT(*) as total 
    FROM "new-occurrences" 
    WHERE channel = 'Whatsapp'
  `,
  
  whatsappOccurrences24h: `
    SELECT COUNT(*) as total 
    FROM "new-occurrences" 
    WHERE channel = 'Whatsapp'
    AND created_at >= NOW() - INTERVAL '24 hours'
  `,
  
  emailOccurrences: `
    SELECT COUNT(*) as total 
    FROM "new-occurrences" 
    WHERE channel = 'email'
  `,
  
  emailOccurrences24h: `
    SELECT COUNT(*) as total 
    FROM "new-occurrences" 
    WHERE channel = 'email'
    AND created_at >= NOW() - INTERVAL '24 hours'
  `,
  
  pendingOccurrences: `
    SELECT COUNT(*) as total 
    FROM "new-occurrences" 
    WHERE status = 'aberto'
  `,
  
  occurrencesByDay: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total
    FROM "new-occurrences" 
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
  
  occurrencesByStatus: `
    SELECT 
      status,
      COUNT(*) as total
    FROM "new-occurrences" 
    GROUP BY status
  `,
  
  recentOccurrences: `
    SELECT 
      id,
      created_at,
      category,
      chat_name,
      status,
      squad
    FROM "new-occurrences" 
    ORDER BY created_at DESC 
    LIMIT 5
  `
};