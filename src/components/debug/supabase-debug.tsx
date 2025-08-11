'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection } from '@/lib/supabase-test';

export function SupabaseDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    tables: Array<{
      table: string;
      exists: boolean;
      count: number;
      error?: string;
    }>;
  } | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        tables: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">
          🔍 Debug Supabase
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runTest} 
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? 'Testando...' : 'Testar Conexão'}
          </Button>

          {result && (
            <div className="mt-4 space-y-4">
              {/* Connection Status */}
              <div className={`p-3 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="font-medium">
                  {result.success ? '✅ Conexão bem-sucedida' : '❌ Falha na conexão'}
                </div>
                {result.error && (
                  <div className="text-sm text-red-600 mt-1">
                    Erro: {result.error}
                  </div>
                )}
              </div>

              {/* Tables Status */}
              {result.tables && result.tables.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-black">Status das Tabelas:</h3>
                  {result.tables.map((table, index: number) => (
                    <div 
                      key={index}
                      className={`p-2 rounded text-sm ${
                        table.exists 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{table.table}</span>
                        <span>
                          {table.exists 
                            ? `${table.count} registros` 
                            : table.error || 'Não existe'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Environment Info */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <h4 className="font-medium mb-2">Configuração:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
                  <div>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}