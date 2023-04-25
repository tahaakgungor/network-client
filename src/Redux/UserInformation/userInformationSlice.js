import { createSlice } from "@reduxjs/toolkit";
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
      state.roles = state.roles.filter((role) => role._id !== action.payload);
    },
  },
});

export const { saveUser, setRoles, saveNewRole, deleteRole } =
  userInformationSlice.actions;

export const fetchUserInformation = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:5000/auth/user");
    dispatch(saveUser(response.data));
  } catch (error) {
    console.error(error);
  }
};

export const fetchRoles = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:5000/roles");
    dispatch(setRoles(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default userInformationSlice.reducer;
