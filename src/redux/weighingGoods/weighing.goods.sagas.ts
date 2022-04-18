/* eslint-disable prettier/prettier */
import {
  all,
  fork,
  takeEvery,
  call,
  put,
  select,
  takeLatest,
  delay,
  takeLeading,
} from 'redux-saga/effects';
import {
  getCurrentPrinterConnected,
  getRongtaPrinterServices,
  getUserParams,
  onSagaNavigate,
  safe,
} from '../saga.helpers';
import {
  IAddDetailOffline,
  IConvertModelOnlineToOffline,
  IDeleteDetailOffline,
  IDeleteHeader,
  IDeleteHeaderOffline,
  IDeleteItem,
  IGetDetailsOffline,
  IGetListOfOrdersForWeighPreparation,
  IGetListWGoods,
  IGetProductListByDoNo,
  IGetScaleTempDataOffline,
  IGetWeighingGoodsItems,
  ILockUnlockScaleOffline,
  IPostWeighingGoods,
  IPostWeighingItem,
  IPrintWeighingGoods,
  ISaveHeaderOffline,
  IUploadScaleTempOffline,
  IWGoodsUploadOrReturn,
  Types,
} from './weighing.goods.types';
import {getListDo, getProductList} from '~/apis/do.service';
import {getSaleProductForStock} from '~/apis/master.service';
import wGoodsActions from './weighing.goods.actions';
import {IUserParams} from '~/commons/types';
import {
  saveWeight,
  saveWeightItem,
  updateWeight,
  updateWeightItem,
  getWeightItemDetailById,
  deleteWeightItem,
  uploadWeight,
  returnWeight,
  deleteHeader,
  getListOfWeights,
  createScaleNoteOffline,
} from '~/apis/weighing.goods.services';
import {
  IDoFilterModel,
  IDoItem,
  IGoodsDTO,
  IGoodsFilterModel,
  IProductStockModel,
  IWeighingGoodsDetailDTO,
  IWeighingGoodsItemDTO,
  IWeighingGoodsItemModel,
  IWeighingGoodsModel,
  WeighingGoodsStatus,
  WeightTempStatus,
} from '~/apis/types.service';
import GlobalActions from '../global/global.actions';
import {AppStrings} from '~/configs';
import {
  convertToLocalObject,
  isInvalidString,
  removeUnicode,
} from '~/helpers/UtilitiesHelper';
import {
  productsStockDatabase,
  deliveryOrderDatabase,
  scaleTempDatabase,
} from '~/databases';
import {RootState} from '../reducers';
import ScreenType from '~/navigations/screen.constant';
import {
  convertStringDateToMdDdYyyy,
  getTimeFromStringDate,
} from '~/helpers/DatetimeHelpers';
import {IStarDevice} from '~/databases/DatabaseType';
import RongtaPrinterServices, {
  rongtaPrintReceptTemplate,
} from '~/helpers/RongtaPrinterServices';
import StarPrinterServices, {
  StarScaleTempTemplate,
} from '~/helpers/StarPrinterServices';
import {addLog} from '~/helpers/AppLog';

function* getListOfOrdersForWeightPreparation({
  payload,
}: IGetListOfOrdersForWeighPreparation) {
  const {filter, isStoreLocal} = payload;

  const userParams: IUserParams = yield select(getUserParams);
  const modelFilter: IDoFilterModel = {
    userId: userParams.userId,
    regionId: userParams.regionId,
    WeightTempStatus: WeightTempStatus.NoExist,
    loadScaleHeader: false,
    fromDate: filter.fromDate,
    toDate: filter.toDate,
  };
  const doData: IDoItem[] = yield call(getListDo, modelFilter);
  doData.forEach((item) => {
    return {...item, key: removeUnicode(`${item.DONO} ${item.CUSTNAME}`)};
  });
  if (isStoreLocal) {
    const iStockModel: IProductStockModel = {
      regionId: userParams.regionId,
      // locationId: '',
      // productId: '',
    };
    const products = yield call(getSaleProductForStock, iStockModel);
    yield call(productsStockDatabase.storeProductsStock, products);
    yield call(deliveryOrderDatabase.storeOrders, userParams.userId, doData);
    yield put(
      GlobalActions.openErrorInfoModal(
        'Lưu thông tin danh sách phiếu xuất kho thành công.',
      ),
    );
  } else {
    yield put(wGoodsActions.getListDoSuccess(doData));
  }
}

