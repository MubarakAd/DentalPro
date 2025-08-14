import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "DentalPro - Practice Management System",
  description: "Comprehensive dental practice management with patient records, appointments, and reporting",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="font-sans">
        {user && <Navigation user={user} />}
        <main className={user ? "" : ""}>{children}</main>
      </body>
    </html>
  )
}
