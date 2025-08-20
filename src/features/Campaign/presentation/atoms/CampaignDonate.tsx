import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

export const CampaignDonate = () => { 
  return (              <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm overflow-hidden relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary">
    <CardContent className="p-8 text-center space-y-8 relative z-10">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-2">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground font-serif mb-2">Support This Campaign</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Help bring this project to life with your contribution and be part of something amazing
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 font-semibold text-base rounded-xl border-0 relative overflow-hidden group"
          onClick={() => router.push(routeConfig(RouteEnum.Campaigns))}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Heart className="h-5 w-5 mr-3 relative z-10" />
          <span className="relative z-10">Donate Now</span>
        </Button>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Secure payment</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border"></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Instant confirmation</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  )