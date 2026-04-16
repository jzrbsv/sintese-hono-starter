"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useLogoutMutation, useMeQuery } from "@/lib/auth-api"

export function AuthStatus() {
  const { data: user, isLoading } = useMeQuery()
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Checking session…</p>
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm">
          Signed in as <span className="font-medium">{user.name}</span> ({user.email})
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoggingOut}
          onClick={() => {
            void logout()
          }}
        >
          {isLoggingOut ? "Signing out…" : "Log out"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Sign up</Link>
      </Button>
    </div>
  )
}
