import { authService } from '../services/auth.service'


export const authController = {
  login: (email, password) => authService.login(email, password),
  logout: () => authService.logout(),
  restoreSession: () => authService.restoreSession(),
  subscribeToAuthChanges: (callback) => authService.subscribeToAuthChanges(callback),
}