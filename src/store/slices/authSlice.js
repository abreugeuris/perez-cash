import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authController } from '../../backend/controllers/auth.controller'
 
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authController.login(email, password)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
 
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authController.logout()
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
 
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authController.restoreSession()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
 
const initialState = {
  user: null, // { id, email, role }
  session: null, // { accessToken, refreshToken, expiresAt }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}
 
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    // Usado por el middleware interceptor cuando detecta un JWT
    // vencido/inválido en CUALQUIER request de la app, no solo auth.
    forceLogout(state) {
      state.user = null
      state.session = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.session = action.payload.session
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message ?? 'Error al iniciar sesión'
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.session = null
        state.status = 'idle'
      })
      // restaurar sesión (por ejemplo, al recargar la página)
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user
          state.session = action.payload.session
        }
        state.status = 'idle'
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'idle'
      })
  },
})
 
export const { clearAuthError, forceLogout } = authSlice.actions
export default authSlice.reducer