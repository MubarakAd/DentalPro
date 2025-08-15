import Link from "next/link"
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">DentalPro</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              The complete dental practice management solution trusted by professionals worldwide.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <div className="space-y-2">
              <Link href="#features" className="block text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                Demo
              </Link>
              <Link href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <div className="space-y-2">
              <Link href="#about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="#testimonials" className="block text-muted-foreground hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@dentalpro.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1-800-DENTAL</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 DentalPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
