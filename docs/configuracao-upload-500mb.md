# Configuração para Upload de 500MB

## 📊 Análise da Stack

Sua aplicação foi atualizada para suportar **uploads de até 500MB**. Este limite foi escolhido baseado na análise das limitações técnicas da sua stack:

### 🔧 **Stack Analisada**
- **Frontend**: Next.js 15.4.6 + React 19
- **Backend**: Supabase
- **Processamento**: N8N via webhook
- **Deploy**: Vercel (presumido)

---

## ⚙️ **Configurações Implementadas**

### 1. **Frontend (Next.js) ✅**
- Limite atualizado de 100MB → **500MB**
- Mensagens de erro atualizadas
- Interface mostra "máx. 500MB"
- Configuração do `next.config.ts` para API routes

### 2. **N8N (Requer Configuração Manual) ⚠️**

Para que o n8n aceite arquivos de 500MB, você precisa configurar as seguintes variáveis de ambiente:

```bash
# Aumentar limite de payload
N8N_PAYLOAD_SIZE_MAX=512

# Aumentar limite de form-data
N8N_FORMDATA_FILE_SIZE_MAX=512

# Otimizar para arquivos grandes (recomendado)
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
```

#### **Como Aplicar:**

**Se usar Docker:**
```yaml
# docker-compose.yml
services:
  n8n:
    environment:
      - N8N_PAYLOAD_SIZE_MAX=512
      - N8N_FORMDATA_FILE_SIZE_MAX=512
      - N8N_DEFAULT_BINARY_DATA_MODE=filesystem
```

**Se usar instalação direta:**
```bash
# Adicionar ao .env ou exportar
export N8N_PAYLOAD_SIZE_MAX=512
export N8N_FORMDATA_FILE_SIZE_MAX=512
export N8N_DEFAULT_BINARY_DATA_MODE=filesystem
```

### 3. **Supabase (Verificar) ℹ️**

Verifique sua configuração atual:

- **Plano Free**: Limite de 50MB (insuficiente)
- **Plano Pro+**: Até 500GB configurável

**Para arquivos > 50MB**, considere:
1. Upgrade para plano Pro
2. Ou configurar limite global no painel Supabase

---

## 🚀 **Benefícios do 500MB**

### ✅ **Casos de Uso Suportados**
- **Arquivos de áudio** longos (até 8h em MP3 128kbps)
- **Vídeos curtos/médios** (até 30min em 1080p)
- **PDFs** com muitas imagens
- **Apresentações** complexas
- **Documentos** extensos

### ⚡ **Performance**
- Upload via **FormData** (rápido)
- Fallback para **Base64** (compatibilidade)
- Validação no frontend (economia de banda)

---

## 📋 **Checklist de Configuração**

### Frontend ✅
- [x] Limite aumentado para 500MB
- [x] Mensagens atualizadas
- [x] Interface atualizada
- [x] next.config.ts configurado

### N8N ⚠️
- [ ] Configurar `N8N_PAYLOAD_SIZE_MAX=512`
- [ ] Configurar `N8N_FORMDATA_FILE_SIZE_MAX=512`
- [ ] Configurar `N8N_DEFAULT_BINARY_DATA_MODE=filesystem`
- [ ] Reiniciar serviço n8n
- [ ] Testar upload de arquivo grande

### Supabase ℹ️
- [ ] Verificar plano atual
- [ ] Configurar limite global se necessário
- [ ] Testar upload via interface

### Infraestrutura 🔧
- [ ] Verificar proxy/nginx (se aplicável)
- [ ] Verificar disk space suficiente
- [ ] Monitorar performance inicial

---

## 🧪 **Como Testar**

1. **Arquivo pequeno** (< 10MB): Deve funcionar normalmente
2. **Arquivo médio** (50-100MB): Testar ambos os métodos
3. **Arquivo grande** (200-400MB): Verificar se fallback Base64 funciona
4. **Arquivo limite** (~500MB): Teste final de capacidade

### **Sinais de Problema:**
- ❌ Timeout durante upload
- ❌ Erro 413 (Entity Too Large)
- ❌ Erro 502/504 (Gateway timeout)
- ❌ Falha no processamento n8n

---

## 🔍 **Monitoramento Recomendado**

### **Métricas a Observar:**
- Tempo médio de upload
- Taxa de sucesso/falha
- Uso de memória durante uploads
- Performance do sistema n8n

### **Alertas Configurar:**
- Upload falhando consistentemente
- Tempo de resposta > 5 minutos
- Uso de memória > 80%

---

## 🆘 **Troubleshooting**

### **Se Upload Falha:**
1. Verificar logs do n8n
2. Confirmar variáveis de ambiente
3. Testar com arquivo menor
4. Verificar espaço em disco

### **Se Performance Ruim:**
1. Verificar `N8N_DEFAULT_BINARY_DATA_MODE=filesystem`
2. Considerar upgrade de hardware
3. Implementar retry automático
4. Adicionar progress bar (futuro)

---

## 📈 **Próximos Passos (Futuro)**

### **Melhorias Possíveis:**
- [ ] Progress bar para uploads grandes
- [ ] Compressão automática de arquivos
- [ ] Upload chunked/resumível
- [ ] Preview de arquivos antes do upload
- [ ] Cache de uploads recentes

### **Otimizações Avançadas:**
- [ ] CDN para uploads (CloudFlare, etc.)
- [ ] Background processing
- [ ] Notificações push quando processamento completo
- [ ] Análise automática de qualidade de áudio/vídeo

---

*Documento criado em: ${new Date().toLocaleDateString('pt-BR')}*
*Limite anterior: 100MB → Novo limite: 500MB*
