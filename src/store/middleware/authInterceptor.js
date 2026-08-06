import toast from 'react-hot-toast'
import { forceLogout } from '../slices/authSlice'

const SESSION_ERROR_PATTERNS = [
  'jwt expired',
  'invalid jwt',
  'invalid refresh token',
  'refresh token not found',
  'not authenticated',
]

function isSessionError(payload) {
  if (!payload) return false
  const message = (payload.message || '').toLowerCase()
  return payload.status === 401 || SESSION_ERROR_PATTERNS.some((p) => message.includes(p))
}

/**
 * Interceptor global de sesión.
 * Escucha TODOS los thunks rechazados de cualquier slice (senders,
 * beneficiaries, rates, transfers...) y si detecta un error de sesión
 * vencida/inválida, limpia el store y avisa al usuario.
 * El redirect al login lo maneja ProtectedRoute al ver user = null.
 */
export const authInterceptor = (store) => (next) => (action) => {
  const isRejected = typeof action.type === 'string' && action.type.endsWith('/rejected')

  if (isRejected && action.type !== 'auth/login/rejected' && isSessionError(action.payload)) {
    store.dispatch(forceLogout())
    toast.error('Tu sesión expiró. Inicia sesión de nuevo.')
  }

  return next(action)
}