import { supabase } from '@/lib/supabaseClient';

/**
 * Repository de autenticación.
 * Única capa que conoce a Supabase directamente.
 * No contiene lógica de negocio, solo llamadas crudas al SDK.
 */
export const authRepository = {
  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data // { user, session }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getMyProfile() {
    const { data, error } = await supabase.rpc('get_my_profile')
    if (error) throw error
    return data?.[0] ?? null
  },

  /**
   * Escucha cambios de sesión en tiempo real.
   * Supabase emite eventos cuando el token se refresca, la sesión
   * expira o el usuario es desconectado desde otro tab/dispositivo.
   * Devuelve una función para cancelar la suscripción (cleanup).
   */
  subscribeToAuthChanges(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => callback(event, session)
    )
    return () => subscription.unsubscribe()
  },
}