function* handlePostHeader({payload}: IPostWeighingGoods) {
  const {headerModel, isAlert} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  if (isInvalidString(headerModel.SCALENO)) {
    headerModel.SCALENO = `ON${headerModel.DONO?.toUpperCase().replace(
      'DO',
      '',
    )}`;
  }
  let scaleTempId = headerModel.SCALEID ?? 0;
  let isResult = false;
  if (scaleTempId < 1) {
    yield call(
      addLog,
      userParams.userId,
      'CREATE',
      'SCALE_TEMP_HEADER',
      headerModel,
    );
    scaleTempId = yield call(saveWeight, headerModel);
    isResult = scaleTempId > 0;
  } else {
    yield call(
      addLog,
      userParams.userId,
      'UPDATE',
      'SCALE_TEMP_HEADER',
      headerModel,
    );
    isResult = yield call(updateWeight, headerModel);
  }
  if (isResult) {
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.updateHeaderSuccess,
        ),
      );

    const results: IWeighingGoodsItemDTO[] = yield call(
      getListOfWeights,
      undefined,
      undefined,
      userParams.userId,
      undefined,
      undefined,
      undefined,
      undefined,
      scaleTempId,
    );
    const modelRequest: IWeighingGoodsModel = {...results[0]};

    modelRequest.TOTAL_BW_DO = headerModel.TOTAL_BW_DO;
    modelRequest.TOTAL_QTY_DO = headerModel.TOTAL_QTY_DO;
    if (isInvalidString(modelRequest.LOCATION_NAME))
      modelRequest.LOCATION_NAME = headerModel.LOCATION_NAME;
    if (isInvalidString(modelRequest.SONO))
      modelRequest.SONO = headerModel.SONO;

    yield put(wGoodsActions.postHeaderSuccess(modelRequest));
  }
}

function* handlePostItem({payload}: IPostWeighingItem) {
  const {model, isOverWeight, isAlert} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  let itemId = model.SNITEMID ?? 0;
  let isResult = false;

  if (itemId < 1) {
    yield call(addLog, userParams.userId, 'CREATE', 'SCALE_TEMP_DETAIL', model);
    itemId = yield call(saveWeightItem, model, isOverWeight);
    yield call(addLog, userParams.userId, 'CREATE', 'SCALE_TEMP_DETAIL', `${itemId}`);
    isResult = itemId > 0;
  } else {
    yield call(addLog, userParams.userId, 'UPDATE', 'SCALE_TEMP_DETAIL', model);
    isResult = yield call(updateWeightItem, model, isOverWeight);
  }
  if (isResult) {
    yield put(
      wGoodsActions.getItemsByScaleId(model.SCALEID!, model.REGIONID ?? ''),
    );
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.postWeighItemSuccess,
        ),
      );
  }
}

function* deleteWeighItemById({payload}: IDeleteItem) {
  const {id, isAlert} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const isResult = yield call(deleteWeightItem, id, userParams.userId);
  yield call(addLog, userParams.userId, 'DELETE', 'SCALE_TEMP_DETAIL', `${id}`);
  if (isResult) {
    yield put(wGoodsActions.deleteItemSuccess(id));
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.deleteItemSuccess,
        ),
      );
  }
}

function* handleGetItemsByScaleId({payload}: IGetWeighingGoodsItems) {
  const {scaleId, regionId} = payload;
  const items = yield call(getWeightItemDetailById, scaleId, regionId);
  yield put(wGoodsActions.getItemsByScaleIdSuccess(items));
}

