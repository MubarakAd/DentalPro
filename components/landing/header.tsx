import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Stethoscope } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">DentalPro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Demo
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
