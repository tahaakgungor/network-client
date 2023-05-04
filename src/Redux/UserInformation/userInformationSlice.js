import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInformation: {},
  roles: [],
};

const userInformationSlice = createSlice({
  name: "userInformation",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.userInformation = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    saveNewRole: (state, action) => {
      state.roles.push(action.payload);
    },
    deleteRole: (state, action) => {
      state.roles = current(state.roles).filter((role) => role._id !== action.payload);
    },
  },
});

export const { saveUser, setRoles, saveNewRole, deleteRole } =
  userInformationSlice.actions;



export default userInformationSlice.reducer;