function* handleUploadOrReturn({payload}: IWGoodsUploadOrReturn) {
  const {tempWeightID, status, isAlert, weightNo, nav, regionId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  let title = 'Chốt';
  if (status === WeighingGoodsStatus.UnUpload) {
    yield uploadWeight(userParams.userId, tempWeightID, regionId);
  } else {
    yield returnWeight(userParams.userId, tempWeightID, regionId);
    title = 'Huỷ chốt';
  }
  yield put(wGoodsActions.uploadOrReturnSuccess(tempWeightID, status));
  if (isAlert) {
    yield put(
      GlobalActions.openErrorInfoModal(
        AppStrings.WeighingGoods.uploadReturnSuccess(title, weightNo),
      ),
    );
  }
  onSagaNavigate(nav);
}

function* handleDeleteHeader({payload}: IDeleteHeader) {
  const {isAlert, scaleId, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const result = yield call(deleteHeader, scaleId, userParams.userId);
  yield call(addLog, userParams.userId, 'DELETE', 'SCALE_TEMP_HEADER', `${scaleId}`);
  if (result) {
    yield put(wGoodsActions.deleteHeaderSuccess(scaleId));
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.deleteHeaderSuccess,
        ),
      );
    }
    onSagaNavigate(nav);
  }
}

function* handleGetProducts({payload}: IGetProductListByDoNo) {
  const {doNo} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const goodsFilter: IGoodsFilterModel = {
    ...userParams,
    deptId: undefined,
    doNo,
  };
  const products: IGoodsDTO[] = yield call(getProductList, goodsFilter);  
  const data = convertToLocalObject<IGoodsDTO>(products, 'SCALENAME', 'GoodID');
  yield put(wGoodsActions.getProductsSuccess(data));
}

function* handleGetWeighingGoods({payload}: IGetListWGoods) {
  const {fromDate, toDate, tmpWeiStatus, unitId, locationId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const wGoodsData: IWeighingGoodsItemDTO[] = yield call(
    getListOfWeights,
    fromDate,
    toDate,
    userParams.userId,
    tmpWeiStatus,
    userParams.regionId ?? '',
    unitId,
    locationId,
  );
  yield put(wGoodsActions.getWGoodsListSuccess(wGoodsData));
}

// OFFLINE
function* handleGetProductsOffline() {
  const products = yield productsStockDatabase.getProductsStock();
  yield put(wGoodsActions.getProductsOfflineSuccess(products));
}

function* handleGetDosOffline() {
  const userParams: IUserParams = yield select(getUserParams);
  const dos = yield deliveryOrderDatabase.getOrders(userParams.userId);
  yield put(wGoodsActions.getDosOfflineSuccess(dos));
}

function* handleSaveHeaderOffline({payload}: ISaveHeaderOffline) {
  const {model, isAlert} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  if (!model.SCALENO)
    model.SCALENO = model.DONO?.toUpperCase().replace('DO', 'OFF');
  const modelResult: IWeighingGoodsModel | undefined =
    yield scaleTempDatabase.storeScaleHeader(model, userParams.userId);
  if (modelResult) {
    modelResult.LOCATION_NAME = modelResult.LOCATIONNAME;
    yield put(wGoodsActions.updateHeaderModelOffline(modelResult, false));
    yield call(deliveryOrderDatabase.updateScaleTempStatus, model.DONO!, true);
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.updateHeaderSuccess,
        ),
      );
  }
}

function* handleGetDetailsOffline({payload}: IGetDetailsOffline) {
  const {scaleId} = payload;
  const details = yield call(scaleTempDatabase.getDetailsByScaleId, scaleId);
  yield put(wGoodsActions.getDetailsOfflineSuccess(details));
}

function* handleAddDetailOffline({payload}: IAddDetailOffline) {
  const {scaleId, detailModel, isOverWeight, isAlert} = payload;
  const rs = yield call(
    scaleTempDatabase.addDetailIntoHeader,
    scaleId,
    detailModel,
  );

  // Nếu quá trọng lượng thì update lại header.
  if (isOverWeight) {
    yield call(scaleTempDatabase.updateEventIfExcessco, scaleId);
  }

  if (rs) {
    // yield put(wGoodsActions.addDetailOfflineSuccess(rs));
    yield put(wGoodsActions.updatePostItemStatus(true));
    yield put(wGoodsActions.getDetailsOffline(scaleId));
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.postWeighItemSuccess,
        ),
      );
    }
  }
}

