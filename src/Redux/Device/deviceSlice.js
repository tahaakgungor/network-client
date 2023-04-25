import { createSlice } from '@reduxjs/toolkit'

export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    device: {},
  },  
  reducers: {
    saveDevice: (state,action) => {
        state.device = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { saveDevice } = deviceSlice.actions

export default deviceSlice.reducer