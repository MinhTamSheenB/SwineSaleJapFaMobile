import {takeEvery, all, fork, call, put, select} from 'redux-saga/effects';
import {
  ICreateSoDetail,
  IDeletingSoHeader,
  IFetchingRequest,
  IGetHeaderInfoAndUpdateLocalModel,
  IGetPIT,
  IGetReceiverName,
  IGetSoInformationAndDetails,
  IGetTruckNo,
  IRevertSo,
  ISoCalculateDetail,
  ISoCreateNewHeader,
  ISoDeleteDetail,
  ISoGetDetailsByCode,
  ISoPostToDo,
  Types,
} from './so.types';
import {
  ISoDetail,
  ISoDetailModel,
  ISoFilterModel,
  ISoHeaderModel,
  ISuccess,
} from '~/apis/types.service';
import {
  createSo,
  deleteSoHeader,
  getListSo,
  updateSo,
  deleteSoDetail,
  createSoDetail,
  updateSoDetail,
  postToDo,
  revertSo,
  getTruckNo,
  getReceiverName,
  calculatorDetail,
  getPITValue,
} from '~/apis/so.service';
import SoAction from './so.actions';
import {getUserParams, safe} from '../saga.helpers';
import {
  isInvalidString,
  isValidString,
  removeUnicode,
} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '../global/global.actions';
import {AppStrings} from '~/configs';
import {DropdownItemType, IUserParams} from '~/commons/types';

/* ========== WORKER =================  */
function* handleSearchSo({payload}: IFetchingRequest) {
  const response: ISoDetail[] = yield call(getListSo, payload);
  if (response) {
    const data: ISoDetail[] = response.map((p) => {
      const item: ISoDetail = {
        ...p,
        key: removeUnicode(`${p.SONO} ${p.CUSTNAME}`),
      };
      return item;
    });
    yield put(SoAction.searchSuccess(data));
  }
}

function* handleDeleteSoHeader({payload}: IDeletingSoHeader) {
  const response = yield call(deleteSoHeader, payload);
  if (response) {
    const success: ISuccess = {code: payload.soNo};
    yield put(SoAction.deleteHeaderSuccess(success));
    yield put(GlobalActions.setAction(Types.SO_DELETING_HEADER, true));
  }
}

function* handleCreateHeader({payload}: ISoCreateNewHeader) {
  yield put(SoAction.changeSubmitStatus(false, undefined));
  const {model, screen} = payload;
  let soCode: string = model.SONO;
  let isResult = false;
  if (isInvalidString(soCode)) {
    // create
    const header: ISoHeaderModel = {...model, SONO: 'NEW'};
    soCode = yield call(createSo, header);
    isResult = isValidString(soCode);
  } else {
    // update
    isResult = yield call(updateSo, model);
  }
  if (isResult) {
    const soHeader: ISoHeaderModel = {...model, SONO: soCode};
    yield put(SoAction.createSoHeaderSuccess(soHeader, screen));
  }
}

function* handleGetSoDetails({payload: soCode}: ISoGetDetailsByCode) {
  const soFilter: ISoFilterModel = {soCode, loadDetail: true};
  const response: ISoDetail[] = yield call(getListSo, soFilter);
  let details: ISoDetailModel[] = [];
  if (response && response.length > 0) {
    details = response[0].SODETAILS ?? [];
  }
  yield put(SoAction.getDetailsByCodeSuccess(details));
}

function* handleDeleteSoDetail({payload}: ISoDeleteDetail) {
  const result: boolean = yield call(deleteSoDetail, payload);
  if (result) yield put(SoAction.deleteSoDetailSuccess(payload.sodtID));
}

function* handleCreateDetail({payload: detail}: ICreateSoDetail) {
  yield put(SoAction.changeSubmitStatus(false, ScreenType.SO.ADD_PRODUCT));
  yield put(SoAction.resetMoneyDetail());
  const soNo = detail.SONO;
  let isResult = false;
  if (detail.SODTID && detail.SODTID > 0) {
    isResult = yield call(updateSoDetail, detail);
  } else {
    const response = yield call(createSoDetail, detail);
    isResult = response !== null && response !== undefined;
  }
  if (isResult && soNo) {
    yield put(SoAction.getDetailsByCode(soNo));
    yield put(SoAction.changeSubmitStatus(true, ScreenType.SO.ADD_PRODUCT));
  }
}

function* handleGetInformationAndDetails({
  payload: soCode,
}: IGetSoInformationAndDetails) {
  const soFilter: ISoFilterModel = {soCode, loadDetail: true};
  const response: ISoDetail[] = yield call(getListSo, soFilter);
  if (response)
    yield put(SoAction.getSoInformationAndDetailsSuccess(response[0]));
}

function* handlePostToDo({payload: soHeader}: ISoPostToDo) {
  const isResult: boolean = yield call(postToDo, soHeader);
  if (isResult) {
    yield put(SoAction.postToDoSuccess(soHeader.soNo));
    yield put(GlobalActions.openErrorInfoModal(AppStrings.SO.postToDoSuccess));
  }
}