function* handleDeleteDetailOffline({payload}: IDeleteDetailOffline) {
  const {detailId, scaleId, isAlert} = payload;
  const isSuccess = yield call(
    scaleTempDatabase.deleteDetailById,
    detailId,
    scaleId,
  );
  if (isSuccess) {
    yield put(wGoodsActions.deleteDetailOfflineSuccess(detailId));
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.deleteItemSuccess,
        ),
      );
  }
}

function* handleDeleteHeaderOffline({payload}: IDeleteHeaderOffline) {
  const {scaleId, doNo, isAlert, nav} = payload;
  const rs = yield call(scaleTempDatabase.deleteHeaderById, scaleId);
  if (rs) {
    yield put(wGoodsActions.deleteHeaderOfflineSuccess(scaleId));
    yield call(deliveryOrderDatabase.updateScaleTempStatus, doNo, false);

    yield put(wGoodsActions.getDosOffline());

    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.deleteHeaderSuccess,
        ),
      );
    onSagaNavigate(nav);
  }
}

function* handleLockUnlockHeaderOffline({payload}: ILockUnlockScaleOffline) {
  const {scaleId, isAlert} = payload;
  const rs = yield call(scaleTempDatabase.lockUnlock, scaleId);
  if (rs) {
    yield put(wGoodsActions.lockUnlockScaleOfflineSuccess(scaleId));
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(
          AppStrings.WeighingGoods.uploadReturnSuccess('Cập nhật', ''),
        ),
      );
  }
}

function* handleGetScaleTemptDataOffline({payload}: IGetScaleTempDataOffline) {
  // eslint-disable-next-line no-empty-pattern
  const {} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const data = yield call(
    scaleTempDatabase.getUnUploadedListOfScale,
    userParams.userId,
  );
  yield put(wGoodsActions.getScaleTempDataOfflineSuccess(data));
}

function* handleUploadScaleTempOffline({payload}: IUploadScaleTempOffline) {
  const {scaleTempLocalId} = payload;
  const userParams: IUserParams = yield select(getUserParams);

  const isLocked = yield call(
    scaleTempDatabase.checkScaleIsLocked,
    scaleTempLocalId,
    false,
  );

  if (!isLocked)
    throw new Error(
      'Phiếu cân chưa được chốt. Vui lòng chốt phiếu cân trước khi tải lên.',
    );

  const header: IWeighingGoodsItemDTO = yield call(
    scaleTempDatabase.getHeaderById,
    scaleTempLocalId,
    true,
  );

  const details = yield call(
    scaleTempDatabase.getDetailsByScaleId,
    scaleTempLocalId,
  );

  if (isInvalidString(header.REGIONID)) header.REGIONID = userParams.regionId;

  const scaleIdReturn: number = yield call(
    createScaleNoteOffline,
    userParams.userId,
    header,
    details,
  );
  if (scaleIdReturn > 0) {
    yield put(wGoodsActions.uploadScaleTempOfflineSuccess(scaleTempLocalId));
    delay(500);
    yield put(
      GlobalActions.openErrorInfoModal('Đã tải lên phiếu cân thành công.'),
    );
    yield call(
      scaleTempDatabase.updateOnlineId,
      scaleTempLocalId,
      scaleIdReturn,
    );
  }
}

