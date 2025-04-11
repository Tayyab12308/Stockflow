// ui_reducer.ts
import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from '../actions/session_actions';

// You can define additional theme actions
export const SET_DARK_THEME = 'SET_DARK_THEME';

export interface SetDarkThemeAction {
  type: typeof SET_DARK_THEME;
  enabled: boolean;
}

export interface UIState {
  darkTheme: boolean;
}

type UIAction = 
  | { type: typeof RECEIVE_CURRENT_USER }
  | { type: typeof LOGOUT_CURRENT_USER }
  | SetDarkThemeAction;

const initialState: UIState = {
  darkTheme: false
};

const uiReducer = (
  state: UIState = initialState,
  action: UIAction
): UIState => {
  Object.freeze(state);
  switch (action.type) {
    case SET_DARK_THEME:
      return { ...state, darkTheme: action.enabled };
    case RECEIVE_CURRENT_USER:
      return { ...state, darkTheme: true }; // Enable dark theme when user logs in
    case LOGOUT_CURRENT_USER:
      return { ...state, darkTheme: false }; // Disable dark theme when user logs out
    default:
      return state;
  }
};

export default uiReducer;