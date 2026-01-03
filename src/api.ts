import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    testConnection: builder.query<{ success: boolean }, { id: string }>({
      query: ({ id }) => `/test-connection/${id}`,
    }),
  }),
})

export const { useLazyTestConnectionQuery } = api
