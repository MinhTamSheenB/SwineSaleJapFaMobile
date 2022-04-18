import {
  DeliveryOrderStatus,
  IDoFilterModel,
  IDoHeaderCommon,
  IDoHeaderModel,
  IDoItem,
  IDoItemDetailModel,
} from '~/apis/types.service';
import {DropdownItemType, INavigateScreen} from '~/commons/types';
import {
  ICreateUpdateProductItem,
  ICreateUpdateProductItemSuccess,
  IDeleteDetail,
  IDeleteDetailSuccess,
  IDeleteDoHeader,
  IDeleteDoHeaderSuccess,
  IFetchDoDataSuccess,
  IFetchingDoData,
  IGetDoHeaderByCode,
  IGetDoHeaderByCodeSuccess,
  IGetHeaderInfoByNo,
  IGetProductsByCode,
  IGetProductsByCodeSuccess,
  ISetLocalItemModel,
  IGetHeaderInfoByNoSuccess,
  Types,
  IPosToSale,
  IUpdateHeaderInfoModel,
  IDoCreateUpdateHeaderModel,
  IDoPostDoToInvoiceSuccess,
  IGetTruckNo,
  IGetTruckNoSuccess,
  IGetReceiverName,
  IGetReceiverNameSuccess,
} from './do.types';

const DoActions = {
  search: (model: IDoFilterModel): IFetchingDoData => ({
    type: Types.DO_FETCHING_LIST_DATA,
    payload: model,
  }),
  searchSuccess: (dos: IDoItem[]): IFetchDoDataSuccess => ({
    type: Types.DO_FETCHING_LIST_DATA_SUCCESS,
    payload: dos,
  }),
  remove: (
    header: IDoHeaderCommon,
    isAlert = false,
    navigate: INavigateScreen | null = null,
  ): IDeleteDoHeader => ({
    type: Types.DO_DELETE_HEADER,
    payload: {doHeader: header, isAlert, navigate},
  }),
  removeSuccess: (doNo: string): IDeleteDoHeaderSuccess => ({
    type: Types.DO_DELETE_HEADER_SUCCESS,
    payload: doNo,
  }),
  getHeaderInfo: (doNo: string, isRedirect = false): IGetDoHeaderByCode => ({
    type: Types.DO_GET_HEADER_INFO_BY_DO_NO,
    payload: {doNo, isRedirect},
  }),
  getHeaderInfoSuccess: (
    header: IDoHeaderModel,
  ): IGetDoHeaderByCodeSuccess => ({
    type: Types.DO_GET_HEADER_INFO_BY_DO_NO_SUCCESS,
    payload: header,
  }),
  getProductsDoNo: (doNo: string, loadDoRel?: boolean): IGetProductsByCode => ({
    type: Types.DO_GET_PRODUCTS_BY_DONO,
    payload: {doNo, loadDoRel},
  }),
  getProductsDoNoSuccess: (
    items: IDoItemDetailModel[],
  ): IGetProductsByCodeSuccess => ({
    type: Types.DO_GET_PRODUCTS_BY_DONO_SUCCESS,
    payload: items,
  }),
  deleteDetail: (doDetailId: number, isAlert = false): IDeleteDetail => ({
    type: Types.DO_DELETE_DETAIL,
    payload: {doDetailId, isAlert},
  }),
  deleteDetailSuccess: (doDetailId: number): IDeleteDetailSuccess => ({
    type: Types.DO_DELETE_DETAIL_SUCCESS,
    payload: doDetailId,
  }),
  setLocalItemModel: (item: IDoItemDetailModel): ISetLocalItemModel => ({
    type: Types.DO_SET_LOCAL_ITEM_MODEL,
    payload: item,
  }),
  createUpdateProductItem: (
    model: IDoItemDetailModel,
    isRedirect: boolean,
  ): ICreateUpdateProductItem => ({
    type: Types.DO_CREATE_UPDATE_PRODUCT_ITEM,
    payload: {itemModel: model, isRedirect},
  }),
  createUpdateProductItemSuccess: (
    model: IDoItemDetailModel,
  ): ICreateUpdateProductItemSuccess => ({
    type: Types.DO_CREATE_UPDATE_PRODUCT_ITEM_SUCCESS,
    payload: model,
  }),
  getHeaderInfoByNo: (doNo: string): IGetHeaderInfoByNo => ({
    type: Types.DO_GET_HEADER_INFO_BY_NO,
    payload: doNo,
  }),
  getHeaderInfoByNoSuccess: (
    doHeader: IDoHeaderModel,
  ): IGetHeaderInfoByNoSuccess => ({
    type: Types.DO_GET_HEADER_INFO_BY_NO_SUCCESS,
    payload: doHeader,
  }),
  postToSale: (
    doNo: string,
    status: DeliveryOrderStatus,
    isAlert = false,
    isConfirm = false,
  ): IPosToSale => ({
    type: Types.DO_POST_TO_SALE,
    payload: {doNo, status, isAlert, isConfirm},
  }),
  updateHeaderInfoModelState: (
    model: IDoHeaderModel,
  ): IUpdateHeaderInfoModel => ({
    type: Types.DO_UPDATE_HEDER_INFO_MODEL,
    payload: model,
  }),
  createUpdateDoHeaderModel: (
    model: IDoHeaderModel,
    navigate?: INavigateScreen,
  ): IDoCreateUpdateHeaderModel => ({
    type: Types.DO_CREATE_UPDATE_HEADER,
    payload: {model, navigate},
  }),
  postDoToInvoiceSuccess: (doNo: string): IDoPostDoToInvoiceSuccess => ({
    type: Types.DO_POST_DO_TO_INVOICE_SUCCESS,
    payload: doNo,
  }),
  getTruckNo: (custId?: string): IGetTruckNo => ({
    type: Types.DO_GET_TRUCK_NO,
    payload: {custId},
  }),
  getTruckNoSuccess: (data: DropdownItemType[]): IGetTruckNoSuccess => ({
    type: Types.DO_GET_TRUCK_NO_SUCCESS,
    payload: {data},
  }),
  getReceiverName: (custId?: string): IGetReceiverName => ({
    type: Types.DO_GET_RECEIVER_NAME,
    payload: {custId},
  }),
  getReceiverNameSuccess: (
    data: DropdownItemType[],
  ): IGetReceiverNameSuccess => ({
    type: Types.DO_GET_RECEIVER_NAME_SUCCESS,
    payload: {data},
  }),
};

export default DoActions;
