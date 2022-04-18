import {
  DiscountStatus,
  IDiscountItemDTO,
  IDiscountModel,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';

export interface IState {
  data: IDiscountItemDTO[];
  model: IDiscountModel | null;
}

export enum Types {
  SEARCH = 'DISCOUNT/SEARCH',
  SEARCH_SUCCESS = 'DISCOUNT/SEARCH_SUCCESS',
  CREATE_OR_UPDATE = 'DISCOUNT/CREATE_OR_UPDATE',
  CREATE_OR_UPDATE_SUCCESS = 'DISCOUNT/CREATE_OR_UPDATE_SUCCESS',

  DELETE_HEADER = 'DISCOUNT/DELETE_HEADER',
  DELETE_HEADER_SUCCESS = 'DISCOUNT/DELETE_HEADER_SUCCESS',

  POST = 'DISCOUNT/POST',
  POST_SUCCESS = 'DISCOUNT/POST_SUCCESS',

  RETURN_POST = 'DISCOUNT/RETURN_POST',
  RETURN_POST_SUCCESS = 'DISCOUNT/RETURN_POST_SUCCESS',

  SET_MODEL = 'DISCOUNT/SET_MODEL',
  UPDATE_LOCAL_MODEL = 'DISCOUNT/UPDATE_LOCAL_MODEL',
}

export interface ISearch {
  type: Types.SEARCH;
  payload: {
    fromDate?: string;
    toDate?: string;
    custId?: string;
    status?: DiscountStatus;
    disCode?: string;
  };
}

export interface ISearchSuccess {
  type: Types.SEARCH_SUCCESS;
  payload: {data: IDiscountItemDTO[]};
}

export interface IDeleteHeader {
  type: Types.DELETE_HEADER;
  payload: {
    discountId: number;
    discountNo;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IDeleteHeaderSuccess {
  type: Types.DELETE_HEADER_SUCCESS;
  payload: {discountId: number};
}

export interface ICreateOrUpdate {
  type: Types.CREATE_OR_UPDATE;
  payload: {model: IDiscountModel; isAlert: boolean};
}

export interface ICreateOrUpdateSuccess {
  type: Types.CREATE_OR_UPDATE_SUCCESS;
  payload: {dto: IDiscountItemDTO};
}

export interface IPost {
  type: Types.POST;
  payload: {
    discountId: number;
    discountNo: string;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IPostSuccess {
  type: Types.POST_SUCCESS;
  payload: {discountId: number};
}

export interface IReturnPost {
  type: Types.RETURN_POST;
  payload: {
    discountId: number;
    discountNo: string;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IReturnPostSuccess {
  type: Types.RETURN_POST_SUCCESS;
  payload: {discountId: number};
}

export interface ISetModel {
  type: Types.SET_MODEL;
  payload: {discountId: number; dto?: IDiscountItemDTO; nav?: INavigateScreen};
}

export interface IUpdateLocalModel {
  type: Types.UPDATE_LOCAL_MODEL;
  payload: {model: IDiscountModel};
}

export type DiscountActionType =
  | ISearchSuccess
  | IPostSuccess
  | IReturnPostSuccess
  | IDeleteHeaderSuccess
  | ICreateOrUpdateSuccess
  | IUpdateLocalModel;
