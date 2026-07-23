import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import { authInterceptor } from "../middleware/authInterceptor";
// import clientsReducer from "./clientsSlice"
// import productsReducer from "./productsSlice"
// import salesHistoryReducer from "./salesHistorySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // clients: clientsReducer,
    // products : productsReducer,
    // salesHistory : salesHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authInterceptor),
});