function* handleConvertFromOnlineToOffline({
  payload,
}: IConvertModelOnlineToOffline) {
  const {} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const wGoodModel: IWeighingGoodsModel = yield select(
    (state: RootState) => state.wGoods.wGoodModel,
  );
  const items: IWeighingGoodsDetailDTO[] = yield select(
    (state: RootState) => state.wGoods.items,
  );

  const scaleOnlineId = wGoodModel.SCALE_ONLINE_ID;
  const offlineHeaderModel: IWeighingGoodsModel = {
    ...wGoodModel,
    SCALEID: undefined,
    SCALE_ONLINE_ID: scaleOnlineId,
    SCALEDATE: convertStringDateToMdDdYyyy(wGoodModel.SCALEDATE!),
    DEPARTTIME: getTimeFromStringDate(wGoodModel.DEPARTTIME),
    ARRIVALTIME: getTimeFromStringDate(wGoodModel.ARRIVALTIME),
  };

  // Lưu lại  header.
  const headerResult: IWeighingGoodsModel | undefined =
    yield scaleTempDatabase.storeScaleHeader(
      offlineHeaderModel,
      userParams.userId,
    );

  if (headerResult && headerResult.SCALEID) {
    yield put(wGoodsActions.updateHeaderModelOffline(headerResult, true));
    const scaleId = headerResult.SCALEID;
    yield all(
      items.map((item) => {
        const itemModel: IWeighingGoodsItemModel = {
          AVGBW: item.AVGBW,
          CREATEDBY: item.CREATEDBY,
          EARTAG1: item.EARTAG1,
          EARTAG2: item.EARTAG2,
          FLOCKID: item.FLOCKID,
          FLOCKNAME: item.FLOCKNAME,
          GWEIGHT: item.GWEIGHT,
          MEASURE: item.MEASURE,
          NWEIGHT: item.NWEIGHT,
          PRODUCTCODE: item.PRODUCTCODE,
          PRODUCTDOWN: item.PRODUCTDOWN ? 1 : 0,
          PRODUCTDOWNDESC: item.PRODUCTDOWNDESC,
          PRODUCTNAME: item.PRODUCTNAME,
          PWEIGHT: item.PWEIGHT,
          QTY: item.QTY,
          REGIONID: headerResult.REGIONID,
          REMARKS: item.REMARKS,
          SCALEID: item.SCALEID,
          SNITEMID: item.SNITEMID,
          UPDATEDBY: item.UPDATEDBY,
          WHID: item.WHID,
        };
        return call(scaleTempDatabase.addDetailIntoHeader, scaleId, itemModel);
      }),
    );
    yield put(wGoodsActions.getDetailsOffline(scaleId));
    onSagaNavigate({
      isNavigate: true,
      screen: ScreenType.WeighingGoods.CREATE_OFFLINE,
    });
  }
}

function* handlePrintBill({payload}: IPrintWeighingGoods) {
  const {numOfCopy, isOffline, items, model} = payload;
  if (!model) throw new Error('Dữ liệu phiếu cân cần in không đúng.');
  const printer: IStarDevice | undefined = yield select(
    getCurrentPrinterConnected,
  );
  if (!printer) {
    yield put(
      GlobalActions.openErrorInfoModal(
        'Vui lòng kết nối máy in trước.',
        'WARNING',
      ),
    );
    return;
  }

  if (!model.SCALENO) {
    model.SCALENO = model.DONO?.toUpperCase().replace(
      'DO',
      isOffline ? 'OFF' : 'ON',
    );
  }

  if (printer.type === 'RONGTA') {
    const rongtaPrinterServices: RongtaPrinterServices | undefined =
      yield select(getRongtaPrinterServices);
    if (!rongtaPrinterServices) return;
    rongtaPrintReceptTemplate(
      rongtaPrinterServices,
      model,
      items,
      printer.macAddress,
      isOffline,
      numOfCopy,
    );
  } else {
    const print = new StarPrinterServices('');
    StarScaleTempTemplate(model, items, `BT:${printer.macAddress}`, print);
  }
}
// ============== WATCHING ============//

function* watchGetListOfOrdersForWeightPreparation() {
  yield takeEvery(
    Types.WEIGHING_GOOD_GET_LIST_DO,
    safe(getListOfOrdersForWeightPreparation),
  );
}

function* watchPostHeader() {
  yield takeLeading(
    Types.WEIGHING_GOOD_POST_HEADER_MODEL,
    safe(handlePostHeader),
  );
}

