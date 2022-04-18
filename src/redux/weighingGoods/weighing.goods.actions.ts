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
import {
  IAddDetailOffline,
  IAddDetailOfflineSuccess,
  IConvertModelOnlineToOffline,
  IDeleteDetailOffline,
  IDeleteDetailOfflineSuccess,
  IDeleteHeader,
  IDeleteHeaderOffline,
  IDeleteHeaderOfflineSuccess,
  IDeleteHeaderSuccess,
  IDeleteItem,
  IDeleteItemSuccess,
  IGetDetailsOffline,
  IGetDetailsOfflineSuccess,
  IGetDosOfflineByUnit,
  IGetDosOfflineByUnitSuccess,
  IGetListOfOrdersForWeighPreparation,
  IGetListOfOrdersForWeighPreparationSuccess,
  IGetListWGoods,
  IGetListWGoodsSuccess,
  IGetProductListByDoNo,
  IGetProductListSuccess,
  IGetProductsOffline,
  IGetProductsOfflineSuccess,
  IGetScaleTempDataOffline,
  IGetScaleTempDataOfflineSuccess,
  IGetWeighingGoodsItems,
  IGetWeighingGoodsItemsSuccess,
  ILockUnlockScaleOffline,
  ILockUnlockScaleOfflineSuccess,
  IPostWeighingGoods,
  IPostWeighingGoodsSuccess,
  IPostWeighingItem,
  IPrintWeighingGoods,
  ISaveHeaderOffline,
  IUpdatePostItemStatus,
  IUpdateWeighingGoodsLocalModel,
  IUploadHeaderModelOffline,
  IUploadScaleTempOffline,
  IUploadScaleTempOfflineSuccess,
  IWGoodsUploadOrReturn,
  IWGoodsUploadOrReturnSuccess,
  Types,
} from './weighing.goods.types';

