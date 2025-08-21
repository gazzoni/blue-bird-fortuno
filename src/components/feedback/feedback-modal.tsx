"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  occurrenceId: number
  onSubmit?: (feedback: { type: 'like' | 'dislike'; comment: string; occurrenceId: number }) => void
}

export function FeedbackModal({ isOpen, onClose, occurrenceId, onSubmit }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<'like' | 'dislike' | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!feedbackType) return

    setIsSubmitting(true)
    
    try {
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({
          type: feedbackType,
          comment: comment.trim(),
          occurrenceId
        })
      }
      
      // Reset form and close modal
      setFeedbackType(null)
      setComment('')
      onClose()
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFeedbackType(null)
    setComment('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Feedback da Ocorrência #{occurrenceId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Like/Dislike Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Como você avalia esta ocorrência?</label>
            <div className="flex gap-4 justify-center">
              <Button
                variant={feedbackType === 'like' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setFeedbackType('like')}
                className={cn(
                  "flex-1 h-16 flex flex-col gap-2",
                  feedbackType === 'like' && "bg-sky-500 hover:bg-sky-600 text-white"
                )}
              >
                <ThumbsUp className="w-6 h-6" />
                <span>Útil</span>
              </Button>
              
              <Button
                variant={feedbackType === 'dislike' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setFeedbackType('dislike')}
                className={cn(
                  "flex-1 h-16 flex flex-col gap-2",
                  feedbackType === 'dislike' && "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                <ThumbsDown className="w-6 h-6" />
                <span>Não útil</span>
              </Button>
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Comentário {feedbackType === 'dislike' ? '(obrigatório)' : '(opcional)'}
            </label>
            <Textarea
              placeholder={
                feedbackType === 'like' 
                  ? "O que foi mais útil nesta ocorrência?"
                  : feedbackType === 'dislike'
                  ? "O que poderia ser melhorado?"
                  : "Deixe seu comentário..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Validation message */}
          {feedbackType === 'dislike' && comment.trim().length === 0 && (
            <p className="text-sm text-red-600">
              Para feedback negativo, é obrigatório deixar um comentário explicativo.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!feedbackType || (feedbackType === 'dislike' && comment.trim().length === 0) || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
