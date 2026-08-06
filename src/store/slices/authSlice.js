import { createSlice } from "@reduxjs/toolkit";
import { authController } from "../../backend/controllers/auth.controller";
import { createServiceThunk } from "@/utils/createServiceThunk";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginUser = createServiceThunk(
  "auth/login",
  ({ email, password }) => authController.login(email, password),
);

export const logoutUser = createServiceThunk("auth/logout", async () => {
  await authController.logout();
  return true;
});

export const restoreSession = createServiceThunk("auth/restoreSession", () =>
  authController.restoreSession(),
);

/**
 * watchSession — suscripción en tiempo real a cambios de sesión de Supabase.
 *
 * No es un createServiceThunk (no tiene pending/fulfilled/rejected) porque
 * es una suscripción continua, no una operación puntual.
 * Se dispara UNA sola vez desde App.jsx y retorna el unsubscribe para el
 * cleanup del useEffect.
 *
 * Eventos que maneja:
 *  - SIGNED_OUT     → limpia el store (forceLogout) → ProtectedRoute redirige al login
 *  - TOKEN_REFRESHED → actualiza el token en el store sin cerrar la sesión
 */
export const watchSession = () => (dispatch) => {
  const unsubscribe = authController.subscribeToAuthChanges(
    (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        dispatch(forceLogout());
      }

      if (event === "TOKEN_REFRESHED" && session) {
        dispatch(
          sessionRefreshed({
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at,
          }),
        );
      }
    },
  );

  return unsubscribe;
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: null, // { id, email, fullName, role }
  session: null, // { accessToken, refreshToken, expiresAt }
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  sessionChecked: false, // true una vez que restoreSession resuelve (fulfilled o rejected)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    // Usado por authInterceptor y watchSession cuando la sesión expira/es revocada.
    forceLogout(state) {
      state.user = null;
      state.session = null;
      state.status = "idle";
      state.error = null;
    },
    // Actualiza el token cuando Supabase lo refresca automáticamente.
    sessionRefreshed(state, action) {
      if (state.session) {
        state.session.accessToken = action.payload.accessToken;
        state.session.refreshToken = action.payload.refreshToken;
        state.session.expiresAt = action.payload.expiresAt;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Error al iniciar sesión";
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.status = "idle";
      })
      // restoreSession — rehidrata Redux desde localStorage al recargar
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.session = action.payload.session;
        }
        state.status = "idle";
        state.sessionChecked = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "idle";
        state.sessionChecked = true;
      });
  },
});

export const { clearAuthError, forceLogout, sessionRefreshed } =
  authSlice.actions;
export default authSlice.reducer;
