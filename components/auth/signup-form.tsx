"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Stethoscope } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-white px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create your account</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Join the dental practice management system</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {state.success}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Dr. John Smith"
                  required
                  className="h-12 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@practice.com"
                  required
                  className="h-12 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-12 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                />
                <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
              </div>
            </div>

            <SubmitButton />

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-violet-600 hover:text-violet-700 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
