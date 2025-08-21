'use client'

import { useState } from 'react'
import { Upload, FileText, Download, Loader2, AlertCircle, Eye, Copy } from 'lucide-react'
import { sendTranscriptToN8n, sendFileToN8n } from '@/lib/n8n'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReactMarkdown from 'react-markdown'

type AnalysisStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
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
  
  // Estados para modais
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)
  const [loadingStage, setLoadingStage] = useState<'uploading' | 'processing' | 'generating'>('uploading')
  
  // Histórico de análises
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([
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
  ])

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

    // Abrir modal de loading
    setIsLoadingModalOpen(true)
    setLoadingStage('uploading')

    try {
      // Enviar para n8n baseado no método de input
      if (inputMethod === 'text') {
        await sendTranscriptToN8n({
          name: analysisName.trim(),
          type: 'TRANSCRIPT',
          transcript: transcriptText
        })
        console.log('Transcript enviado para n8n com sucesso')
      } else {
        await sendFileToN8n({
          name: analysisName.trim(),
          type: 'FILE',
          file: selectedFile!
        })
        console.log('Arquivo enviado para n8n com sucesso')
      }
    } catch (error) {
      console.error('Erro ao enviar para n8n:', error)
      setIsLoadingModalOpen(false)
      alert('Erro ao enviar dados para processamento. Tente novamente.')
      return
    }

    // Simular processo com estágios
    setTimeout(() => setLoadingStage('processing'), 2000)
    setTimeout(() => setLoadingStage('generating'), 5000)

    // Simular conclusão e criar nova análise
    setTimeout(() => {
      const mockMarkdown = inputMethod === 'file' 
        ? generateMockMarkdownFromFile(selectedFile!)
        : generateMockMarkdownFromText(transcriptText)

      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        title: analysisName.trim(),
        fileName: inputMethod === 'file' ? selectedFile!.name : undefined,
        uploadedAt: new Date().toLocaleString('pt-BR'),
        processedAt: new Date().toLocaleString('pt-BR'),
        status: 'completed',
        duration: '35min',
        participants: ['Participante 1', 'Participante 2'],
        summary: 'Análise gerada com sucesso a partir do conteúdo fornecido.',
        inputMethod,
        markdownContent: mockMarkdown
      }

      setAnalysisHistory(prev => [newAnalysis, ...prev])
      setIsLoadingModalOpen(false)
      
      // Abrir preview do resultado
      setCurrentAnalysis(newAnalysis)
      setIsPreviewModalOpen(true)
      
      // Limpar formulário
      setSelectedFile(null)
      setTranscriptText('')
      setAnalysisName('')
    }, 8000)
  }

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
  }

  const handlePreview = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis)
    setIsPreviewModalOpen(true)
  }

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Aqui você pode adicionar uma notificação de sucesso
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'uploading':
        return 'Enviando arquivo...'
      case 'processing':
        return 'Processando conteúdo...'
      case 'generating':
        return 'Gerando análise em markdown...'
      default:
        return 'Processando...'
    }
  }

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
          <div className="space-y-4">
            {analysisHistory.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{analysis.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>📅 {analysis.uploadedAt}</span>
                      {analysis.duration && <span>⏱️ {analysis.duration}</span>}
                      <Badge variant="outline" className="text-xs">
                        {analysis.inputMethod === 'file' ? '📁 Arquivo' : '📝 Texto'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(analysis)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(analysis)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {analysis.participants && (
                  <div className="text-sm text-gray-600">
                    <strong>Participantes:</strong> {analysis.participants.join(', ')}
                  </div>
                )}

                {analysis.summary && (
                  <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
                    {analysis.summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Card de Informação sobre n8n */}
      <Card className="border-sky-200 bg-sky-50 max-w-4xl mx-auto px-4 sm:px-0">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-sky-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-sky-700">Integração com n8n</p>
              <p className="text-sky-600 mt-1">
                Esta funcionalidade está conectada com workflows automatizados que processam os arquivos de áudio/vídeo. 
                As análises são processadas automaticamente por IA para gerar documentos markdown estruturados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Modal de Loading */}
      <Dialog open={isLoadingModalOpen} onOpenChange={setIsLoadingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando Análise
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="mb-4">
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-sky-500" />
              </div>
              <p className="text-lg font-medium">{getLoadingMessage()}</p>
              <p className="text-sm text-gray-500 mt-2">
                Este processo pode levar alguns minutos...
              </p>
            </div>
            
            {/* Indicador de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={loadingStage === 'uploading' ? 'text-sky-600 font-medium' : 'text-gray-400'}>
                  ✓ Enviando
                </span>
                <span className={loadingStage === 'processing' ? 'text-sky-600 font-medium' : 'text-gray-400'}>
                  {loadingStage === 'processing' || loadingStage === 'generating' ? '⏳' : '○'} Processando
                </span>
                <span className={loadingStage === 'generating' ? 'text-sky-600 font-medium' : 'text-gray-400'}>
                  {loadingStage === 'generating' ? '⏳' : '○'} Gerando
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: loadingStage === 'uploading' ? '33%' : 
                           loadingStage === 'processing' ? '66%' : 
                           loadingStage === 'generating' ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
  )
}
