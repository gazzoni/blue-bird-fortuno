'use client'

import { useState } from 'react'
import { Upload, FileText, Download, Loader2, AlertCircle, Eye, Copy } from 'lucide-react'
import { sendTranscriptToN8n, sendFileToN8n, type N8nResponse } from '@/lib/n8n'
import { useDocuments } from '@/hooks/useDocuments'
import type { Document } from '@/types/database'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReactMarkdown from 'react-markdown'

type AnalysisStatus = 'idle' | 'uploading' | 'processing' | 'running' | 'completed' | 'error'
type InputMethod = 'file' | 'text'

interface AnalysisResult {
  id: string
  title: string
  fileName?: string
  uploadedAt: string
  processedAt?: string
  status: AnalysisStatus
  duration?: string
  participants?: string[]
  summary?: string
  markdownContent?: string
  inputMethod: InputMethod
}

export default function AnalisePage() {
  // Estados para nova análise
  const [inputMethod, setInputMethod] = useState<InputMethod>('file')
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [transcriptText, setTranscriptText] = useState('')
  const [analysisName, setAnalysisName] = useState('')
  
  // Hook para gerenciar documentos reais do banco
  const { documents, loading: documentsLoading, error: documentsError, fetchDocuments } = useDocuments()
  
  // Estados para modais (loading modal removido)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)
  // loadingStage removido - não é mais usado no novo fluxo
  
  // Histórico de análises (removido - agora usa documents do banco)
  /* const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([
    {
      id: '1',
      title: 'Reunião Cliente ABC - Implementação Sistema',
      fileName: 'reuniao_cliente_abc_20240118.mp3',
      uploadedAt: '2024-01-18 14:30',
      processedAt: '2024-01-18 14:35',
      status: 'completed',
      duration: '45min',
      participants: ['João Silva (Cliente)', 'Ana Santos (Atendente)'],
      summary: 'Reunião sobre implementação de novo sistema de gestão. Cliente solicitou integração com ERP existente.',
      inputMethod: 'file',
      markdownContent: `# Análise da Reunião - Cliente ABC

## Resumo Executivo
Reunião realizada em 18/01/2024 para discussão da implementação do novo sistema de gestão.

## Participantes
- **João Silva** - Cliente (ABC Empresa)
- **Ana Santos** - Consultora de Implementação

## Pontos Principais Discutidos

### 1. Escopo do Projeto
- Implementação de sistema ERP
- Integração com sistema atual
- Migração de dados históricos

### 2. Cronograma
- **Fase 1**: Levantamento de requisitos (2 semanas)
- **Fase 2**: Configuração inicial (3 semanas)
- **Fase 3**: Testes e ajustes (2 semanas)
- **Fase 4**: Go-live (1 semana)

### 3. Investimento
- Valor total: R$ 150.000,00
- Pagamento em 3x sem juros
- Inclui treinamento da equipe

## Próximos Passos
1. Envio da proposta comercial
2. Assinatura do contrato
3. Início do levantamento de requisitos

## Observações
Cliente demonstrou interesse imediato. Prazo para resposta: 5 dias úteis.`
    },
    {
      id: '2',
      title: 'Call XYZ Empresa - Suporte Técnico',
      fileName: 'call_recording_xyz_empresa.wav',
      uploadedAt: '2024-01-17 16:20',
      processedAt: '2024-01-17 16:28',
      status: 'completed',
      duration: '32min',
      participants: ['Maria Costa (Cliente)', 'Pedro Oliveira (Consultor)'],
      summary: 'Discussão sobre problemas de performance e possíveis soluções. Definidos próximos passos.',
      inputMethod: 'file',
      markdownContent: `# Relatório de Suporte - XYZ Empresa

## Resumo da Chamada
Atendimento técnico para resolução de problemas de performance no sistema.

## Participantes
- **Maria Costa** - Gerente de TI (XYZ Empresa)
- **Pedro Oliveira** - Consultor Técnico

## Problemas Identificados

### 1. Lentidão no Sistema
- Consultas demoradas no banco de dados
- Timeout em relatórios complexos
- Interface travando em horários de pico

### 2. Análise Técnica
- **Causa**: Índices desatualizados no banco
- **Impacto**: 40% de redução na performance
- **Urgência**: Alta

## Soluções Propostas

### Imediatas
- Reindexação do banco de dados
- Limpeza de logs antigos
- Otimização de consultas críticas

### Médio Prazo
- Upgrade do servidor
- Implementação de cache
- Monitoramento automatizado

## Cronograma de Execução
- **Hoje**: Reindexação (2h de manutenção)
- **Amanhã**: Limpeza e otimização
- **Próxima semana**: Implementação das melhorias

## Resultado Esperado
Melhoria de 60% na performance geral do sistema.`
    },
    {
      id: '3',
      title: 'Transcript Manual - Reunião Estratégica',
      uploadedAt: '2024-01-16 09:15',
      processedAt: '2024-01-16 09:22',
      status: 'completed',
      duration: '28min',
      participants: ['Equipe de Desenvolvimento', 'Product Owner'],
      summary: 'Definição de roadmap para próximo trimestre e priorização de features.',
      inputMethod: 'text',
      markdownContent: `# Reunião Estratégica - Q1 2024

## Objetivo
Definir roadmap e prioridades para o primeiro trimestre de 2024.

## Participantes
- **Maria Silva** - Product Owner
- **João Santos** - Tech Lead
- **Ana Costa** - UX Designer
- **Pedro Lima** - Backend Developer

## Decisões Tomadas

### Features Prioritárias
1. **Dashboard Analytics** - Prioridade Alta
   - Métricas em tempo real
   - Gráficos interativos
   - Exportação de relatórios

2. **Sistema de Notificações** - Prioridade Média
   - Push notifications
   - Email automático
   - Configurações por usuário

3. **Integração API** - Prioridade Baixa
   - Webhooks
   - Rate limiting
   - Documentação

### Recursos Alocados
- 2 desenvolvedores full-time
- 1 designer part-time
- Budget de R$ 50.000 para ferramentas

## Timeline
- **Semana 1-4**: Dashboard Analytics
- **Semana 5-8**: Sistema de Notificações
- **Semana 9-12**: Integração API

## Métricas de Sucesso
- 95% de uptime
- Tempo de carregamento < 2s
- NPS > 8.0

## Próxima Reunião
30/01/2024 às 14h para review do progresso.`
    }
  ]) */

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleSubmitAnalysis = async () => {
    const hasFile = selectedFile !== null
    const hasText = transcriptText.trim() !== ''
    const hasName = analysisName.trim() !== ''
    
    if (!hasName || (!hasFile && !hasText)) return

    try {
      // Enviar para n8n baseado no método de input
      let response: N8nResponse
      
      if (inputMethod === 'text') {
        response = await sendTranscriptToN8n({
          name: analysisName.trim(),
          type: 'TRANSCRIPT',
          transcript: transcriptText
        })
      } else {
        response = await sendFileToN8n({
          name: analysisName.trim(),
          type: 'MEDIA',
          file: selectedFile!
        })
      }
      
      console.log('Enviado para n8n com sucesso:', response)
      
      // Mostrar feedback de sucesso
      if (response.status === 'running') {
        alert(`✅ Análise iniciada com sucesso!\nID: ${response.id}\n\nO documento aparecerá na lista abaixo como "Processando" e será atualizado automaticamente quando concluído.`)
        
        // Limpar formulário
        setAnalysisName('')
        setSelectedFile(null)
        setTranscriptText('')
        
        // Força refresh da lista de documentos para mostrar o novo documento
        fetchDocuments()
      } else {
        alert(`⚠️ Status inesperado: ${response.status}\n${response.message}`)
      }
      
    } catch (error) {
      console.error('Erro ao enviar para n8n:', error)
      alert('❌ Erro ao enviar dados para processamento. Tente novamente.')
    }
  }

  /* Funções mock removidas - não são mais usadas
  const generateMockMarkdownFromFile = (file: File): string => {
    return `# Análise de Reunião - ${file.name}

## Resumo Executivo
Análise automatizada gerada a partir do arquivo de áudio/vídeo fornecido.

## Informações do Arquivo
- **Nome**: ${file.name}
- **Tamanho**: ${(file.size / 1024 / 1024).toFixed(1)} MB
- **Tipo**: ${file.type || 'Não identificado'}
- **Processado em**: ${new Date().toLocaleString('pt-BR')}

## Participantes Identificados
- Participante 1 (Principal)
- Participante 2 (Secundário)

## Tópicos Principais

### 1. Abertura da Reunião
- Apresentações iniciais
- Definição da agenda
- Objetivos estabelecidos

### 2. Discussões Principais
- Ponto A: Questões técnicas
- Ponto B: Aspectos comerciais
- Ponto C: Cronograma

### 3. Decisões Tomadas
- Decisão 1: Aprovação do escopo
- Decisão 2: Definição de prazos
- Decisão 3: Próximos passos

## Ações Definidas
1. [ ] Ação 1 - Responsável: TBD
2. [ ] Ação 2 - Responsável: TBD
3. [ ] Ação 3 - Responsável: TBD

## Próximos Passos
- Agendar reunião de follow-up
- Preparar documentação necessária
- Iniciar execução das ações

*Análise gerada automaticamente por IA em ${new Date().toLocaleString('pt-BR')}*`
  }

  const generateMockMarkdownFromText = (text: string): string => {
    const wordCount = text.split(' ').length
    return `# Análise de Transcript Manual

## Resumo Executivo
Análise automatizada gerada a partir do texto de transcript fornecido.

## Informações do Transcript
- **Palavras**: ${wordCount}
- **Caracteres**: ${text.length}
- **Processado em**: ${new Date().toLocaleString('pt-BR')}

## Conteúdo Original (Trecho)
\`\`\`
${text.substring(0, 200)}${text.length > 200 ? '...' : ''}
\`\`\`

## Análise Estruturada

### 1. Temas Identificados
- Tema principal extraído do conteúdo
- Subtemas relacionados
- Contexto geral da discussão

### 2. Pontos-Chave
- **Ponto 1**: Elemento importante identificado
- **Ponto 2**: Decisão ou acordo mencionado
- **Ponto 3**: Ação ou próximo passo definido

### 3. Participantes Mencionados
- Pessoa/Papel 1
- Pessoa/Papel 2
- Outros envolvidos

## Insights e Recomendações

### Principais Insights
- Insight 1 baseado no conteúdo
- Insight 2 sobre padrões identificados
- Insight 3 sobre oportunidades

### Recomendações
1. Recomendação baseada na análise
2. Sugestão de melhoria
3. Próximo passo recomendado

## Conclusão
Resumo final dos pontos mais importantes e direcionamentos sugeridos.

*Análise gerada automaticamente por IA em ${new Date().toLocaleString('pt-BR')}*`
  } */

  // handlePreview removido - agora usa handlePreviewDocument

  const handleDownload = (analysis: AnalysisResult) => {
    if (!analysis.markdownContent) return
    
    const blob = new Blob([analysis.markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${analysis.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Funções para documentos reais do banco
  const handlePreviewDocument = (doc: Document) => {
    if (!doc.document_content) return
    
    // Converter Document para AnalysisResult para compatibilidade com o modal
    const analysisResult: AnalysisResult = {
      id: doc.id.toString(),
      title: doc.document_name,
      fileName: doc.origin_type === 'MEDIA' ? doc.document_name : undefined,
      uploadedAt: new Date(doc.created_at).toLocaleString('pt-BR'),
      processedAt: undefined, // Não temos esse campo no novo schema
      status: doc.origin_status,
      duration: undefined, // Não temos mais metadata
      participants: undefined, // Não temos mais metadata
      summary: undefined, // Não temos mais metadata
      inputMethod: doc.origin_type === 'MEDIA' ? 'file' : 'text',
      markdownContent: doc.document_content
    }
    
    setCurrentAnalysis(analysisResult)
    setIsPreviewModalOpen(true)
  }

  const handleDownloadDocument = (doc: Document) => {
    if (!doc.document_content) return
    
    const blob = new Blob([doc.document_content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.document_name.replace(/[^a-zA-Z0-9]/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Aqui você pode adicionar uma notificação de sucesso
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  // getLoadingMessage removido - modal de loading não é mais usado

  return (
    <div className="flex flex-col h-full">
      <Header title="Análise de Reuniões" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Seção 1: Nova Análise */}
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Nova Análise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome da Análise */}
          <div className="space-y-2">
            <Label htmlFor="analysis-name" className="text-sm font-medium">
              Nome da Análise <span className="text-red-500">*</span>
            </Label>
            <Input
              id="analysis-name"
              placeholder="Ex: Reunião Cliente ABC - Implementação ERP"
              value={analysisName}
              onChange={(e) => setAnalysisName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Método de Input - Tab Switch */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Selecione o método de entrada:</Label>
            <div>
              <div className="bg-muted p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setInputMethod('file')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    inputMethod === 'file'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Enviar Arquivo
                </button>
                <button
                  onClick={() => setInputMethod('text')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    inputMethod === 'text'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Colar Transcript
                </button>
              </div>
            </div>
          </div>

          {/* Upload de Arquivo */}
          {inputMethod === 'file' && (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-sky-500 bg-sky-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="text-gray-500 mb-4">
                  ou clique para selecionar arquivo
                </p>
                <Input
                  type="file"
                  accept=".mp3,.wav,.mp4,.mov,.txt,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Selecionar Arquivo
                  </Button>
                </Label>
                <p className="text-xs text-gray-400 mt-2">
                  Formatos: MP3, WAV, MP4, MOV, TXT, PDF (máx. 100MB)
                </p>
              </div>

              {/* Arquivo Selecionado */}
              {selectedFile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input de Texto */}
          {inputMethod === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="transcript">Cole o transcript da reunião:</Label>
              <Textarea
                id="transcript"
                placeholder="Cole aqui o texto da transcrição da reunião..."
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <p className="text-xs text-gray-500">
                {transcriptText.length} caracteres
              </p>
            </div>
          )}

          {/* Botão de Envio */}
          <Button 
            onClick={handleSubmitAnalysis}
            className="w-full bg-sky-500 hover:bg-sky-600"
            disabled={
              !analysisName.trim() ||
              (inputMethod === 'file' && !selectedFile) || 
              (inputMethod === 'text' && transcriptText.trim() === '')
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Gerar Análise
          </Button>
        </CardContent>
      </Card>
      </div>

      {/* Seção 2: Histórico de Análises */}
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Análises
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
              <span className="ml-2 text-gray-600">Carregando documentos...</span>
            </div>
          ) : documentsError ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <span className="ml-2 text-red-600">Erro ao carregar documentos: {documentsError}</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma análise encontrada</p>
              <p className="text-sm">Crie sua primeira análise acima!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{document.document_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>📅 {new Date(document.created_at).toLocaleDateString('pt-BR')}</span>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {document.origin_type === 'MEDIA' ? '📁 Arquivo' : '📝 Transcript'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            document.origin_status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700' :
                            document.origin_status === 'running' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700' :
                            'bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
                          }`}
                        >
                          {document.origin_status === 'completed' ? '✅ Concluído' :
                           document.origin_status === 'running' ? '⏳ Processando' :
                           '❌ Erro'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewDocument(document)}
                        className="flex items-center gap-1"
                        disabled={document.origin_status !== 'completed' || !document.document_content}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(document)}
                        className="flex items-center gap-1"
                        disabled={document.origin_status !== 'completed' || !document.document_content}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Metadata removido - agora usando campos diretos da tabela */}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Card de informação removido */}

      {/* Modal de Loading removido - agora usa feedback direto */}

      {/* Modal de Preview */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{currentAnalysis?.title}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => currentAnalysis?.markdownContent && copyToClipboard(currentAnalysis.markdownContent)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => currentAnalysis && handleDownload(currentAnalysis)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg border">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                    code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 overflow-x-auto mb-3">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-sky-500 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                  }}
                >
                  {currentAnalysis?.markdownContent || ''}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      </div>
    </div>
  )
}
