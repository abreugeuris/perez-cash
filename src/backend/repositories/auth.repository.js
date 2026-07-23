import { supabase } from '../../lib/supaBase'

/**
 * Repository de autenticación.
 * Única capa que conoce a Supabase directamente.
 * No contiene lógica de negocio, solo llamadas crudas al SDK.
 */
export const authRepository = {
  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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

  // Trae el perfil del usuario actual vía RPC (nunca .from('profiles')
  // directo desde React). El RPC usa auth.uid() internamente, por eso
  // no recibe parámetros.
  async getMyProfile() {
    const { data, error } = await supabase.rpc('get_my_profile')
    if (error) throw error
    // get_my_profile devuelve un array (returns table); tomamos la 1ra fila
    return data?.[0] ?? null
  },
}