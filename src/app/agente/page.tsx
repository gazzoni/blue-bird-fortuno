'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  MessageCircle, 
  Settings, 
  Activity, 
  Clock, 
  CheckCircle, 
  Users,
  BarChart3,
  Shield
} from 'lucide-react'

export default function Agent() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Agente IA" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Agent Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Status do Agente
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Última Atividade</div>
                <div className="text-lg font-semibold">Há 2 minutos</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Mensagens Processadas</div>
                <div className="text-lg font-semibold">1.247</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Precisão de Detecção</div>
                <div className="text-lg font-semibold">94.2%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Real-time Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4" />
                Monitoramento em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Análise contínua de conversas do WhatsApp em busca de padrões suspeitos e violações de compliance.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Chats Monitorados</span>
                  <span className="font-medium">847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Grupos Ativos</span>
                  <span className="font-medium">203</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-4 h-4" />
                Detecção de Ameaças
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Identificação automática de riscos de segurança, vazamentos de dados e comportamentos inadequados.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ameaças Hoje</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    3 Pendentes
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de Falsos Positivos</span>
                  <span className="font-medium">2.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4" />
                Análises e Relatórios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Geração automática de relatórios de compliance e análises de padrões de comunicação.
              </p>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  Gerar Relatório Semanal
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Exportar Métricas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: '14:32',
                  action: 'Detectada possível violação de política',
                  chat: 'Grupo Financeiro RH',
                  status: 'alert'
                },
                {
                  time: '14:28',
                  action: 'Análise de sentimento completada',
                  chat: 'Chat Suporte Cliente',
                  status: 'success'
                },
                {
                  time: '14:15',
                  action: 'Novo padrão de risco identificado',
                  chat: 'Grupo Vendas Norte',
                  status: 'warning'
                },
                {
                  time: '14:02',
                  action: 'Relatório mensal gerado',
                  chat: 'Sistema',
                  status: 'info'
                },
                {
                  time: '13:45',
                  action: 'Backup de conversas realizado',
                  chat: 'Sistema',
                  status: 'success'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'alert' ? 'bg-red-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.chat}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações do Agente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Parâmetros de Detecção</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sensibilidade</span>
                    <Badge variant="outline">Alta</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Modo de Análise</span>
                    <Badge variant="outline">Tempo Real</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Automático</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ativado
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Ações Rápidas</h4>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Configurar Alertas
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Grupos
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Ajustar Parâmetros
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}