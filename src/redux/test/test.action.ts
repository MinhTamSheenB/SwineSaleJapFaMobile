import {
  ActionType,
  ILoginData,
  ILoginFailed,
  ILoginRequest,
  ILoginSuccess,
} from './test.types';
import {IResult} from '~/commons/types';
import {IAnimal} from '~/apis/types.service';

// action creators
const UserAction = {
  loginRequest: (input: ILoginData): ILoginRequest => {
    return {type: ActionType.LOGIN_REQUEST, payload: input};
  },
  loginSuccess: (result: IResult<IAnimal>): ILoginSuccess => {
    return {type: ActionType.LOGIN_SUCCESS, payload: result};
  },
  loginFailed: (error: string): ILoginFailed => {
    return {type: ActionType.LOGIN_FAILED, payload: error};
  },
};

export default UserAction;
