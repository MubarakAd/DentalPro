import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl lg:text-5xl font-bold">Ready to Transform Your Practice?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of dental professionals who have streamlined their operations and improved patient care with
            DentalPro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>

          <div className="pt-8 text-sm opacity-75">No credit card required • 14-day free trial • Cancel anytime</div>
        </div>
      </div>
    </section>
  )
}
