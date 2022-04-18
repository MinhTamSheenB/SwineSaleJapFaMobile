import {
  IDoFilterModel,
  IDoItem,
  IDoLocalItem,
  IGoodsDTO,
  IProductStockDTO,
  IWeighingGoodsDetailDTO,
  IWeighingGoodsItemDTO,
  IWeighingGoodsItemModel,
  IWeighingGoodsModel,
  WeighingGoodsStatus,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {IStarDevice} from '~/databases/DatabaseType';

export interface IState {
  doData: IDoItem[];
  wGoodModel?: IWeighingGoodsModel;
  items: IWeighingGoodsDetailDTO[];
  products: IGoodsDTO[];
  wGoodsData: IWeighingGoodsItemDTO[];

  isPostItemSuccess: boolean;
  // Offline
  dosOffline: IDoLocalItem[];
  wGoodsDataOffline: IWeighingGoodsItemDTO[];
  productsOffline: IProductStockDTO[];
  wOfflineModel?: IWeighingGoodsModel;
  detailsOffline: IWeighingGoodsDetailDTO[];
}

export enum Types {
  WEIGHING_GOOD_GET_LIST = 'WEIGHING_GOOD_GET_LIST',
  WEIGHING_GOOD_GET_LIST_SUCCESS = 'WEIGHING_GOOD_GET_LIST_SUCCESS',

  WEIGHING_GOOD_GET_LIST_DO = 'WEIGHING_GOOD_GET_LIST_DO',
  WEIGHING_GOOD_GET_LIST_DO_SUCCESS = 'WEIGHING_GOOD_GET_LIST_DO_SUCCESS',

  WEIGHING_GOOD_UPDATE_HEADER_LOCAL_MODEL = 'WEIGHING_GOOD_UPDATE_HEADER_LOCAL_MODEL',

  WEIGHING_GOOD_POST_HEADER_MODEL = 'WEIGHING_GOOD_POST_HEADER_MODEL',
  WEIGHING_GOOD_POST_HEADER_MODEL_SUCCESS = 'WEIGHING_GOOD_POST_HEADER_MODEL_SUCCESS',

  WEIGHING_GOODS_DELETE_HEADER = 'WEIGHING_GOODS_DELETE_HEADER',
  WEIGHING_GOODS_DELETE_HEADER_SUCCESS = 'WEIGHING_GOODS_DELETE_HEADER_SUCCESS',

  WEIGHING_GOOD_DELETE_ITEM = 'WEIGHING_GOOD_DELETE_ITEM',
  WEIGHING_GOOD_DELETE_ITEM_SUCCESS = 'WEIGHING_GOOD_DELETE_ITEM_SUCCESS',

  WEIGHING_GOOD_POST_ITEM_MODEL = 'WEIGHING_GOOD_POST_ITEM_MODEL',
  WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID = 'WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID',
  WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID_SUCCESS = 'WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID_SUCCESS',

  WEIGHING_GOODS_UPLOAD_OR_RETURN = 'WEIGHING_GOODS_UPLOAD',
  WEIGHING_GOODS_UPLOAD_OR_RETURN_SUCCESS = 'WEIGHING_GOODS_UPLOAD_SUCCESS',

  WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO = 'WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO',
  WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO_SUCCESS = 'WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO_SUCCESS',

  WEIGHING_GOODS_CHANGE_STATUS_POST_ITEM_FALSE_OR_SUCCESS = 'WEIGHING_GOODS_CHANGE_STATUS_POST_ITEM_FALSE_OR_SUCCESS',

  // OFFLINE
  WEIGHING_GOODS_GET_PRODUCTS_OFFLINE = 'WEIGHING_GOODS_GET_PRODUCTS_OFFLINE',
  WEIGHING_GOODS_GET_PRODUCTS_OFFLINE_SUCCESS = 'WEIGHING_GOODS_GET_PRODUCTS_OFFLINE_SUCCESS',

  WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT = 'WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT',
  WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT_SUCCESS = 'WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT_SUCCESS',

  WEIGHING_GOOD_UPDATE_HEADER_MODEL_OFFLINE = 'WEIGHING_GOOD_UPDATE_HEADER_MODEL_OFFLINE',

  WEIGHING_GOODS_SAVE_HEADER_OFFLINE = 'WEIGHING_GOODS_SAVE_HEADER_OFFLINE_TEMP',

  WEIGHING_GOODS_GET_DETAILS_OFFLINE = 'WEIGHING_GOODS_GET_DETAILS_OFFLINE',
  WEIGHING_GOODS_GET_DETAILS_OFFLINE_SUCCESS = 'WEIGHING_GOODS_GET_DETAILS_OFFLINE_SUCCESS',

  WEIGHING_GOODS_ADD_DETAIL_OFFLINE = 'WEIGHING_GOODS_ADD_DETAIL_OFFLINE',
  WEIGHING_GOODS_ADD_DETAIL_OFFLINE_SUCCESS = 'WEIGHING_GOODS_ADD_DETAIL_OFFLINE_SUCCESS',

  WEIGHING_GOODS_DELETE_DETAIL_OFFLINE = 'WEIGHING_GOODS_DELETE_DETAIL_OFFLINE',
  WEIGHING_GOODS_DELETE_DETAIL_OFFLINE_SUCCESS = 'WEIGHING_GOODS_DELETE_DETAIL_OFFLINE_SUCCESS',

  WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE = 'WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE',
  WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE_SUCCESS = 'WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE_SUCCESS',

  WEIGHING_GOODS_DELETE_HEADER_OFFLINE = 'WEIGHING_GOODS_DELETE_HEADER_OFFLINE',
  WEIGHING_GOODS_DELETE_HEADER_OFFLINE_SUCCESS = 'WEIGHING_GOODS_DELETE_HEADER_OFFLINE_SUCCESS',

  WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE = 'WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE',
  WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE_SUCCESS = 'WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE_SUCCESS',

  WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE = 'WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE',
  WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE_SUCCESS = 'WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE_SUCCESS',

  WEIGHING_GOODS_CONVERT_MODEL_FROM_ONLINE_TO_OFFLINE = 'WEIGHING_GOODS_CONVERT_MODEL_FROM_ONLINE_TO_OFFLINE',

  WEIGHING_GOODS_PRINT_BILL = 'WEIGHING_GOODS_PRINT_BILL',
}

export interface IGetListOfOrdersForWeighPreparation {
  type: Types.WEIGHING_GOOD_GET_LIST_DO;
  payload: {filter: IDoFilterModel; isStoreLocal: boolean};
}

export interface IGetListOfOrdersForWeighPreparationSuccess {
  type: Types.WEIGHING_GOOD_GET_LIST_DO_SUCCESS;
  payload: {doData: IDoItem[]};
}

export interface IUpdateWeighingGoodsLocalModel {
  type: Types.WEIGHING_GOOD_UPDATE_HEADER_LOCAL_MODEL;
  payload: {headerModel: IWeighingGoodsModel; isClear: boolean};
}

export interface IPostWeighingGoods {
  type: Types.WEIGHING_GOOD_POST_HEADER_MODEL;
  payload: {headerModel: IWeighingGoodsModel; isAlert: boolean};
}

export interface IPostWeighingGoodsSuccess {
  type: Types.WEIGHING_GOOD_POST_HEADER_MODEL_SUCCESS;
  payload: {model: IWeighingGoodsModel};
}

export interface IDeleteHeader {
  type: Types.WEIGHING_GOODS_DELETE_HEADER;
  payload: {scaleId: number; isAlert: boolean; nav: INavigateScreen};
}

export interface IDeleteHeaderSuccess {
  type: Types.WEIGHING_GOODS_DELETE_HEADER_SUCCESS;
  payload: {scaleId: number};
}

export interface IDeleteItem {
  type: Types.WEIGHING_GOOD_DELETE_ITEM;
  payload: {id: number; isAlert: boolean};
}

export interface IDeleteItemSuccess {
  type: Types.WEIGHING_GOOD_DELETE_ITEM_SUCCESS;
  payload: {id: number};
}

export interface IPostWeighingItem {
  type: Types.WEIGHING_GOOD_POST_ITEM_MODEL;
  payload: {
    model: IWeighingGoodsItemModel;
    isOverWeight: boolean;
    isAlert: boolean;
  };
}

export interface IGetWeighingGoodsItems {
  type: Types.WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID;
  payload: {scaleId: number; regionId: string};
}

export interface IGetWeighingGoodsItemsSuccess {
  type: Types.WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID_SUCCESS;
  payload: {items: IWeighingGoodsDetailDTO[]};
}

export interface IWGoodsUploadOrReturn {
  type: Types.WEIGHING_GOODS_UPLOAD_OR_RETURN;
  payload: {
    tempWeightID: number;
    weightNo: string;
    status: WeighingGoodsStatus;
    isAlert: boolean;
    nav?: INavigateScreen;
    regionId?: string;
  };
}

export interface IWGoodsUploadOrReturnSuccess {
  type: Types.WEIGHING_GOODS_UPLOAD_OR_RETURN_SUCCESS;
  payload: {tempWeightID: number; status: WeighingGoodsStatus};
}

export interface IGetProductListByDoNo {
  type: Types.WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO;
  payload: {doNo: string};
}

export interface IGetProductListSuccess {
  type: Types.WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO_SUCCESS;
  payload: {products: IGoodsDTO[]};
}

export interface IGetListWGoods {
  type: Types.WEIGHING_GOOD_GET_LIST;
  payload: {
    fromDate: string;
    toDate: string;
    tmpWeiStatus?: number;
    unitId?: string;
    locationId?: string;
  };
}

export interface IGetListWGoodsSuccess {
  type: Types.WEIGHING_GOOD_GET_LIST_SUCCESS;
  payload: {wGoodsData: IWeighingGoodsItemDTO[]};
}

export interface IUpdatePostItemStatus {
  type: Types.WEIGHING_GOODS_CHANGE_STATUS_POST_ITEM_FALSE_OR_SUCCESS;
  payload: {isStatus: boolean};
}

// OFFLINE
export interface IGetProductsOffline {
  type: Types.WEIGHING_GOODS_GET_PRODUCTS_OFFLINE;
}

export interface IGetProductsOfflineSuccess {
  type: Types.WEIGHING_GOODS_GET_PRODUCTS_OFFLINE_SUCCESS;
  payload: {products: IProductStockDTO[]};
}

export interface IGetDosOfflineByUnit {
  type: Types.WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT;
}

export interface IGetDosOfflineByUnitSuccess {
  type: Types.WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT_SUCCESS;
  payload: {dos: IDoLocalItem[]};
}

export interface IUploadHeaderModelOffline {
  type: Types.WEIGHING_GOOD_UPDATE_HEADER_MODEL_OFFLINE;
  payload: {model: IWeighingGoodsModel; isClearDetails: boolean};
}

export interface ISaveHeaderOffline {
  type: Types.WEIGHING_GOODS_SAVE_HEADER_OFFLINE;
  payload: {model: IWeighingGoodsModel; isAlert: boolean};
}

export interface IGetDetailsOffline {
  type: Types.WEIGHING_GOODS_GET_DETAILS_OFFLINE;
  payload: {scaleId: number};
}

export interface IGetDetailsOfflineSuccess {
  type: Types.WEIGHING_GOODS_GET_DETAILS_OFFLINE_SUCCESS;
  payload: {details: IWeighingGoodsDetailDTO[]};
}

export interface IAddDetailOffline {
  type: Types.WEIGHING_GOODS_ADD_DETAIL_OFFLINE;
  payload: {
    scaleId: number;
    detailModel: IWeighingGoodsItemModel;
    isOverWeight: boolean;
    isAlert: boolean;
  };
}

export interface IAddDetailOfflineSuccess {
  type: Types.WEIGHING_GOODS_ADD_DETAIL_OFFLINE_SUCCESS;
  payload: {item: IWeighingGoodsDetailDTO};
}

export interface IDeleteDetailOffline {
  type: Types.WEIGHING_GOODS_DELETE_DETAIL_OFFLINE;
  payload: {detailId: number; scaleId: number; isAlert: boolean};
}

export interface IDeleteDetailOfflineSuccess {
  type: Types.WEIGHING_GOODS_DELETE_DETAIL_OFFLINE_SUCCESS;
  payload: {detailId: number};
}

export interface ILockUnlockScaleOffline {
  type: Types.WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE;
  payload: {scaleId: number; isAlert: boolean};
}

export interface ILockUnlockScaleOfflineSuccess {
  type: Types.WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE_SUCCESS;
  payload: {scaleId: number};
}

export interface IDeleteHeaderOffline {
  type: Types.WEIGHING_GOODS_DELETE_HEADER_OFFLINE;
  payload: {
    scaleId: number;
    doNo: string;
    isAlert: boolean;
    nav: INavigateScreen;
  };
}

export interface IDeleteHeaderOfflineSuccess {
  type: Types.WEIGHING_GOODS_DELETE_HEADER_OFFLINE_SUCCESS;
  payload: {scaleId: number};
}

export interface IGetScaleTempDataOffline {
  type: Types.WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE;
  payload: {};
}

export interface IGetScaleTempDataOfflineSuccess {
  type: Types.WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE_SUCCESS;
  payload: {dataS: IWeighingGoodsItemDTO[]};
}

export interface IUploadScaleTempOffline {
  type: Types.WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE;
  payload: {scaleTempLocalId: number};
}

export interface IUploadScaleTempOfflineSuccess {
  type: Types.WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE_SUCCESS;
  payload: {scaleLocalId: number};
}

export interface IConvertModelOnlineToOffline {
  type: Types.WEIGHING_GOODS_CONVERT_MODEL_FROM_ONLINE_TO_OFFLINE;
  payload: {};
}

export interface IPrintWeighingGoods {
  type: Types.WEIGHING_GOODS_PRINT_BILL;
  payload: {
    model?: IWeighingGoodsModel;
    items: IWeighingGoodsDetailDTO[];
    isOffline: boolean;
    numOfCopy: number;
  };
}

export type WeighingGoodsActionType =
  | IGetListOfOrdersForWeighPreparationSuccess
  | IUpdateWeighingGoodsLocalModel
  | IPostWeighingGoodsSuccess
  | IDeleteItemSuccess
  | IGetWeighingGoodsItemsSuccess
  | IDeleteHeaderSuccess
  | IWGoodsUploadOrReturnSuccess
  | IGetProductListSuccess
  | IGetListWGoodsSuccess
  | IGetProductsOfflineSuccess
  | IGetDosOfflineByUnitSuccess
  | IUploadHeaderModelOffline
  | IGetDetailsOfflineSuccess
  | IAddDetailOfflineSuccess
  | IDeleteDetailOfflineSuccess
  | ILockUnlockScaleOfflineSuccess
  | IDeleteHeaderOfflineSuccess
  | IUpdatePostItemStatus
  | IGetScaleTempDataOfflineSuccess
  | IUploadScaleTempOfflineSuccess
  | IPrintWeighingGoods;
