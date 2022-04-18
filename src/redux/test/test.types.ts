import {IResult} from '~/commons/types';
import {IAnimal} from '~/apis/types.service';

// Reducer
export interface ILoginState {
  results: IResult<IAnimal> | null;
  isLoading: boolean;
  error?: string | null;
}

// model
export interface ILoginData {
  email: string;
  password: string;
}

// action types
export enum ActionType {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
}

// interface return function
export interface ILoginRequest {
  type: ActionType.LOGIN_REQUEST;
  payload: ILoginData;
}

export interface ILoginSuccess {
  type: ActionType.LOGIN_SUCCESS;
  payload: IResult<IAnimal>;
}

export interface ILoginFailed {
  type: ActionType.LOGIN_FAILED;
  payload: string;
}

export type LoginAction = ILoginRequest | ILoginSuccess | ILoginFailed;
