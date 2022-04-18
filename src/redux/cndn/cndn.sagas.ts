import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {
  deleteHeader,
  search,
  approveCndn,
  rejectCndn,
  postToInvoice,
  createHeader,
  updateHeader,
  updateDetail,
  createDetail,
  deleteDetail,
} from '~/apis/cndn.services';
import {
  ICndnDtoItem,
  ICndnFilterModel,
  ICndnHeaderModel,
  ICndnModelCommon,
} from '~/apis/types.service';
import {IUserParams} from '~/commons/types';
import {AppStrings} from '~/configs';
import AppString from '~/configs/strings';
import {convertStringDateToMdDdYyyy, formatDate, getCurrentDateToString} from '~/helpers/DatetimeHelpers';
import {isValidString, isInvalidString} from '~/helpers/UtilitiesHelper';
import GlobalActions from '../global/global.actions';
import {getUserParams, onSagaNavigate, safe} from '../saga.helpers';
import CndnActions from './cndn.actions';
import {
  IApprove,
  ICreateDetail,
  ICreateUpdate,
  IDeleteHeader,
  IGetCndnItemsByNo,
  IGetHeaderModelByNo,
  IGetInfoByNo,
  IReject,
  ISearch,
  IDeleteDetail,
  Types,
} from './cndn.types';

// WORKER

function* handleSearch({payload}: ISearch) {
  const {fromDate, toDate, status, cndnCode, custId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const filterModel: ICndnFilterModel = {
    deptId: userParams.deptId,
    regionId: userParams.regionId,
    officeId: userParams.officeId,
    fromDate,
    toDate,
    status,
    cndnCode,
    custId,
  };
  const data: ICndnDtoItem[] = yield call(search, filterModel);
  yield put(CndnActions.searchSuccess(data, status));
}

function* handleDelete({payload}: IDeleteHeader) {
  const {cndnNo, status, isAlert, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: ICndnModelCommon = {userId: userParams.userId, CndnNo: cndnNo};
  const isResult: boolean = yield call(deleteHeader, model);
  if (isResult) {
    yield put(CndnActions.deleteHeaderSuccess(cndnNo, status));
    if (isAlert)
      yield put(
        GlobalActions.openErrorInfoModal(AppStrings.Cndn.deleteHeader(cndnNo)),
      );
    onSagaNavigate(nav);
  }
}

function* handleGetInfoByNo({payload}: IGetInfoByNo) {
  const {cndnNo} = payload;
  const filterModel: ICndnFilterModel = {cndnCode: cndnNo, loadDetail: true};
  const data: ICndnDtoItem[] = yield call(search, filterModel);
  const dto: ICndnDtoItem | undefined = data && data[0];
  console.log({dto});
  yield put(CndnActions.getInfoByNoSuccess(dto));
}

function* handleApprove({payload}: IApprove) {
  const {cndnNo, isAlert, item, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: ICndnModelCommon = {userId: userParams.userId, CndnNo: cndnNo};
  const isResult: boolean = yield call(approveCndn, model);
  if (isResult) {
    yield put(CndnActions.approveSuccess(cndnNo, item.STATUS, item));
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(AppString.Cndn.approveSuccess(cndnNo)),
      );
    }
    onSagaNavigate(nav);
  }
}

function* handleReject({payload}: IReject) {
  const {cndnNo, reason, isAlert, nav, item} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: ICndnModelCommon = {userId: userParams.userId, CndnNo: cndnNo};
  const isResult: boolean = yield call(rejectCndn, model, reason);
  if (isResult) {
    yield put(CndnActions.rejectSuccess(cndnNo, item.STATUS, item));
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(AppString.Cndn.rejectSuccess(cndnNo)),
      );
    }
    onSagaNavigate(nav);
  }
}

function* handleInvoice({payload}: IApprove) {
  const {cndnNo, isAlert, item, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: ICndnModelCommon = {
    userId: userParams.userId,
    deptId: userParams.deptId,
    CndnNo: cndnNo,
  };

  const isResult: boolean = yield call(postToInvoice, model);
  if (isResult) {
    yield put(CndnActions.invoiceSuccess(cndnNo, item.STATUS, item));
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(AppString.Cndn.invoiceSuccess(cndnNo)),
      );
    }
    onSagaNavigate(nav);
  }
}

function* handleCreateUpdate({payload}: ICreateUpdate) {
  const {model, nav} = payload;
  let cndnNo: string = model.CNDNNO ?? '';
  let isResult = false;
  const userParams: IUserParams = yield select(getUserParams);

  if (isInvalidString(cndnNo)) {
    model.REGIONID = userParams.regionId ?? undefined;
    model.CREATEDBY = userParams.userId;
    model.UPDATEDBY = userParams.userId;
    model.DEPTID = userParams.deptId ?? undefined;
    model.OFFICEID = userParams.officeId ?? undefined;
    cndnNo = yield call(createHeader, model);
    isResult = isValidString(cndnNo);
  } else {
    model.UPDATEDBY = userParams.unitId!;
    model.UPDATEDDATE = getCurrentDateToString();
    isResult = yield call(updateHeader, model);
  }

  if (isResult) {
    yield put(CndnActions.getHeaderModelByNo(cndnNo, nav));
  }
}

