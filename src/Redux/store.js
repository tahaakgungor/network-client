import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import SocketReducer from "./Socket/socketSlice";
import deviceReducer from "./Device/deviceSlice";
import userInformationReducer from "./UserInformation/userInformationSlice";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["register"],
  stateReconciler: autoMergeLevel2,
};

const persistedSocketReducer = persistReducer(persistConfig, SocketReducer);
const persistedDeviceReducer = persistReducer(persistConfig, deviceReducer);
const persistedUserInformationReducer = persistReducer(
  persistConfig,
  userInformationReducer
);

export const store = configureStore({
  reducer: {
    socket: persistedSocketReducer,
    device: persistedDeviceReducer,
    userInformation: persistedUserInformationReducer,
  },
});

export const persistor = persistStore(store);
