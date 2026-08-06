import { createSlice } from "@reduxjs/toolkit";
import { sendersController } from "../../backend/controllers/Senders.controller.js";
import { createServiceThunk } from "@/utils/createServiceThunk";



export const fetchSenders = createServiceThunk("senders/fetchAll", () =>
  sendersController.getAll(),
);

export const createSender = createServiceThunk("senders/create", (payload) =>
  sendersController.create(payload),
);

export const updateSender = createServiceThunk(
  "senders/update",
  ({ id, payload }) => sendersController.update(id, payload),
);

export const deleteSender = createServiceThunk("senders/delete", (id) =>
  sendersController.delete(id),
);



const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  saving: false,
  deleting: false,
};

const sendersSlice = createSlice({
  name: "senders",
  initialState,
  reducers: {
    clearSendersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchSenders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSenders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSenders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Error loading senders";
      })

      // create
      .addCase(createSender.pending, (state) => {
        state.saving = true;
      })
      .addCase(createSender.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.items.push(action.payload);
          state.items.sort((a, b) => a.name.localeCompare(b.name));
        }
      })
      .addCase(createSender.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error creating sender";
      })

      // update
      .addCase(updateSender.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateSender.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const idx = state.items.findIndex((s) => s.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
          state.items.sort((a, b) => a.name.localeCompare(b.name));
        }
      })
      .addCase(updateSender.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error updating sender";
      })

      // delete
      .addCase(deleteSender.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteSender.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(deleteSender.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message ?? "Error deleting sender";
      });
  },
});

export const { clearSendersError } = sendersSlice.actions;
export default sendersSlice.reducer;
