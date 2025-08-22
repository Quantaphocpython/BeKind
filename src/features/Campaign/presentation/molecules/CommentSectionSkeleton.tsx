import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const CommentSectionSkeleton = () => {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <CardTitle className="text-xl">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentSectionSkeleton
