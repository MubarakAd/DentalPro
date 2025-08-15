import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    practice: "Smile Dental Care",
    content:
      "DentalPro has revolutionized how we manage our practice. The scheduling system alone has saved us hours every week.",
    rating: 5,
  },
  {
    name: "Dr. Michael Chen",
    practice: "Downtown Dentistry",
    content: "The patient management features are incredible. We can access complete treatment histories instantly.",
    rating: 5,
  },
  {
    name: "Dr. Emily Rodriguez",
    practice: "Family Dental Group",
    content: "Outstanding support team and the analytics help us make better business decisions every day.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">Trusted by Dental Professionals</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of dental practices that have transformed their operations with DentalPro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground">{testimonial.practice}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