const WeighingGoodsActions = {
  getListDo: (
    filter: IDoFilterModel,
    isStoreLocal = false,
  ): IGetListOfOrdersForWeighPreparation => ({
    type: Types.WEIGHING_GOOD_GET_LIST_DO,
    payload: {filter, isStoreLocal},
  }),
  getListDoSuccess: (
    doData: IDoItem[],
  ): IGetListOfOrdersForWeighPreparationSuccess => ({
    type: Types.WEIGHING_GOOD_GET_LIST_DO_SUCCESS,
    payload: {doData},
  }),
  updateLocalHeaderModel: (
    headerModel: IWeighingGoodsModel,
    isClear: boolean,
  ): IUpdateWeighingGoodsLocalModel => ({
    type: Types.WEIGHING_GOOD_UPDATE_HEADER_LOCAL_MODEL,
    payload: {headerModel, isClear},
  }),
  postHeader: (
    headerModel: IWeighingGoodsModel,
    isAlert = false,
  ): IPostWeighingGoods => ({
    type: Types.WEIGHING_GOOD_POST_HEADER_MODEL,
    payload: {headerModel, isAlert},
  }),
  postHeaderSuccess: (
    model: IWeighingGoodsModel,
  ): IPostWeighingGoodsSuccess => ({
    type: Types.WEIGHING_GOOD_POST_HEADER_MODEL_SUCCESS,
    payload: {model},
  }),
  postItem: (
    item: IWeighingGoodsItemModel,
    isOverWeight: boolean,
    isAlert = true,
  ): IPostWeighingItem => ({
    type: Types.WEIGHING_GOOD_POST_ITEM_MODEL,
    payload: {model: item, isOverWeight, isAlert},
  }),
  getItemsByScaleId: (
    scaleId: number,
    regionId: string,
  ): IGetWeighingGoodsItems => ({
    type: Types.WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID,
    payload: {scaleId, regionId},
  }),
  getItemsByScaleIdSuccess: (
    items: IWeighingGoodsDetailDTO[],
  ): IGetWeighingGoodsItemsSuccess => ({
    type: Types.WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID_SUCCESS,
    payload: {items},
  }),
  deleteItem: (id: number, isAlert = true): IDeleteItem => ({
    type: Types.WEIGHING_GOOD_DELETE_ITEM,
    payload: {id, isAlert},
  }),
  deleteItemSuccess: (id: number): IDeleteItemSuccess => ({
    type: Types.WEIGHING_GOOD_DELETE_ITEM_SUCCESS,
    payload: {id},
  }),
  deleteHeader: (
    scaleId: number,
    isAlert = true,
    nav: INavigateScreen,
  ): IDeleteHeader => ({
    type: Types.WEIGHING_GOODS_DELETE_HEADER,
    payload: {scaleId, isAlert, nav},
  }),
  deleteHeaderSuccess: (scaleId: number): IDeleteHeaderSuccess => ({
    type: Types.WEIGHING_GOODS_DELETE_HEADER_SUCCESS,
    payload: {scaleId},
  }),
  uploadOrReturn: (
    tempWeightID: number,
    weightNo: string,
    status: WeighingGoodsStatus,
    isAlert: boolean,
    nav?: INavigateScreen,
    regionId?: string,
  ): IWGoodsUploadOrReturn => ({
    type: Types.WEIGHING_GOODS_UPLOAD_OR_RETURN,
    payload: {tempWeightID, weightNo, status, isAlert, nav, regionId},
  }),
  uploadOrReturnSuccess: (
    tempWeightID: number,
    status: WeighingGoodsStatus,
  ): IWGoodsUploadOrReturnSuccess => ({
    type: Types.WEIGHING_GOODS_UPLOAD_OR_RETURN_SUCCESS,
    payload: {tempWeightID, status},
  }),
  getProducts: (doNo: string): IGetProductListByDoNo => ({
    type: Types.WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO,
    payload: {doNo},
  }),
  getProductsSuccess: (products: IGoodsDTO[]): IGetProductListSuccess => ({
    type: Types.WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO_SUCCESS,
    payload: {products},
  }),
  getWGoodsList: (
    fromDate: string,
    toDate: string,
    tmpWeiStatus?: number,
    unitId?: string,
    locationId?: string,
  ): IGetListWGoods => ({
    type: Types.WEIGHING_GOOD_GET_LIST,
    payload: {fromDate, toDate, tmpWeiStatus, unitId, locationId},
  }),
  getWGoodsListSuccess: (
    wGoodsData: IWeighingGoodsItemDTO[],
  ): IGetListWGoodsSuccess => ({
    type: Types.WEIGHING_GOOD_GET_LIST_SUCCESS,
    payload: {wGoodsData},
  }),
  getProductsOffline: (): IGetProductsOffline => ({
    type: Types.WEIGHING_GOODS_GET_PRODUCTS_OFFLINE,
  }),
  getProductsOfflineSuccess: (
    products: IProductStockDTO[],
  ): IGetProductsOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_GET_PRODUCTS_OFFLINE_SUCCESS,
    payload: {products},
  }),
  getDosOffline: (): IGetDosOfflineByUnit => ({
    type: Types.WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT,
  }),
  getDosOfflineSuccess: (dos: IDoLocalItem[]): IGetDosOfflineByUnitSuccess => ({
    type: Types.WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT_SUCCESS,
    payload: {dos},
  }),
  updateHeaderModelOffline: (
    model: IWeighingGoodsModel,
    isClearDetails: boolean,
  ): IUploadHeaderModelOffline => ({
    type: Types.WEIGHING_GOOD_UPDATE_HEADER_MODEL_OFFLINE,
    payload: {model, isClearDetails},
  }),
  saveHeaderOffline: (
    model: IWeighingGoodsModel,
    isAlert = true,
  ): ISaveHeaderOffline => ({
    type: Types.WEIGHING_GOODS_SAVE_HEADER_OFFLINE,
    payload: {model, isAlert},
  }),
  getDetailsOffline: (scaleId: number): IGetDetailsOffline => ({
    type: Types.WEIGHING_GOODS_GET_DETAILS_OFFLINE,
    payload: {scaleId},
  }),
  getDetailsOfflineSuccess: (
    details: IWeighingGoodsDetailDTO[],
  ): IGetDetailsOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_GET_DETAILS_OFFLINE_SUCCESS,
    payload: {details},
  }),
  addDetailOffline: (
    scaleId: number,
    detailModel: IWeighingGoodsItemModel,
    isOverWeight: boolean,
    isAlert = true,
  ): IAddDetailOffline => ({
    type: Types.WEIGHING_GOODS_ADD_DETAIL_OFFLINE,
    payload: {scaleId, detailModel, isOverWeight, isAlert},
  }),
  addDetailOfflineSuccess: (
    item: IWeighingGoodsDetailDTO,
  ): IAddDetailOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_ADD_DETAIL_OFFLINE_SUCCESS,
    payload: {item},
  }),
  deleteDetailOffline: (
    detailId: number,
    scaleId: number,
    isAlert = true,
  ): IDeleteDetailOffline => ({
    type: Types.WEIGHING_GOODS_DELETE_DETAIL_OFFLINE,
    payload: {detailId, scaleId, isAlert},
  }),
  deleteDetailOfflineSuccess: (
    detailId: number,
  ): IDeleteDetailOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_DELETE_DETAIL_OFFLINE_SUCCESS,
    payload: {detailId},
  }),
  lockUnlockScaleOffline: (
    scaleId: number,
    isAlert: boolean,
  ): ILockUnlockScaleOffline => ({
    type: Types.WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE,
    payload: {scaleId, isAlert},
  }),
  lockUnlockScaleOfflineSuccess: (
    scaleId: number,
  ): ILockUnlockScaleOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE_SUCCESS,
    payload: {scaleId},
  }),
  deleteHeaderOffline: (
    scaleId: number,
    doNo: string,
    isAlert: boolean,
    nav: INavigateScreen,
  ): IDeleteHeaderOffline => ({
    type: Types.WEIGHING_GOODS_DELETE_HEADER_OFFLINE,
    payload: {scaleId, doNo, isAlert, nav},
  }),
  deleteHeaderOfflineSuccess: (
    scaleId: number,
  ): IDeleteHeaderOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_DELETE_HEADER_OFFLINE_SUCCESS,
    payload: {scaleId},
  }),
  updatePostItemStatus: (isStatus: boolean): IUpdatePostItemStatus => {
    return {
      type: Types.WEIGHING_GOODS_CHANGE_STATUS_POST_ITEM_FALSE_OR_SUCCESS,
      payload: {isStatus},
    };
  },
  getScaleTempDataOffline: (): IGetScaleTempDataOffline => ({
    type: Types.WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE,
    payload: {},
  }),
  getScaleTempDataOfflineSuccess: (
    dataS: IWeighingGoodsItemDTO[],
  ): IGetScaleTempDataOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE_SUCCESS,
    payload: {dataS},
  }),
  uploadScaleTempOffline: (
    scaleTempLocalId: number,
  ): IUploadScaleTempOffline => ({
    type: Types.WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE,
    payload: {scaleTempLocalId},
  }),
  uploadScaleTempOfflineSuccess: (
    scaleLocalId: number,
  ): IUploadScaleTempOfflineSuccess => ({
    type: Types.WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE_SUCCESS,
    payload: {scaleLocalId},
  }),
  convertModelFromOnlineToOffline: (): IConvertModelOnlineToOffline => ({
    type: Types.WEIGHING_GOODS_CONVERT_MODEL_FROM_ONLINE_TO_OFFLINE,
    payload: {},
  }),
  printBill: (
    items: IWeighingGoodsDetailDTO[],
    isOffline: boolean,
    numOfCopy: number,
    model?: IWeighingGoodsModel,
  ): IPrintWeighingGoods => ({
    type: Types.WEIGHING_GOODS_PRINT_BILL,
    payload: {model, items, isOffline, numOfCopy},
  }),
};

export default WeighingGoodsActions;
