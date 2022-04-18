import {
  all,
  fork,
  takeEvery,
  call,
  put,
  select,
  delay,
  takeLatest,
} from 'redux-saga/effects';
import {
  DeliveryOrderStatus,
  IDoDetailDelete,
  IDoFilterModel,
  IDoHeaderCommon,
  IDoHeaderModel,
  IDoItem,
  IDoItemDetailModel,
} from '~/apis/types.service';
import {getUserParams, safe} from '../saga.helpers';
import {
  ICreateUpdateProductItem,
  IDeleteDetail,
  IDeleteDoHeader,
  IDoCreateUpdateHeaderModel,
  IFetchingDoData,
  IGetDoHeaderByCode,
  IGetHeaderInfoByNo,
  IGetProductsByCode,
  IGetReceiverName,
  IGetTruckNo,
  IPosToSale,
  Types,
} from './do.types';
import {
  getListDo,
  deleteDo,
  deleteDetailById,
  updateDoItem,
  postDoToSale,
  returnDoFromSale,
  updateDo,
  createDo,
  createDoItem,
  getTruckNo,
  getReceiverName,
} from '~/apis/do.service';
import DoActions from './do.actions';
import {isValidString, removeUnicode} from '~/helpers/UtilitiesHelper';
import GlobalActions from '../global/global.actions';
import {AppStrings} from '~/configs';
import {navigate} from '~/navigations/navigation.services';
import ScreenType from '~/navigations/screen.constant';
import {DropdownItemType, IUserParams} from '~/commons/types';

/** ===================== WORKER =================== */
function* handleSearchDo({payload: doFilter}: IFetchingDoData) {
  const response: IDoItem[] = yield call(getListDo, doFilter);
  const data: IDoItem[] = response.map((p) => {
    const keySearch = `${removeUnicode(p.CUSTNAME)} ${p.CUSTID} ${p.SONO} ${
      p.DONO
    }`;
    return {...p, key: keySearch};
  });
  yield put(DoActions.searchSuccess(data));
}

function* handleDeleteDoHeader({payload}: IDeleteDoHeader) {
  const {doHeader, isAlert, navigate: nav} = payload;
  const isResult: boolean = yield call(deleteDo, doHeader);
  if (isResult) {
    yield put(DoActions.removeSuccess(doHeader.doNo));
    if (nav && nav.isNavigate && nav.screen) {
      yield navigate(nav.screen);
      yield delay(500);
    }
    if (isAlert) {
      const message = AppStrings.DO.deleteSuccess.replace('{0}', doHeader.doNo);
      yield put(GlobalActions.openErrorInfoModal(message));
    }
  }
}

function* handleGetHeaderInfo({payload}: IGetDoHeaderByCode) {
  const {doNo, isRedirect} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const filterModel: IDoFilterModel = {
    doCode: doNo,
    loadDoDetail: true,
    loadScaleHeader: false,
    userId: userParams.userId,
    regionId: userParams.regionId ?? '',
    unitId: userParams.unitId ?? '',
  };

  const response: IDoItem[] = yield call(getListDo, filterModel);
  const headerInfo: IDoHeaderModel = {...response[0]};
  yield put(DoActions.getHeaderInfoSuccess(headerInfo));
  if (isRedirect) {
    navigate(ScreenType.DO.CREATE_ORDER);
  }
}

function* handleGetProductsDo({payload}: IGetProductsByCode) {
  const userParams: IUserParams = yield select(getUserParams);
  const {doNo, loadDoRel} = payload;
  const filter: IDoFilterModel = {
    doCode: doNo,
    regionId: userParams.regionId ?? '',
    unitId: userParams.unitId ?? '',
    userId: userParams.userId,
    deptId: userParams.deptId ?? 0,
    loadScaleHeader: false,
    loadDoDetail: true,
    loadDoRel,
  };
  const results: IDoItem[] = yield call(getListDo, filter);
  if (results) {
    const firstDo = results[0];
    const items: IDoItemDetailModel[] = firstDo.DODETAILS ?? [];
    yield put(DoActions.getProductsDoNoSuccess(items));
  }
}

function* handleDeleteDetail({payload}: IDeleteDetail) {
  const {doDetailId, isAlert} = payload;
  const userParams = yield select(getUserParams);
  const model: IDoDetailDelete = {
    ...userParams,
    dodtID: doDetailId,
  };
  const isResult: boolean = yield call(deleteDetailById, model);
  if (isResult) {
    yield put(DoActions.deleteDetailSuccess(doDetailId));
    if (isAlert)
      yield put(GlobalActions.openErrorInfoModal(AppStrings.DO.deleteProduct));
  }
}

function* handleCreateUpdateProductItem({payload}: ICreateUpdateProductItem) {
  const {isRedirect, itemModel} = payload;
  let doDetailId: number = itemModel.DODTID ?? 0;
  let isResult = false;
  if (doDetailId > 0) isResult = yield call(updateDoItem, itemModel);
  else {
    doDetailId = yield call(createDoItem, itemModel);
    isResult = doDetailId > 0;
  }
  if (isResult) {
    yield put(DoActions.getProductsDoNo(itemModel.DONO));
    if (isRedirect) navigate(ScreenType.DO.PRODUCTS);
  }
}

