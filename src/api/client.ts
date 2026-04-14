import axios from 'axios'

export const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message)
  }
}

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data
    return Promise.reject(new ApiError(data?.code ?? 'UNKNOWN', data?.message ?? err.message))
  }
)
