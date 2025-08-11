import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  description?: string
  height?: number
}

export function ChartPlaceholder({
  title,
  description,
  height = 300,
}: ChartPlaceholderProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="flex items-center justify-center bg-muted rounded-lg"
          style={{ height: `${height}px` }}
        >
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Gráfico em desenvolvimento
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Os dados serão exibidos aqui quando a integração estiver completa
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}