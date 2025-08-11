import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span
              className={`text-xs ${
                trend.value > 0
                  ? 'text-green-600'
                  : trend.value < 0
                  ? 'text-red-600'
                  : 'text-muted-foreground'
              }`}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}