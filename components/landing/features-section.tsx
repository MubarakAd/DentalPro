import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, FileText, BarChart3, Shield, Clock } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent appointment booking with automated reminders and conflict resolution.",
  },
  {
    icon: Users,
    title: "Patient Management",
    description: "Comprehensive patient records with treatment history and insurance tracking.",
  },
  {
    icon: FileText,
    title: "Digital Records",
    description: "Secure, searchable patient files with easy import/export capabilities.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into practice performance and revenue tracking.",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Enterprise-grade security ensuring patient data protection and compliance.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock technical support and training for your team.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">Everything You Need to Run Your Practice</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From appointment scheduling to financial reporting, DentalPro provides all the tools you need in one
            integrated platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
