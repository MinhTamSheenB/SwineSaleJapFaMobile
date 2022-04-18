import {ActionType, LoginAction, ILoginState} from './test.types';

// Initial state
export const initialState: ILoginState = {
  results: null,
  error: null,
  isLoading: false,
};

export default function loginReducer(
  state = initialState,
  action: LoginAction,
): ILoginState {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST:
      return {...state, isLoading: true};
    case ActionType.LOGIN_SUCCESS:
      return {...state, isLoading: false, results: action.payload};
    case ActionType.LOGIN_FAILED:
      return {...state, isLoading: false, error: action.payload};
    default:
      return state;
  }
}
