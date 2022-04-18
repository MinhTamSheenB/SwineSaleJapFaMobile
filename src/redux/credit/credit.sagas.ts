import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {
  search,
  approveCredit,
  updateCredit,
  createCredit,
  deleteCredit,
  sendCredit,
  unSendCredit,
  cancelCredit,
  rejectCredit,
} from '~/apis/credit.service';
import {
  CreditStatus,
  ICreditDTO,
  ICreditFilterModel,
  ICreditModelCommon,
} from '~/apis/types.service';
import {IUserParams} from '~/commons/types';
import GlobalActions from '../global/global.actions';
import {getUserParams, onSagaNavigate, safe} from '../saga.helpers';
import CreditActions from './credit.actions';
import {
  ICreate,
  IDoAnotherAction,
  IGetDetailById,
  ISearching,
  Types,
} from './credit.types';

// WORKER

function* handleSearch({payload}: ISearching) {
  const {fromDate, toDate, status, creditCode, custId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const filterModel: ICreditFilterModel = {
    deptId: userParams.deptId,
    regionId: userParams.regionId,
    officeId: userParams.officeId,
    fromDate,
    toDate,
    status,
    custId,
    creditCode,
  };
  const data: ICreditDTO[] = yield call(search, filterModel);
  yield put(CreditActions.searchSuccess(data));
}

function* handleCreateUpdate({payload}: ICreate) {
  const {model, nav} = payload;
  let creditId = model.CREDIT_ID ?? 0;
  let isSuccess = false;
  if (creditId > 0) {
    isSuccess = yield call(updateCredit, model);
  } else {
    creditId = yield call(createCredit, model);
    isSuccess = creditId > 0;
  }
  if (isSuccess) {
    yield put(CreditActions.createSuccess());
    yield onSagaNavigate(nav);
  }
}

function* handleDoAnotherAction({payload}: IDoAnotherAction) {
  const {type, creditId, isAlert, message, nav} = payload;
  let isSuccess = false;
  const userParams: IUserParams = yield select(getUserParams);
  const obj: ICreditModelCommon = {...userParams, creditId, reason: message};
  let messageAlert = '';
  let status = CreditStatus.New;
  switch (type) {
    case 'DELETE': {
      isSuccess = yield call(deleteCredit, obj);
      messageAlert = 'Xóa xin nợ thành công';
      status = CreditStatus.Deleted;
      break;
    }
    case 'SEND': {
      isSuccess = yield call(sendCredit, obj);
      messageAlert = 'Gửi xin nợ thành công';
      status = CreditStatus.SendAndWait;
      break;
    }
    case 'UNSEND': {
      isSuccess = yield call(unSendCredit, obj);
      messageAlert = 'Hủy gửi xin nợ thành công';
      break;
    }
    case 'APPROVED': {
      isSuccess = yield call(approveCredit, obj);
      messageAlert = 'Duyệt xin nợ thành công';
      status = CreditStatus.Approved;
      break;
    }
    case 'CANCEL': {
      isSuccess = yield call(cancelCredit, obj);
      messageAlert = 'Hủy xin nợ thành công';
      status = CreditStatus.Cancel;
      break;
    }
    case 'REJECT': {
      isSuccess = yield call(rejectCredit, obj);
      messageAlert = 'Đã từ chối xin nợ thành công.';
      status = CreditStatus.Rejected;
      break;
    }
    default: {
      break;
    }
  }
  if (isSuccess) {
    yield put(CreditActions.doAnotherActionSuccess(type, creditId, status));
  }
  if (isAlert) {
    yield put(GlobalActions.openErrorInfoModal(messageAlert, 'INFO'));
  }
  onSagaNavigate(nav);
}

function* handleGetDetail({payload}: IGetDetailById) {
  const {id} = payload;
  const filterModel: ICreditFilterModel = {creditCode: id, loadDetail: true};
  const data: ICreditDTO[] = yield call(search, filterModel);
  if (data.length > 0) {
    yield put(CreditActions.getDetailSuccess(data[0]));
  }
}

// WATCHER
function* watchSearch() {
  yield takeEvery(Types.SEARCH, safe(handleSearch));
}

function* watchCreateUpdate() {
  yield takeEvery(Types.CREATE_UPDATE, safe(handleCreateUpdate));
}

function* watchDoAnotherAction() {
  yield takeEvery(Types.DO_ANOTHER_ACTION, safe(handleDoAnotherAction));
}

function* watchGetDetail() {
  yield takeEvery(Types.GET_DETAIL_BY_CREDIT_ID, safe(handleGetDetail));
}

export default function* rootCreditSaga() {
  yield all([
    fork(watchSearch),
    fork(watchCreateUpdate),
    fork(watchDoAnotherAction),
    fork(watchGetDetail),
  ]);
}
