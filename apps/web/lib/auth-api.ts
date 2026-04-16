import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type SignupRequest = {
  name: string
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    me: build.query<AuthUser | null, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({ url: "/auth/me", method: "GET" })
        if (result.error) {
          const status = Number((result.error as { status?: unknown }).status)
          if (status === 401) {
            return { data: null }
          }
          return { error: result.error }
        }
        const data = result.data as { user: AuthUser }
        return { data: data.user }
      },
      providesTags: (result) =>
        result ? [{ type: "Auth" as const, id: "ME" }] : [{ type: "Auth" as const, id: "GUEST" }],
    }),
    signup: build.mutation<{ user: AuthUser }, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "ME" }, { type: "Auth", id: "GUEST" }],
    }),
    login: build.mutation<{ user: AuthUser }, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "ME" }, { type: "Auth", id: "GUEST" }],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Auth", id: "ME" }, { type: "Auth", id: "GUEST" }],
    }),
  }),
})

export const { useMeQuery, useSignupMutation, useLoginMutation, useLogoutMutation } = authApi
