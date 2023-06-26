import { Action } from "redux";

const initialState = {
  appState: {
    isLoading: true,
  },
};

export interface UpdateAppStateAction extends Action {
  type: "UPDATE_APP_STATE";
  payload: {
    isLoading: boolean;
  };
}

type AppAction = UpdateAppStateAction; // Add more action types if needed

function rootReducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case "UPDATE_APP_STATE":
      return {
        ...state,
        appState: {
          ...state.appState,
          isLoading: action.payload.isLoading,
        },
      };
    default:
      return state;
  }
}

export default rootReducer;
