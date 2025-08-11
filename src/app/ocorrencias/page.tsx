'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, AlertTriangle, Clock, CheckCircle, X } from 'lucide-react'
import { useOccurrenceFilters, type Occurrence } from '@/hooks/useOccurrenceFilters'

// Mock data para demonstração
const mockOccurrences: Occurrence[] = [
  {
    id: 1,
    justification: "Linguagem ofensiva detectada",
    evidence: "Mensagem contém termos inadequados",
    keywords: "ofensa, linguagem imprópria",
    chatType: "group",
    chatId: "120363043899842108@g.us",
    chatName: "Grupo Vendas SP",
    channel: "WhatsApp",
    status: "pending",
    category: "Conduta",
    createdAt: "2025-01-11T08:30:00Z"
  },
  {
    id: 2,
    justification: "Possível vazamento de informação confidencial",
    evidence: "Compartilhamento de dados internos",
    keywords: "confidencial, dados internos",
    chatType: "private",
    chatId: "5511999887766",
    chatName: "João Silva",
    channel: "WhatsApp",
    status: "investigating",
    category: "Segurança",
    createdAt: "2025-01-11T07:15:00Z"
  },
  {
    id: 3,
    justification: "Conversa durante horário não permitido",
    evidence: "Mensagens enviadas fora do expediente",
    keywords: "horário, expediente",
    chatType: "group",
    chatId: "120363043899842109@g.us",
    chatName: "Suporte Técnico",
    channel: "WhatsApp",
    status: "resolved",
    category: "Política",
    createdAt: "2025-01-10T23:45:00Z"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    case 'investigating':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Investigando
      </Badge>
    case 'resolved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Resolvido
      </Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getCategoryBadge = (category: string) => {
  const colors = {
    'Conduta': 'bg-red-50 text-red-700 border-red-200',
    'Segurança': 'bg-orange-50 text-orange-700 border-orange-200',
    'Política': 'bg-purple-50 text-purple-700 border-purple-200'
  }
  
  return <Badge variant="outline" className={colors[category as keyof typeof colors] || ''}>
    {category}
  </Badge>
}

export default function Occurrences() {
  const {
    filters,
    filteredOccurrences,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    totalCount,
    filteredCount
  } = useOccurrenceFilters(mockOccurrences);

  return (
    <div className="flex flex-col h-full">
      <Header title="Ocorrências" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-black"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por justificativa, chat..." 
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => updateFilter('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="investigating">Investigando</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => updateFilter('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="conduta">Conduta</SelectItem>
                    <SelectItem value="segurança">Segurança</SelectItem>
                    <SelectItem value="política">Política</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Chat</label>
                <Select 
                  value={filters.chatType} 
                  onValueChange={(value) => updateFilter('chatType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="group">Grupo</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Mostrando {filteredCount} de {totalCount} ocorrências
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Occurrences Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Ocorrências</CardTitle>
              <div className="text-sm text-gray-600">
                {filteredCount} {filteredCount === 1 ? 'ocorrência' : 'ocorrências'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Chat</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Justificativa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Palavras-chave</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOccurrences.map((occurrence) => (
                  <TableRow key={occurrence.id}>
                    <TableCell className="font-medium">#{occurrence.id}</TableCell>
                    <TableCell>
                      {new Date(occurrence.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{occurrence.chatName}</div>
                        <div className="text-sm text-muted-foreground">
                          {occurrence.chatType === 'group' ? 'Grupo' : 'Privado'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(occurrence.category)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={occurrence.justification}>
                        {occurrence.justification}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(occurrence.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {occurrence.keywords.split(', ').map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredOccurrences.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma ocorrência encontrada</h3>
                <p>
                  {hasActiveFilters 
                    ? 'Não há ocorrências que correspondam aos filtros selecionados.'
                    : 'Não há ocorrências para exibir.'
                  }
                </p>
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={clearFilters}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}