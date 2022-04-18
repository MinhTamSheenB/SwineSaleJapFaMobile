import {
  DeliveryOrderStatus,
  IDoFilterModel,
  IDoHeaderCommon,
  IDoHeaderModel,
  IDoItem,
  IDoItemDetailModel,
} from '~/apis/types.service';
import {DropdownItemType, INavigateScreen} from '~/commons/types';

export interface IDoState {
  data: IDoItem[];
  headerModel: IDoHeaderModel;
  headerInfo: IDoHeaderModel | null;
  items: IDoItemDetailModel[];
  itemModel: IDoItemDetailModel;
  trucks: DropdownItemType[];
  receiverNames: DropdownItemType[];
}

export enum Types {
  DO_FETCHING_LIST_DATA = 'DO_FETCHING_LIST_DATA',
  DO_FETCHING_LIST_DATA_SUCCESS = 'DO_FETCHING_LIST_DATA_SUCCESS',

  DO_DELETE_HEADER = 'DO_DELETE_HEADER',
  DO_DELETE_HEADER_SUCCESS = 'DO_DELETE_HEADER_SUCCESS',

  DO_GET_HEADER_INFO_BY_DO_NO = 'DO_GET_HEADER_INFO_BY_DO_NO',
  DO_GET_HEADER_INFO_BY_DO_NO_SUCCESS = 'DO_GET_HEADER_INFO_BY_DO_NO_SUCCESS',

  DO_UPDATE_HEDER_INFO_MODEL = 'DO_UPDATE_HEDER_INFO_MODELF',

  DO_GET_PRODUCTS_BY_DONO = 'DO_GET_PRODUCTS_BY_DONO',
  DO_GET_PRODUCTS_BY_DONO_SUCCESS = 'DO_GET_PRODUCTS_BY_DONO_SUCCESS',

  DO_DELETE_DETAIL = 'DO_DELETE_DETAIL',
  DO_DELETE_DETAIL_SUCCESS = 'DO_DELETE_DETAIL_SUCCESS',

  DO_SET_LOCAL_ITEM_MODEL = 'DO_SET_LOCAL_ITEM_MODEL',

  DO_CREATE_UPDATE_PRODUCT_ITEM = 'DO_CREATE_UPDATE_PRODUCT_ITEM',
  DO_CREATE_UPDATE_PRODUCT_ITEM_SUCCESS = 'DO_CREATE_UPDATE_PRODUCT_ITEM_SUCCESS',

  DO_GET_HEADER_INFO_BY_NO = 'DO_GET_HEADER_INFO_BY_DONO',
  DO_GET_HEADER_INFO_BY_NO_SUCCESS = 'DO_GET_HEADER_INFO_BY_DONO_SUCCESS',

  DO_POST_TO_SALE = 'DO_POST_TO_SALE',
  DO_POST_TO_SALE_SUCCESS = 'DO_POST_TO_SALE_SUCCESS',

  DO_POST_DO_TO_INVOICE_SUCCESS = 'DO_POST_DO_TO_INVOICE_SUCCESS',

  DO_CREATE_UPDATE_HEADER = 'DO_CREATE_UPDATE_HEADER',

  DO_GET_TRUCK_NO = 'DO_GET_TRUCK_NO',
  DO_GET_TRUCK_NO_SUCCESS = 'DO_GET_TRUCK_NO_SUCCESS',

  DO_GET_RECEIVER_NAME = 'DO_GET_RECEIVER_NAME',
  DO_GET_RECEIVER_NAME_SUCCESS = 'DO_GET_RECEIVER_NAME_SUCCESS',
}

export interface IFetchingDoData {
  type: Types.DO_FETCHING_LIST_DATA;
  payload: IDoFilterModel;
}

export interface IFetchDoDataSuccess {
  type: Types.DO_FETCHING_LIST_DATA_SUCCESS;
  payload: IDoItem[];
}

export interface IDeleteDoHeader {
  type: Types.DO_DELETE_HEADER;
  payload: {
    doHeader: IDoHeaderCommon;
    isAlert: boolean;
    navigate: INavigateScreen | null;
  };
}

