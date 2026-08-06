import { jwtDecode } from 'jwt-decode'
import { authRepository } from '../repositories/auth.repository'

/**
 * Normaliza cualquier error de Supabase (o de red) a un shape
 * consistente que el resto de la app pueda leer sin importar el origen.
 */
function normalizeError(error) {
  return {
    message: error?.message || 'Ha ocurrido un error inesperado',
    status: error?.status ?? null,
  }
}

/**
 * Construye el objeto de sesión que guardamos en el store.
 * - rol: viene del claim "user_role" del JWT (Custom Access Token Hook).
 * - fullName y active: vienen del RPC get_my_profile (nunca .from() directo).
 */
async function buildSessionPayload(data) {
  const decoded = jwtDecode(data.session.access_token)
  const profile = await authRepository.getMyProfile()

  if (!profile || !profile.active) {
    await authRepository.signOut()
    throw { message: 'Tu usuario está inactivo. Contacta al dueño del negocio.', status: 403 }
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      fullName: profile.full_name,
      role: decoded.user_role ?? profile.role ?? null,
    },
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  }
}

export const authService = {
  async login(email, password) {
    try {
      const data = await authRepository.signInWithPassword(email, password)
      return await buildSessionPayload(data)
    } catch (error) {
      throw normalizeError(error)
    }
  },

  async logout() {
    try {
      await authRepository.signOut()
    } catch (error) {
      throw normalizeError(error)
    }
  },

  async restoreSession() {
    try {
      const session = await authRepository.getSession()
      if (!session) return null

      const decoded = jwtDecode(session.access_token)
      const profile = await authRepository.getMyProfile()

      if (!profile || !profile.active) {
        await authRepository.signOut()
        return null
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          fullName: profile.full_name,
          role: decoded.user_role ?? profile.role ?? null,
        },
        session: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
        },
      }
    } catch (error) {
      throw normalizeError(error)
    }
  },

  subscribeToAuthChanges(callback) {
    return authRepository.subscribeToAuthChanges(callback)
  },
}