import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('occurrences')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Erro de conexão:', connectionError);
      return {
        success: false,
        error: connectionError.message,
        tables: []
      };
    }

    console.log('✅ Conexão estabelecida com sucesso');
    console.log(`📊 Total de registros em occurrences: ${connectionTest || 0}`);

    // Test if tables exist
    const tables = ['companies', 'occurrences', 'messages', 'groups', 'people'];
    const tableStatus = [];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Tabela '${table}': ${error.message}`);
          tableStatus.push({ table, exists: false, count: 0, error: error.message });
        } else {
          console.log(`✅ Tabela '${table}': ${count} registros`);
          tableStatus.push({ table, exists: true, count: count || 0 });
        }
      } catch (err) {
        console.log(`❌ Tabela '${table}': Erro ao verificar`);
        tableStatus.push({ table, exists: false, count: 0, error: 'Erro desconhecido' });
      }
    }

    return {
      success: true,
      tables: tableStatus
    };
  } catch (error) {
    console.error('💥 Erro geral:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      tables: []
    };
  }
}