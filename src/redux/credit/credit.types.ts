import {CreditStatus, ICreditDTO, ICreditModel} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';

export type CreditType =
  | 'DELETE'
  | 'SEND'
  | 'UNSEND'
  | 'APPROVED'
  | 'CANCEL'
  | 'REJECT';

export interface IState {
  data: ICreditDTO[];
  detail?: ICreditDTO;
  selectedId: number;
}

export enum Types {
  CREATE_UPDATE = 'CREDIT/CREATE_UPDATE',
  CREATE_UPDATE_SUCCESS = 'CREDIT/CREATE_UPDATE_SUCCESS',

  SEARCH = 'CREDIT/SEARCHING',
  SEARCH_SUCCESS = 'CREDIT/SEARCH_SUCCESS',

  DO_ANOTHER_ACTION = 'CREDIT/DO_ANOTHER_ACTION',
  DO_ANOTHER_ACTION_SUCCESS = 'CREDIT/DO_ANOTHER_ACTION_SUCCESS',

  GET_DETAIL_BY_CREDIT_ID = 'CREDIT/GET_DETAIL_BY_CREDIT_ID',
  GET_DETAIL_SUCCESS = 'CREDIT/GET_DETAIL_SUCCESS',

  SET_SELECTED_CREDIT_ID = 'CREDIT/SET_SELECTED_CREDIT_ID',
}

export interface ICreate {
  type: Types.CREATE_UPDATE;
  payload: {model: ICreditModel; nav?: INavigateScreen};
}

export interface ICreateSuccess {
  type: Types.CREATE_UPDATE_SUCCESS;
  payload: {};
}

export interface ISearching {
  type: Types.SEARCH;
  payload: {
    fromDate?: string;
    toDate?: string;
    custId?: number;
    status?: CreditStatus;
    creditCode?: number;
  };
}

export interface ISearchSuccess {
  type: Types.SEARCH_SUCCESS;
  payload: {data: ICreditDTO[]};
}

export interface IDoAnotherAction {
  type: Types.DO_ANOTHER_ACTION;
  payload: {
    creditId: number;
    type: CreditType;
    message: string;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IDoAnotherActionSuccess {
  type: Types.DO_ANOTHER_ACTION_SUCCESS;
  payload: {
    creditId: number;
    type: CreditType;
    status: CreditStatus;
  };
}

export interface IGetDetailById {
  type: Types.GET_DETAIL_BY_CREDIT_ID;
  payload: {id: number};
}

export interface IGetDetailSuccess {
  type: Types.GET_DETAIL_SUCCESS;
  payload: {dto: ICreditDTO};
}

export interface ISetSelectedCreditId {
  type: Types.SET_SELECTED_CREDIT_ID;
  payload: {id: number};
}

export type CreditActionType =
  | ISearchSuccess
  | ICreateSuccess
  | IDoAnotherActionSuccess
  | IGetDetailSuccess
  | ISetSelectedCreditId;
