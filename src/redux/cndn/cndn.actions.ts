import {
  CnDnStatus,
  ICndnDetailDtoItem,
  ICndnDetailModel,
  ICndnDtoItem,
  ICndnHeaderModel,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {
  IApprove,
  IApproveSuccess,
  ICreateUpdate,
  IDeleteHeader,
  IDeleteHeaderSuccess,
  IGetHeaderModelByNo,
  IGetInfoByNo,
  IGetInfoByNoSuccess,
  IInvoice,
  IInvoiceSuccess,
  IReject,
  IRejectSuccess,
  ISearch,
  ISearchSuccess,
  Types,
  IUpdateLocalModel,
  IClearHeaderLocalModel,
  ICreateDetail,
  IGetCndnItemsByNoSuccess,
  IGetCndnItemsByNo,
  IDeleteDetail,
  IDeleteDetailSuccess,
} from './cndn.types';

const CndnActions = {
  createUpdate: (
    model: ICndnHeaderModel,
    nav?: INavigateScreen,
  ): ICreateUpdate => ({
    type: Types.CREATE_UPDATE,
    payload: {model, nav},
  }),
  search: (
    fromDate?: string,
    toDate?: string,
    custId?: string,
    cndnCode?: string,
    status?: CnDnStatus,
  ): ISearch => ({
    type: Types.SEARCH,
    payload: {fromDate, toDate, custId, cndnCode, status},
  }),
  searchSuccess: (
    data: ICndnDtoItem[],
    status?: CnDnStatus,
  ): ISearchSuccess => ({
    type: Types.SEARCH_SUCCESS,
    payload: {data, status},
  }),
  deleteHeader: (
    cndnNo: string,
    status: CnDnStatus,
    isAlert = false,
    nav?: INavigateScreen,
  ): IDeleteHeader => ({
    type: Types.DELETE_HEADER,
    payload: {cndnNo, status, isAlert, nav},
  }),
  deleteHeaderSuccess: (
    cndnNo: string,
    status: CnDnStatus,
  ): IDeleteHeaderSuccess => ({
    type: Types.DELETE_HEADER_SUCCESS,
    payload: {cndnNo, status},
  }),
  getInfoByNo: (cndnNo: string): IGetInfoByNo => ({
    type: Types.GET_CNDN_INFO_BY_NO,
    payload: {cndnNo},
  }),
  getInfoByNoSuccess: (dto: ICndnDtoItem): IGetInfoByNoSuccess => ({
    type: Types.GET_CNDN_INFO_BY_NO_SUCCESS,
    payload: {dto},
  }),
  approve: (
    cndnNo: string,
    item: ICndnDtoItem,
    isAlert = false,
    nav?: INavigateScreen,
  ): IApprove => ({
    type: Types.APPROVE,
    payload: {cndnNo, item, isAlert, nav},
  }),
  approveSuccess: (
    cndnNo: string,
    oldState: CnDnStatus,
    item: ICndnDtoItem,
  ): IApproveSuccess => ({
    type: Types.APPROVE_SUCCESS,
    payload: {cndnNo, oldState, item},
  }),
  reject: (
    cndnNo: string,
    reason: string,
    item: ICndnDtoItem,
    isAlert = false,
    nav?: INavigateScreen,
  ): IReject => ({
    type: Types.REJECT,
    payload: {cndnNo, reason, item, isAlert, nav},
  }),
  rejectSuccess: (
    cndnNo: string,
    oldState: CnDnStatus,
    item: ICndnDtoItem,
  ): IRejectSuccess => ({
    type: Types.REJECT_SUCCESS,
    payload: {cndnNo, oldState, item},
  }),
  invoice: (
    cndnNo: string,
    item: ICndnDtoItem,
    isAlert = false,
    nav?: INavigateScreen,
  ): IInvoice => ({
    type: Types.INVOICE,
    payload: {cndnNo, item, isAlert, nav},
  }),
  invoiceSuccess: (
    cndnNo: string,
    oldState: CnDnStatus,
    item: ICndnDtoItem,
  ): IInvoiceSuccess => ({
    type: Types.INVOICE_SUCCESS,
    payload: {cndnNo, oldState, item},
  }),
  getHeaderModelByNo: (
    no: string,
    nav?: INavigateScreen,
  ): IGetHeaderModelByNo => ({
    type: Types.GET_HEADER_MODEL_BY_NO,
    payload: {no, nav},
  }),
  updateHeaderLocalModel: (model: ICndnHeaderModel): IUpdateLocalModel => ({
    type: Types.UPDATE_LOCAL_HEADER_MODEL,
    payload: {model},
  }),
  clearHeaderLocalModel: (): IClearHeaderLocalModel => ({
    type: Types.CLEAR_LOCAL_HEADER_MODEL,
  }),
  createDetail: (
    model: ICndnDetailModel,
    nav?: INavigateScreen,
  ): ICreateDetail => ({
    type: Types.CREATE_DETAIL,
    payload: {model, nav},
  }),
  getDetails: (cndnNo: string): IGetCndnItemsByNo => ({
    type: Types.GET_CNDN_ITEMS_BY_NO,
    payload: {cndnNo},
  }),
  getDetailsSuccess: (
    items: ICndnDetailDtoItem[],
  ): IGetCndnItemsByNoSuccess => ({
    type: Types.GET_CNDN_ITEMS_BY_NO_SUCCESS,
    payload: {items},
  }),
  deleteDetail: (
    CndnNo: string,
    cndndtID: number,
    isAlert = false,
  ): IDeleteDetail => ({
    type: Types.DELETE_DETAIL,
    payload: {CndnNo, cndndtID, isAlert},
  }),
  deleteDetailSuccess: (cndndtID: number): IDeleteDetailSuccess => ({
    type: Types.DELETE_DETAIL_SUCCESS,
    payload: {cndndtID},
  }),
};

export default CndnActions;