function* handleRevertToSo({payload}: IRevertSo) {
  const isResult = yield call(revertSo, payload);
  if (isResult) {
    yield put(SoAction.revertToSoSuccess(payload.soNo));
    yield put(
      GlobalActions.openErrorInfoModal(AppStrings.SO.revertToSoSuccess),
    );
  }
}

function* handleGetTruckNo({payload}: IGetTruckNo) {
  const {custId} = payload;
  const userParams = yield select(getUserParams);
  const filter: ISoFilterModel = {...userParams, deptId: undefined, custId};
  const data: string[] = yield call(getTruckNo, filter);
  const dropdownData: DropdownItemType[] = data.map((value) => {
    const item: DropdownItemType = {
      label: value,
      value,
      keySearch: removeUnicode(value),
    };
    return item;
  });
  yield put(SoAction.getTruckNoSuccess(dropdownData));
}

function* handleGetReceiverName({payload}: IGetReceiverName) {
  const {custId} = payload;
  const userParams = yield select(getUserParams);
  const filter: ISoFilterModel = {...userParams, deptId: undefined, custId};
  const data: string[] = yield call(getReceiverName, filter);
  const dropdownData: DropdownItemType[] = data.map((value) => {
    const item: DropdownItemType = {
      label: value,
      value,
      keySearch: removeUnicode(value),
    };
    return item;
  });
  yield put(SoAction.getReceiverNameSuccess(dropdownData));
}

function* handleCalculateDetail({payload}: ISoCalculateDetail) {
  const {detail} = payload;
  const money: number = yield call(calculatorDetail, detail);
  yield put(SoAction.calculateDetailSuccess(money));
}

function* handleGetHeaderAndUpdateLocalModel({
  payload,
}: IGetHeaderInfoAndUpdateLocalModel) {
  const {soCode} = payload;
  const soFilter: ISoFilterModel = {soCode, loadDetail: false};
  const response: ISoDetail[] = yield call(getListSo, soFilter);
  if (response)
    yield put(SoAction.getHeaderInfoAndUpdateLocalModelSuccess(response[0]));
}

function* handleGetPit() {
  const userParams: IUserParams = yield select(getUserParams);
  const pit = yield call(getPITValue, userParams.regionId ?? '');
  yield put(SoAction.getPitSuccess(pit));
}
/* ========== WATCHER =================  */
function* watchSearchSo() {
  yield takeEvery(Types.SO_FETCHING_LIST_DATA, safe(handleSearchSo));
}

function* watchDeleteSoHeader() {
  yield takeEvery(Types.SO_DELETING_HEADER, safe(handleDeleteSoHeader));
}

function* watchCreateNewSoHeader() {
  yield takeEvery(Types.SO_CREATE_NEW_HEADER, safe(handleCreateHeader));
}

function* watchGetSoDetail() {
  yield takeEvery(Types.SO_GET_DETAILS_BY_CODE, safe(handleGetSoDetails));
}

function* watchDeleteSoDetail() {
  yield takeEvery(Types.SO_DELETE_DETAIL, safe(handleDeleteSoDetail));
}

function* watchCreateDetail() {
  yield takeEvery(Types.SO_CREATE_DETAIL, safe(handleCreateDetail));
}

function* watchGetSoInformationByCode() {
  yield takeEvery(
    Types.SO_GET_INFORMATION_AND_DETAILS_BY_CODE,
    safe(handleGetInformationAndDetails),
  );
}

function* watchPostToDo() {
  yield takeEvery(Types.SO_POST_TO_DO, safe(handlePostToDo));
}

function* watchRevertToSo() {
  yield takeEvery(Types.SO_REVERT_DO_TO_SO, safe(handleRevertToSo));
}

function* watchGetTruckNo() {
  yield takeEvery(Types.SO_GET_TRUCK_NO, safe(handleGetTruckNo));
}

function* watchGetReceiverName() {
  yield takeEvery(Types.SO_GET_RECEIVER_NAME, safe(handleGetReceiverName));
}

function* watchCalculateDetail() {
  yield takeEvery(Types.SO_DETAIL_CALCULATE_AMT, safe(handleCalculateDetail));
}

function* watchGetHeaderAndUpdateLocalModel() {
  yield takeEvery(
    Types.SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL,
    safe(handleGetHeaderAndUpdateLocalModel),
  );
}

function* watchGetPit() {
  yield takeEvery(Types.SO_GET_PIT, safe(handleGetPit));
}

export default function* soSaga() {
  yield all([
    fork(watchSearchSo),
    fork(watchDeleteSoHeader),
    fork(watchCreateNewSoHeader),
    fork(watchGetSoDetail),
    fork(watchDeleteSoDetail),
    fork(watchCreateDetail),
    fork(watchGetSoInformationByCode),
    fork(watchPostToDo),
    fork(watchRevertToSo),
    fork(watchGetTruckNo),
    fork(watchGetReceiverName),
    fork(watchCalculateDetail),
    fork(watchGetHeaderAndUpdateLocalModel),
    fork(watchGetPit),
  ]);
}