function* watchPostItem() {
  yield takeLeading(Types.WEIGHING_GOOD_POST_ITEM_MODEL, safe(handlePostItem));
}

function* watchDeleteHeader() {
  yield takeLatest(
    Types.WEIGHING_GOODS_DELETE_HEADER,
    safe(handleDeleteHeader),
  );
}

function* watchDeleteItem() {
  yield takeEvery(Types.WEIGHING_GOOD_DELETE_ITEM, safe(deleteWeighItemById));
}

function* watchGetItemsByScaleId() {
  yield takeLatest(
    Types.WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID,
    safe(handleGetItemsByScaleId),
  );
}

function* watchWGoodsUploadOrReturn() {
  yield takeLeading(
    Types.WEIGHING_GOODS_UPLOAD_OR_RETURN,
    safe(handleUploadOrReturn),
  );
}

function* watchGetProducts() {
  yield takeEvery(
    Types.WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO,
    safe(handleGetProducts),
  );
}

function* watchGetListWeighingGoods() {
  yield takeEvery(Types.WEIGHING_GOOD_GET_LIST, safe(handleGetWeighingGoods));
}

// ==== OFFLINE

function* watchGetProductsOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_GET_PRODUCTS_OFFLINE,
    safe(handleGetProductsOffline),
  );
}

function* watchGetDosOffline() {
  yield takeEvery(
    Types.WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT,
    safe(handleGetDosOffline),
  );
}

function* watchSaveHeaderOffline() {
  yield takeLeading(
    Types.WEIGHING_GOODS_SAVE_HEADER_OFFLINE,
    safe(handleSaveHeaderOffline),
  );
}

function* watchGetDetailsOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_GET_DETAILS_OFFLINE,
    safe(handleGetDetailsOffline),
  );
}

function* watchAddDetailOffline() {
  yield takeLeading(
    Types.WEIGHING_GOODS_ADD_DETAIL_OFFLINE,
    safe(handleAddDetailOffline),
  );
}

function* watchDeleteDetailOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_DELETE_DETAIL_OFFLINE,
    safe(handleDeleteDetailOffline),
  );
}

function* watchDeleteHeaderOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_DELETE_HEADER_OFFLINE,
    safe(handleDeleteHeaderOffline),
  );
}

function* watchLockUnlockHeaderOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE,
    safe(handleLockUnlockHeaderOffline),
  );
}

function* watchGetTempDataOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE,
    safe(handleGetScaleTemptDataOffline),
  );
}

function* watchHandleUploadScaleTempOffline() {
  yield takeLeading(
    Types.WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE,
    safe(handleUploadScaleTempOffline),
  );
}

function* watchHandleConvertModelFromOnlineToOffline() {
  yield takeEvery(
    Types.WEIGHING_GOODS_CONVERT_MODEL_FROM_ONLINE_TO_OFFLINE,
    safe(handleConvertFromOnlineToOffline),
  );
}

function* watchPrintBill() {
  yield takeEvery(Types.WEIGHING_GOODS_PRINT_BILL, safe(handlePrintBill));
}

export default function* weighingGoodsRootSaga() {
  yield all([
    fork(watchGetListOfOrdersForWeightPreparation),
    fork(watchPostHeader),
    fork(watchPostItem),
    fork(watchDeleteItem),
    fork(watchGetItemsByScaleId),
    fork(watchWGoodsUploadOrReturn),
    fork(watchDeleteHeader),
    fork(watchGetProducts),
    fork(watchGetListWeighingGoods),
    fork(watchGetProductsOffline),
    fork(watchGetDosOffline),
    fork(watchSaveHeaderOffline),
    fork(watchGetDetailsOffline),
    fork(watchAddDetailOffline),
    fork(watchDeleteDetailOffline),
    fork(watchDeleteHeaderOffline),
    fork(watchLockUnlockHeaderOffline),
    fork(watchGetTempDataOffline),
    fork(watchHandleUploadScaleTempOffline),
    fork(watchHandleConvertModelFromOnlineToOffline),
    fork(watchPrintBill),
  ]);
}