function* handleGetHeaderModelByNo({payload}: IGetHeaderModelByNo) {
  const {no, nav} = payload;
  const model: ICndnFilterModel = {cndnCode: no};
  const data: ICndnDtoItem[] = yield call(search, model);
  const item: ICndnDtoItem = data[0];

  const localModel: ICndnHeaderModel = {
    UPDATEDBY: item.UPDATEDBY,
    UPDATEDDATE: item.UPDATEDDATE,
    REGIONID: item.REGIONID,
    OFFICEID: item.OFFICEID,
    DEPTID: item.DEPTID,
    UNITID: item.UNITID,
    CNDNNO: item.CNDNNO,
    CNDNDATE: convertStringDateToMdDdYyyy(item.CNDNDATE),
    CNDNTYPE: item.CNDNTYPE ?? 0,
    CUSTNO: item.CUSTNO,
    CUSTNAME: item.CUSTNAME,
    CUSTADDRESS: item.CUSTADDRESS,
    CUSTTAXCODE: item.CUSTTAXCODE,
    CURRENCY: item.CURRENCY,
    NOTES: item.NOTES,
    STATUS: item.STATUS,
    STATUS_DESC: item.STATUS_DESC,
    CREATEDDATE: convertStringDateToMdDdYyyy(item.CREATEDDATE),
    CREATEDBY: item.CREATEDBY,
    CNDN4ACCTYPE: item.CNDN4ACCTYPE,
    TOTALAMT: item.TOTALAMT ?? 0,
    TOTALQTY: item.TOTALQTY ?? 0,
    PIT: item.PIT,
    PIT_FLAG: item.PIT_FLAG,
    P_USAGEDIS: item.P_USAGEDIS,
    S_USAGEDIS: item.S_USAGEDIS,
  };

  yield put(CndnActions.updateHeaderLocalModel(localModel));
  onSagaNavigate(nav);
}

function* handleGetDetailsByCode({payload}: IGetCndnItemsByNo) {
  const {cndnNo} = payload;
  const data: ICndnDtoItem[] = yield call(search, {
    cndnCode: cndnNo,
    loadDetail: true,
  });
  if (data.length > 0) {
    yield put(CndnActions.getDetailsSuccess(data[0].CNDNDETAILS));
  }
}

function* handleCreateDetail({payload}: ICreateDetail) {
  const {model, nav} = payload;
  let isResult = false;
  let detailId = model.CNDNDTID ?? 0;
  const userParams: IUserParams = yield select(getUserParams);
  model.UPDATEDBY = userParams.userId;
  if (detailId > 0) {
    isResult = yield call(updateDetail, model);
  } else {
    model.CREATEDBY = userParams.userId;
    model.REGIONID = userParams.regionId;
    model.OFFICEID = userParams.officeId;
    model.DEPTID = userParams.deptId;
    detailId = yield call(createDetail, model);
    isResult = detailId > 0;
  }
  if (isResult) {
    yield put(CndnActions.getDetails(model.CNDNNO ?? ''));
  }
  yield onSagaNavigate(nav);
}

function* handleDeleteDetail({payload}: IDeleteDetail) {
  const {isAlert, cndndtID, CndnNo} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: ICndnModelCommon = {userId: userParams.userId, CndnNo};
  const isResult: boolean = yield call(deleteDetail, model, cndndtID);
  if (isResult) {
    yield put(CndnActions.deleteDetailSuccess(cndndtID));
  }
  if (isAlert) {
    yield put(GlobalActions.openErrorInfoModal('Xóa sản phẩm thành công.'));
  }
}

// WATCHER
function* watchSearch() {
  yield takeEvery(Types.SEARCH, safe(handleSearch));
}

function* watchDeleteHeader() {
  yield takeEvery(Types.DELETE_HEADER, safe(handleDelete));
}

function* watchGetInfoByNo() {
  yield takeEvery(Types.GET_CNDN_INFO_BY_NO, safe(handleGetInfoByNo));
}

function* watchApprove() {
  yield takeEvery(Types.APPROVE, safe(handleApprove));
}

function* watchReject() {
  yield takeEvery(Types.REJECT, safe(handleReject));
}

function* watchInvoice() {
  yield takeEvery(Types.INVOICE, safe(handleInvoice));
}

function* watchCreateUpdate() {
  yield takeLatest(Types.CREATE_UPDATE, safe(handleCreateUpdate));
}

function* watchGetHeaderModelByNo() {
  yield takeLatest(
    Types.GET_HEADER_MODEL_BY_NO,
    safe(handleGetHeaderModelByNo),
  );
}

function* watchCreateDetail() {
  yield takeLatest(Types.CREATE_DETAIL, safe(handleCreateDetail));
}

function* watchGetDetailsByCode() {
  yield takeEvery(Types.GET_CNDN_ITEMS_BY_NO, safe(handleGetDetailsByCode));
}

function* watchDeleteDetail() {
  yield takeEvery(Types.DELETE_DETAIL, safe(handleDeleteDetail));
}

export default function* rootCndnSaga() {
  yield all([
    fork(watchSearch),
    fork(watchDeleteHeader),
    fork(watchGetInfoByNo),
    fork(watchApprove),
    fork(watchReject),
    fork(watchInvoice),
    fork(watchCreateUpdate),
    fork(watchGetHeaderModelByNo),
    fork(watchCreateDetail),
    fork(watchGetDetailsByCode),
    fork(watchDeleteDetail),
  ]);
}
