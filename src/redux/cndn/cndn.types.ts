import {
  CnDnStatus,
  ICndnDetailDtoItem,
  ICndnDetailModel,
  ICndnDtoItem,
  ICndnHeaderModel,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';

export interface IState {
  dataNew: ICndnDtoItem[];
  dataApproved: ICndnDtoItem[];
  dataInvoiceIssued: ICndnDtoItem[];
  dataRejected: ICndnDtoItem[];
  info?: ICndnDtoItem;
  model: ICndnHeaderModel;
  items: ICndnDetailDtoItem[];
}

export enum Types {
  SEARCH = 'CNDN/SEARCH_HEADER',
  SEARCH_SUCCESS = 'CNDN/SEARCH_HEADER_SUCCESS',
  DELETE_HEADER = 'CNDN/DELETE_HEADER',
  DELETE_HEADER_SUCCESS = 'CNDN/DELETE_HEADER_SUCCESS',

  GET_CNDN_INFO_BY_NO = 'CNDN/GET_CNDN_INFO_BY_NO',
  GET_CNDN_INFO_BY_NO_SUCCESS = 'CNDN/GET_CNDN_INFO_BY_NO_SUCCESS',

  APPROVE = 'CNDN/APPROVE_HEADER',
  APPROVE_SUCCESS = 'CNDN/APPROVE_HEADER_SUCCESS',

  REJECT = 'CNDN/REJECT_HEADER',
  REJECT_SUCCESS = 'CNDN/REJECT_HEADER_SUCCESS',

  INVOICE = 'CNDN/INVOICE_HEADER',
  INVOICE_SUCCESS = 'CNDN/INVOICE_HEADER_SUCCESS',

  CREATE_UPDATE = 'CNDN/CREATE_UPDATE_HEADER',
  CREATE_UPDATE_SUCCESS = 'CNDN/CREATE_UPDATE_SUCCESS',

  GET_HEADER_MODEL_BY_NO = 'CNDN/GET_HEADER_MODEL_BY_NO',
  UPDATE_LOCAL_HEADER_MODEL = 'CNDN/UPDATE_LOCAL_HEADER_MODEL',

  CLEAR_LOCAL_HEADER_MODEL = 'CNDN/CLEAR_LOCAL_HEADER_MODEL',

  GET_CNDN_ITEMS_BY_NO = 'CNDN/GET_CNDN_ITEMS_BY_NO',
  GET_CNDN_ITEMS_BY_NO_SUCCESS = 'CNDN/GET_CNDN_ITEMS_BY_NO_SUCCESS',

  CREATE_DETAIL = 'CNDN/CREATE_UPDATE_ITEM_DETAIL',
  CREATE_DETAIL_SUCCESS = 'CNDN/CREATE_UPDATE_ITEM_DETAIL_SUCCESS',
  DELETE_DETAIL = 'CNDN/DELETE_ITEM_DETAIL',
  DELETE_DETAIL_SUCCESS = 'CNDN/DELETE_ITEM_DETAIL_SUCCESS',

  UPDATE_LOCAL_MODEL = 'CNDN/UPDATE_LOCAL_MODEL',
  UPDATE_LOCAL_MODEL_SUCCESS = 'CNDN/UPDATE_LOCAL_MODEL_SUCCESS',
}

export interface ISearch {
  type: Types.SEARCH;
  payload: {
    fromDate?: string;
    toDate?: string;
    custId?: string;
    cndnCode?: string;
    status?: CnDnStatus;
  };
}

export interface ISearchSuccess {
  type: Types.SEARCH_SUCCESS;
  payload: {data: ICndnDtoItem[]; status?: CnDnStatus};
}

export interface IDeleteHeader {
  type: Types.DELETE_HEADER;
  payload: {
    cndnNo: string;
    status: CnDnStatus;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IDeleteHeaderSuccess {
  type: Types.DELETE_HEADER_SUCCESS;
  payload: {cndnNo: string; status: CnDnStatus};
}

export interface IGetInfoByNo {
  type: Types.GET_CNDN_INFO_BY_NO;
  payload: {cndnNo: string};
}

export interface IGetInfoByNoSuccess {
  type: Types.GET_CNDN_INFO_BY_NO_SUCCESS;
  payload: {dto: ICndnDtoItem};
}

export interface IApprove {
  type: Types.APPROVE;
  payload: {
    cndnNo: string;
    item: ICndnDtoItem;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IApproveSuccess {
  type: Types.APPROVE_SUCCESS;
  payload: {
    cndnNo: string;
    oldState: CnDnStatus;
    item: ICndnDtoItem;
  };
}

export interface IReject {
  type: Types.REJECT;
  payload: {
    cndnNo: string;
    reason: string;
    item: ICndnDtoItem;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IRejectSuccess {
  type: Types.REJECT_SUCCESS;
  payload: {
    cndnNo: string;
    oldState: CnDnStatus;
    item: ICndnDtoItem;
  };
}

export interface IInvoice {
  type: Types.INVOICE;
  payload: {
    cndnNo: string;
    item: ICndnDtoItem;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface IInvoiceSuccess {
  type: Types.INVOICE_SUCCESS;
  payload: {
    cndnNo: string;
    oldState: CnDnStatus;
    item: ICndnDtoItem;
  };
}

export interface ICreateUpdate {
  type: Types.CREATE_UPDATE;
  payload: {model: ICndnHeaderModel; nav?: INavigateScreen};
}

export interface IGetHeaderModelByNo {
  type: Types.GET_HEADER_MODEL_BY_NO;
  payload: {no: string; nav?: INavigateScreen};
}

export interface IUpdateLocalModel {
  type: Types.UPDATE_LOCAL_HEADER_MODEL;
  payload: {model: ICndnHeaderModel};
}

export interface IClearHeaderLocalModel {
  type: Types.CLEAR_LOCAL_HEADER_MODEL;
}

export interface ICreateDetail {
  type: Types.CREATE_DETAIL;
  payload: {model: ICndnDetailModel; nav?: INavigateScreen};
}

export interface ICreateDetailSuccess {
  type: Types.CREATE_DETAIL_SUCCESS;
  payload: {item: ICndnDetailDtoItem};
}

export interface IDeleteDetail {
  type: Types.DELETE_DETAIL;
  payload: {CndnNo: string; cndndtID: number; isAlert: boolean};
}

export interface IDeleteDetailSuccess {
  type: Types.DELETE_DETAIL_SUCCESS;
  payload: {cndndtID: number};
}

export interface IGetCndnItemsByNo {
  type: Types.GET_CNDN_ITEMS_BY_NO;
  payload: {cndnNo: string};
}

export interface IGetCndnItemsByNoSuccess {
  type: Types.GET_CNDN_ITEMS_BY_NO_SUCCESS;
  payload: {items: ICndnDetailDtoItem[]};
}

export type CndnActionsType =
  | ISearchSuccess
  | IDeleteHeaderSuccess
  | IGetInfoByNoSuccess
  | IApproveSuccess
  | IRejectSuccess
  | IInvoiceSuccess
  | IUpdateLocalModel
  | IClearHeaderLocalModel
  | IDeleteDetailSuccess
  | IGetCndnItemsByNoSuccess;
