import { createSlice } from "@reduxjs/toolkit";
import { transfersController } from "../../backend/controllers/transfers.controller";
import { createServiceThunk } from "@/utils/createServiceThunk";


export const createTransfer = createServiceThunk(
  "transfers/create",
  (payload) => transfersController.create(payload),
);

const initialState = {
  items: [], // se poblará cuando armemos el Historial
  status: "idle",
  error: null,
  saving: false,
  lastCreated: null, // el último envío creado, útil para navegar al recibo
};

const transfersSlice = createSlice({
  name: "transfers",
  initialState,
  reducers: {
    clearTransfersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransfer.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.saving = false;
        state.lastCreated = action.payload;
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error creating transfer";
      });
  },
});

export const { clearTransfersError } = transfersSlice.actions;
export default transfersSlice.reducer;
