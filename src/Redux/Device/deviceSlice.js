// devicesSlice.js

import { createSlice } from "@reduxjs/toolkit";

const deviceSlice = createSlice({
  name: "devices",
  initialState: {
    connectedDeviceIds: [],
  },
  reducers: {
    addConnectedDevice: (state, action) => {
      state.connectedDeviceIds.push(action.payload);
    },
    removeConnectedDevice: (state, action) => {
      const index = state.connectedDeviceIds.indexOf(action.payload);
      if (index !== -1) {
        state.connectedDeviceIds.splice(index, 1);
      }
    },
  },
});

export const { addConnectedDevice, removeConnectedDevice } = deviceSlice.actions;

export default deviceSlice.reducer;
