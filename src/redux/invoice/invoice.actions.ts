import {
  IInvoiceFilterModel,
  IInvoiceHeaderDetail,
  IInvoiceItemDetail,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {
  ICancelInvoice,
  ICancelInvoiceSuccess,
  IDeleteInvoice,
  IDeleteInvoiceSuccess,
  IGetHeaderDetailByNo,
  IGetHeaderDetailByNoSuccess,
  IPostDoToInvoice,
  IPublishInvoiceByNo,
  IPublishInvoiceSuccess,
  ISearch,
  ISearchSuccess,
  ISetInvoiceCode,
  IViewInvoicePdf,
  Types,
} from './invoice.types';

const InvoiceActions = {
  postDoToInvoice: (doNo: string, nav: INavigateScreen): IPostDoToInvoice => ({
    type: Types.INVOICE_POST_DO_TO_INVOICE,
    payload: {doNo, nav},
  }),
  getDetailByNo: (inNo: string): IGetHeaderDetailByNo => ({
    type: Types.INVOICE_GET_INVOICE_DETAIL_BY_CODE,
    payload: {inNo},
  }),
  getDetailSuccess: (
    detail: IInvoiceHeaderDetail,
    items: IInvoiceItemDetail[],
  ): IGetHeaderDetailByNoSuccess => ({
    type: Types.INVOICE_GET_INVOICE_DETAIL_BY_CODE_SUCCESS,
    payload: {detail, items},
  }),
  search: (filter: IInvoiceFilterModel): ISearch => ({
    type: Types.INVOICE_SEARCH_DATA,
    payload: {model: filter},
  }),
  searchSuccess: (details: IInvoiceHeaderDetail[]): ISearchSuccess => ({
    type: Types.INVOICE_SEARCH_DATA_SUCCESS,
    payload: {details},
  }),
  setInvoiceCode: (invNo: string): ISetInvoiceCode => ({
    type: Types.INVOICE_SET_CURRENT_INV_CODE,
    payload: {invNo},
  }),
  deleteInvoiceByCode: (
    invNo: string,
    isAlert = false,
    nav?: INavigateScreen,
  ): IDeleteInvoice => ({
    type: Types.INVOICE_DELETE_BY_CODE,
    payload: {invNo, isAlert, nav},
  }),
  deleteInvoiceSuccess: (invNo: string): IDeleteInvoiceSuccess => ({
    type: Types.INVOICE_DELETE_BY_CODE_SUCCESS,
    payload: {invNo},
  }),
  downloadInvoicePdf: (invNo: string): IViewInvoicePdf => ({
    type: Types.INVOICE_VIEW_PDF_BY_INVNO,
    payload: {invNo},
  }),
  publishInvoice: (invNo: string, isAlert = false): IPublishInvoiceByNo => ({
    type: Types.INVOICE_PUBLISH_BY_INVNO,
    payload: {invNo, isAlert},
  }),
  publishInvoiceSuccess: (invNo: string): IPublishInvoiceSuccess => ({
    type: Types.INVOICE_PUBLISH_BY_INVNO_SUCCESS,
    payload: {invNo},
  }),
  cancelByInvNo: (
    invNo: string,
    reason: string,
    isAlert = false,
    nav?: INavigateScreen,
  ): ICancelInvoice => ({
    type: Types.INVOICE_CANCEL,
    payload: {invNo, reason, isAlert, nav},
  }),
  cancelInvoiceSuccess: (invNo: string): ICancelInvoiceSuccess => ({
    type: Types.INVOICE_CANCEL_SUCCESS,
    payload: {invNo},
  }),
};

export default InvoiceActions;
