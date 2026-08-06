import { createAsyncThunk } from '@reduxjs/toolkit'

export function createServiceThunk(typePrefix, payloadCreator) {
  return createAsyncThunk(typePrefix, async (arg, thunkAPI) => {
    try {
      return await payloadCreator(arg, thunkAPI)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  })
}