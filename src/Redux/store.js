import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import SocketReducer from "./Socket/socketSlice";
import deviceReducer from "./Device/deviceSlice";
import userInformationReducer from "./UserInformation/userInformationSlice";


const reducers = combineReducers({
  socket: SocketReducer,
  device: deviceReducer,
  userInformation: userInformationReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;


