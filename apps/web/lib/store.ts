import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./auth-api"


 export const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  })


export type AppStore = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
