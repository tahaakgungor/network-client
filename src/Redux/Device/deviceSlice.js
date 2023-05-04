const initialState = {
  devices: JSON.parse(localStorage.getItem("cihazlar")) || [],
};

export default function deviceReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_CONNECTED_DEVICE":
      return {
        ...state,
        devices: [...state.devices, action.payload],
      };
    case "REMOVE_CONNECTED_DEVICE":
      return {
        ...state,
        devices: state.devices.filter((deviceId) => deviceId !== action.payload),
      };
    default:
      return state;
  }
}

export const addConnectedDevice = (deviceId) => ({
  type: "ADD_CONNECTED_DEVICE",
  payload: deviceId,
});

export const removeConnectedDevice = (deviceId) => ({
  type: "REMOVE_CONNECTED_DEVICE",
  payload: deviceId,
});
