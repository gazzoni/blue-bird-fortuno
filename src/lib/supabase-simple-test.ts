import { supabase } from './supabase';

export async function simpleSupabaseTest() {
  try {
    console.log('🔍 Testando conexão simples com Supabase...');
    
    // Test basic SELECT on occurrences table
    const { data, error, count } = await supabase
      .from('occurrences')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Erro ao conectar:', error.message);
      return {
        success: false,
        error: error.message,
        hasData: false,
        count: 0
      };
    }

    console.log('✅ Conexão bem-sucedida!');
    console.log(`📊 Total de registros: ${count || 0}`);

    // Test if we can fetch some actual data
    const { data: sampleData, error: sampleError } = await supabase
      .from('occurrences')
      .select('id, created_at, status, chat_type, category')
      .limit(3);

    if (sampleError) {
      console.warn('⚠️ Erro ao buscar dados de exemplo:', sampleError.message);
    } else {
      console.log('📋 Dados de exemplo:', sampleData);
    }

    return {
      success: true,
      hasData: (count || 0) > 0,
      count: count || 0,
      sampleData: sampleData || []
    };

  } catch (err) {
    console.error('💥 Erro geral:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erro desconhecido',
      hasData: false,
      count: 0
    };
  }
}