export interface IDeleteDoHeaderSuccess {
  type: Types.DO_DELETE_HEADER_SUCCESS;
  payload: string;
}

export interface IGetDoHeaderByCode {
  type: Types.DO_GET_HEADER_INFO_BY_DO_NO;
  payload: {doNo: string; isRedirect: boolean};
}

export interface IGetDoHeaderByCodeSuccess {
  type: Types.DO_GET_HEADER_INFO_BY_DO_NO_SUCCESS;
  payload: IDoHeaderModel;
}

export interface IGetProductsByCode {
  type: Types.DO_GET_PRODUCTS_BY_DONO;
  payload: {doNo: string; loadDoRel?: boolean};
}

export interface IGetProductsByCodeSuccess {
  type: Types.DO_GET_PRODUCTS_BY_DONO_SUCCESS;
  payload: IDoItemDetailModel[];
}

export interface IDeleteDetail {
  type: Types.DO_DELETE_DETAIL;
  payload: {doDetailId: number; isAlert: boolean};
}

export interface IDeleteDetailSuccess {
  type: Types.DO_DELETE_DETAIL_SUCCESS;
  payload: number;
}

export interface ISetLocalItemModel {
  type: Types.DO_SET_LOCAL_ITEM_MODEL;
  payload: IDoItemDetailModel;
}

export interface ICreateUpdateProductItem {
  type: Types.DO_CREATE_UPDATE_PRODUCT_ITEM;
  payload: {
    itemModel: IDoItemDetailModel;
    isRedirect: boolean;
  };
}

export interface ICreateUpdateProductItemSuccess {
  type: Types.DO_CREATE_UPDATE_PRODUCT_ITEM_SUCCESS;
  payload: IDoItemDetailModel;
}

export interface IGetHeaderInfoByNo {
  type: Types.DO_GET_HEADER_INFO_BY_NO;
  payload: string;
}

export interface IGetHeaderInfoByNoSuccess {
  type: Types.DO_GET_HEADER_INFO_BY_NO_SUCCESS;
  payload: IDoHeaderModel;
}

export interface IPosToSale {
  type: Types.DO_POST_TO_SALE;
  payload: {
    doNo: string;
    status: DeliveryOrderStatus;
    isAlert: boolean;
    isConfirm: boolean;
  };
}

export interface IUpdateHeaderInfoModel {
  type: Types.DO_UPDATE_HEDER_INFO_MODEL;
  payload: IDoHeaderModel;
}

export interface IDoCreateUpdateHeaderModel {
  type: Types.DO_CREATE_UPDATE_HEADER;
  payload: {model: IDoHeaderModel; navigate?: INavigateScreen};
}

export interface IDoPostDoToInvoiceSuccess {
  type: Types.DO_POST_DO_TO_INVOICE_SUCCESS;
  payload: string;
}

export interface IGetTruckNo {
  type: Types.DO_GET_TRUCK_NO;
  payload: {custId?: string};
}

export interface IGetTruckNoSuccess {
  type: Types.DO_GET_TRUCK_NO_SUCCESS;
  payload: {data: DropdownItemType[]};
}

export interface IGetReceiverName {
  type: Types.DO_GET_RECEIVER_NAME;
  payload: {custId?: string};
}

export interface IGetReceiverNameSuccess {
  type: Types.DO_GET_RECEIVER_NAME_SUCCESS;
  payload: {data: DropdownItemType[]};
}

export type DoActionType =
  | IFetchDoDataSuccess
  | IDeleteDoHeaderSuccess
  | IGetDoHeaderByCodeSuccess
  | IGetProductsByCodeSuccess
  | IDeleteDetailSuccess
  | ISetLocalItemModel
  | ICreateUpdateProductItemSuccess
  | IGetHeaderInfoByNoSuccess
  | IUpdateHeaderInfoModel
  | IDoPostDoToInvoiceSuccess
  | IGetTruckNoSuccess
  | IGetReceiverNameSuccess;