function* handleGetHeaderInfoByNo({payload: doNo}: IGetHeaderInfoByNo) {
  const userParams: IUserParams = yield select(getUserParams);
  const filterModel: IDoFilterModel = {
    doCode: doNo,
    loadDoDetail: true,
    loadScaleHeader: false,
    regionId: userParams.regionId ?? '',
    userId: userParams.userId ?? '',
    deptId: userParams.deptId ?? 0,
  };
  const response: IDoItem[] = yield call(getListDo, filterModel);
  const headerInfo: IDoHeaderModel = {...response[0]};
  yield put(DoActions.getHeaderInfoByNoSuccess(headerInfo));
}

function* handlePostToSale({payload}: IPosToSale) {
  const {doNo, status, isAlert, isConfirm} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IDoHeaderCommon = {
    userId: userParams.userId,
    deptId: userParams.deptId,
    officeId: userParams.officeId,
    regionId: userParams.regionId,
    doNo,
    isPostConfirm: isConfirm,
  };

  const isResponse: boolean =
    status === DeliveryOrderStatus.New
      ? yield call(postDoToSale, model)
      : yield call(returnDoFromSale, model);
  if (isAlert) {
    yield put(
      GlobalActions.openErrorInfoModal(
        AppStrings.DO.postToInvoiceSuccess.replace('{0}', doNo),
      ),
    );
  }
  if (isResponse) yield put(DoActions.getHeaderInfoByNo(doNo));
}

function* handleCreateUpdateHeaderModel({payload}: IDoCreateUpdateHeaderModel) {
  const {model, navigate: nav} = payload;
  let isResult = false;
  let doNo: string = model.DONO;
  if (isValidString(doNo)) {
    // Update
    isResult = yield call(updateDo, model);
  } else {
    // create
    const obj: IDoHeaderModel = {...model, DONO: '%0-00-0000-00001'};
    doNo = yield call(createDo, obj);
    isResult = isValidString(doNo);
  }
  if (isResult) {
    yield put(DoActions.getHeaderInfo(doNo));
    if (nav && nav.isNavigate) {
      navigate(nav.screen);
    }
  }
}

function* handleGetTruckNo({payload}: IGetTruckNo) {
  const {custId} = payload;
  const userParams = yield select(getUserParams);
  const filter: IDoFilterModel = {...userParams, custId};
  const data: string[] = yield call(getTruckNo, filter);
  const dropdownData: DropdownItemType[] = data.map((value) => {
    const item: DropdownItemType = {
      label: value,
      value,
      keySearch: removeUnicode(value),
    };
    return item;
  });
  yield put(DoActions.getTruckNoSuccess(dropdownData));
}

function* handleGetReceiverName({payload}: IGetReceiverName) {
  const {custId} = payload;
  const userParams = yield select(getUserParams);
  const filter: IDoFilterModel = {...userParams, custId};
  const data: string[] = yield call(getReceiverName, filter);
  const dropdownData: DropdownItemType[] = data.map((value) => {
    const item: DropdownItemType = {
      label: value,
      value,
      keySearch: removeUnicode(value),
    };
    return item;
  });
  yield put(DoActions.getReceiverNameSuccess(dropdownData));
}

/** ===================== WATCHER ================== */

function* watchSearchDo() {
  yield takeEvery(Types.DO_FETCHING_LIST_DATA, safe(handleSearchDo));
}

function* watchDeleteDoHeader() {
  yield takeEvery(Types.DO_DELETE_HEADER, safe(handleDeleteDoHeader));
}

function* watchHandleGetHeaderDetail() {
  yield takeEvery(Types.DO_GET_HEADER_INFO_BY_DO_NO, safe(handleGetHeaderInfo));
}

function* watchGetProductsDo() {
  yield takeEvery(Types.DO_GET_PRODUCTS_BY_DONO, safe(handleGetProductsDo));
}

function* watchDeleteDetail() {
  yield takeEvery(Types.DO_DELETE_DETAIL, safe(handleDeleteDetail));
}

function* watchCreateUpdateProductItem() {
  yield takeEvery(
    Types.DO_CREATE_UPDATE_PRODUCT_ITEM,
    safe(handleCreateUpdateProductItem),
  );
}

function* watchGetHeaderInfoByNo() {
  yield takeEvery(
    Types.DO_GET_HEADER_INFO_BY_NO,
    safe(handleGetHeaderInfoByNo),
  );
}

function* watchPostToSale() {
  yield takeEvery(Types.DO_POST_TO_SALE, safe(handlePostToSale));
}

function* watchCreateUpdateHeaderModel() {
  yield takeLatest(
    Types.DO_CREATE_UPDATE_HEADER,
    safe(handleCreateUpdateHeaderModel),
  );
}

function* watchGetTruckNo() {
  yield takeEvery(Types.DO_GET_TRUCK_NO, safe(handleGetTruckNo));
}

function* watchGetReceiverName() {
  yield takeEvery(Types.DO_GET_RECEIVER_NAME, safe(handleGetReceiverName));
}

export default function* doRootSaga() {
  yield all([
    fork(watchSearchDo),
    fork(watchDeleteDoHeader),
    fork(watchHandleGetHeaderDetail),
    fork(watchGetProductsDo),
    fork(watchDeleteDetail),
    fork(watchCreateUpdateProductItem),
    fork(watchGetHeaderInfoByNo),
    fork(watchPostToSale),
    fork(watchCreateUpdateHeaderModel),
    fork(watchGetTruckNo),
    fork(watchGetReceiverName),
  ]);
}
