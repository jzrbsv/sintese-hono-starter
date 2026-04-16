"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSignupMutation } from "@/lib/auth-api"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [signup, { isLoading }] = useSignupMutation()
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value
    const confirm = (form.elements.namedItem("confirm-password") as HTMLInputElement).value
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    try {
      await signup({ name, email, password }).unwrap()
      router.push("/")
      router.refresh()
    }
    catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { error?: string } }).data?.error ?? "Sign up failed.")
          : "Sign up failed."
      setError(message)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required minLength={8} />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                minLength={8}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            {error ? (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <Field>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Create Account"}
              </Button>
              <Button variant="outline" type="button" disabled>
                Sign up with Google
              </Button>
              <FieldDescription className="px-6 text-center">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
