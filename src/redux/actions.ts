import { Dispatch } from "redux";
import rootReducer, { UpdateAppStateAction } from "./reducers";
import store from "./store";

interface UpdateAppStateParams {
  isLoading: boolean;
  // Add other parameters here as needed
}

export const updateAppState = (params: UpdateAppStateParams) => {
  return (
    dispatch: Dispatch<UpdateAppStateAction>,
    getState: () => typeof store.getState
  ) => {
    const currentState = getState();
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        isLoading: params.isLoading,
      },
    });
  };
};
