import { createSlice } from '@reduxjs/toolkit'

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    ssh:[],
  },
  reducers: {
    addSocket: (state,action) => {
        var params = action.payload;
        state.socket = action.payload.socket;
    },
    addSSH: (state,action) => {
        var params = action.payload;
        state.ssh.push(params);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addSocket, addSSH } = socketSlice.actions

export default socketSlice.reducer