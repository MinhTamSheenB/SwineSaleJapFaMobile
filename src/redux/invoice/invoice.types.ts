import {
  IInvoiceFilterModel,
  IInvoiceHeaderDetail,
  IInvoiceItemDetail,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';

export interface IInvoiceState {
  currentInvNo: string;
  data: IInvoiceHeaderDetail[];
  headerDetail: IInvoiceHeaderDetail | undefined | null;
  items: IInvoiceItemDetail[];
}

export enum Types {
  INVOICE_POST_DO_TO_INVOICE = '[INVOICE]POST_DO_TO_INVOICE',

  INVOICE_SEARCH_DATA = '[INVOICE]SEARCH_DATA',
  INVOICE_SEARCH_DATA_SUCCESS = '[INVOICE]SEARCH_DATA_SUCCESS',

  INVOICE_GET_INVOICE_DETAIL_BY_CODE = '[INVOICE]GET_INVOICE_DETAIL_BY_CODE',
  INVOICE_GET_INVOICE_DETAIL_BY_CODE_SUCCESS = '[INVOICE]GET_INVOICE_DETAIL_BY_CODE_SUCCESS',

  INVOICE_SET_CURRENT_INV_CODE = 'INVOICE_SET_CURRENT_INV_CODE',

  INVOICE_DELETE_BY_CODE = 'INVOICE_DELETE_BY_CODE',
  INVOICE_DELETE_BY_CODE_SUCCESS = 'INVOICE_DELETE_BY_CODE_SUCCESS',

  INVOICE_VIEW_PDF_BY_INVNO = 'INVOICE_VIEW_PDF_BY_INVNO',

  INVOICE_PUBLISH_BY_INVNO = 'INVOICE_PUBLISH_BY_INVNO',
  INVOICE_PUBLISH_BY_INVNO_SUCCESS = 'INVOICE_PUBLISH_BY_INVNO_SUCCESS',

  INVOICE_CANCEL = 'INVOICE_CANCEL',
  INVOICE_CANCEL_SUCCESS = 'INVOICE_CANCEL_SUCCESS',
}

export interface IPostDoToInvoice {
  type: Types.INVOICE_POST_DO_TO_INVOICE;
  payload: {doNo: string; nav: INavigateScreen};
}

export interface IGetHeaderDetailByNo {
  type: Types.INVOICE_GET_INVOICE_DETAIL_BY_CODE;
  payload: {inNo: string};
}

export interface IGetHeaderDetailByNoSuccess {
  type: Types.INVOICE_GET_INVOICE_DETAIL_BY_CODE_SUCCESS;
  payload: {detail: IInvoiceHeaderDetail; items: IInvoiceItemDetail[]};
}

export interface ISearch {
  type: Types.INVOICE_SEARCH_DATA;
  payload: {model: IInvoiceFilterModel};
}

export interface ISearchSuccess {
  type: Types.INVOICE_SEARCH_DATA_SUCCESS;
  payload: {details: IInvoiceHeaderDetail[]};
}

export interface ISetInvoiceCode {
  type: Types.INVOICE_SET_CURRENT_INV_CODE;
  payload: {invNo: string};
}

export interface IDeleteInvoice {
  type: Types.INVOICE_DELETE_BY_CODE;
  payload: {invNo: string; isAlert: boolean; nav?: INavigateScreen};
}

export interface IDeleteInvoiceSuccess {
  type: Types.INVOICE_DELETE_BY_CODE_SUCCESS;
  payload: {invNo: string};
}

export interface IViewInvoicePdf {
  type: Types.INVOICE_VIEW_PDF_BY_INVNO;
  payload: {invNo: string};
}

export interface IPublishInvoiceByNo {
  type: Types.INVOICE_PUBLISH_BY_INVNO;
  payload: {invNo: string; isAlert: boolean};
}

export interface IPublishInvoiceSuccess {
  type: Types.INVOICE_PUBLISH_BY_INVNO_SUCCESS;
  payload: {invNo: string};
}

export interface ICancelInvoice {
  type: Types.INVOICE_CANCEL;
  payload: {
    invNo: string;
    reason: string;
    isAlert: boolean;
    nav?: INavigateScreen;
  };
}

export interface ICancelInvoiceSuccess {
  type: Types.INVOICE_CANCEL_SUCCESS;
  payload: {invNo: string};
}

export type InvoiceActionType =
  | IPostDoToInvoice
  | IGetHeaderDetailByNoSuccess
  | ISearchSuccess
  | ISetInvoiceCode
  | IPublishInvoiceSuccess
  | IDeleteInvoiceSuccess
  | ICancelInvoiceSuccess;
