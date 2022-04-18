import {fork, all, call, put, takeEvery, select} from 'redux-saga/effects';
import {IUserParams} from '~/commons/types';
import {
  ICreateOrUpdate,
  IDeleteHeader,
  IPost,
  IReturnPost,
  ISearch,
  ISetModel,
  Types,
} from './discount.types';
import {getUserParams, onSagaNavigate, safe} from '../saga.helpers';
import {
  DiscountStatus,
  IDiscountFilterModel,
  IDiscountItemDTO,
  IDiscountModel,
  IDiscountModelCommon,
} from '~/apis/types.service';
import {
  createDiscount,
  deleteDiscount,
  search,
  updateDiscount,
  postDiscount,
  rePostDiscount,
} from '~/apis/discount.services';
import DiscountActions from './discount.actions';
import {AppStrings} from '~/configs';
import {removeUnicode} from '~/helpers/UtilitiesHelper';
import {formatDate, getCurrentDateToString} from '~/helpers/DatetimeHelpers';
import GlobalActions from '../global/global.actions';

// WORKER
function* handleSearch({payload}: ISearch) {
  const {custId, disCode, status, fromDate, toDate} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IDiscountFilterModel = {
    ...userParams,
    unitId: null,
    custId,
    disCode,
    status,
    fromDate,
    toDate,
  };
  const data: IDiscountItemDTO[] = yield call(search, model);
  const newData: IDiscountItemDTO[] = data.map((dto) => ({
    ...dto,
    keySearch: `${dto.DISCOUNTID} ${dto.CUSTID} ${removeUnicode(dto.CUSTNAME)}`,
  }));
  yield put(DiscountActions.searchSuccess(newData));
}

function* handleCreateOrUpdate({payload}: ICreateOrUpdate) {
  const {model, isAlert} = payload;
  let discountId = model.DISCOUNTID ?? 0;
  let isSuccess = false;
  if (discountId > 0) {
    isSuccess = yield call(updateDiscount, model);
  } else {
    discountId = yield call(createDiscount, model);
    isSuccess = discountId > 0;
  }

  if (isSuccess) {
    const itemFilter: IDiscountFilterModel = {disCode: `${discountId}`};
    const dtoS: IDiscountItemDTO[] = yield call(search, itemFilter);
    if (dtoS.length > 0) {
      yield put(DiscountActions.createOrUpdateSuccess(dtoS[0]));
    }

    const message =
      (model.DISCOUNTID ?? 0) < 1
        ? AppStrings.Discount.createSuccess
        : AppStrings.Discount.updateSuccess;
    if (isAlert) yield put(GlobalActions.openErrorInfoModal(message));
  }
}

function* handleDeleteHeader({payload}: IDeleteHeader) {
  const {discountId, discountNo, isAlert, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IDiscountModelCommon = {...userParams, discountId};
  const isResult: boolean = yield call(deleteDiscount, model);
  if (isResult) {
    yield put(DiscountActions.deleteSuccess(discountId));
    const message = AppStrings.Discount.DeleteSuccess.replace(
      '{0}',
      discountNo,
    );
    if (isAlert) yield put(GlobalActions.openErrorInfoModal(message));
    onSagaNavigate(nav);
  }
}

function* handlePostDiscount({payload}: IPost) {
  const {discountId, discountNo, isAlert, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IDiscountModelCommon = {...userParams, discountId};
  const isResult: boolean = yield call(postDiscount, model);
  if (isResult) {
    yield put(DiscountActions.postSuccess(discountId));
    const message = AppStrings.Discount.postSuccess.replace('{0}', discountNo);
    if (isAlert) yield put(GlobalActions.openErrorInfoModal(message));
    onSagaNavigate(nav);
  }
}

function* handleReturnPostDiscount({payload}: IReturnPost) {
  const {discountId, discountNo, isAlert, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IDiscountModelCommon = {...userParams, discountId};
  const isResult: boolean = yield call(rePostDiscount, model);
  if (isResult) {
    yield put(DiscountActions.returnPostSuccess(discountId));
    const message = AppStrings.Discount.returnPostSuccess.replace(
      '{0}',
      discountNo,
    );
    if (isAlert) yield put(GlobalActions.openErrorInfoModal(message));
    onSagaNavigate(nav);
  }
}

function* handleSetLocalModel({payload}: ISetModel) {
  const {dto, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  let model: IDiscountModel = {STATUS: DiscountStatus.New};
  const currentDate = getCurrentDateToString();
  if (dto) {
    model = {
      ...dto,
      TDATE: formatDate(dto.TDATE, 'date'),
      UPDATEDATE: currentDate,
      UPDATEDBY: userParams.userId ?? 0,
    };
  } else {
    model.OFFICEID = userParams.officeId ?? 0;
    model.REGIONID = userParams.regionId ?? '';
    model.STATUS = DiscountStatus.New;
    model.DEPTID = userParams.deptId ?? 0;
    model.DISCOUNTID = 0;
    model.AMOUNT = 0;
    model.TDATE = currentDate;
    model.UPDATEDBY = userParams.userId ?? 0;
    model.UPDATEDATE = currentDate;
    model.CREATEDBY = userParams.userId ?? 0;
    model.CREATEDATE = currentDate;
    model.DISCOUNTTYPE = 0;
    model.CUSTID = '';
    model.NOTES = '';
    model.UNITID = '';
  }
  console.log({inSaga: model});
  yield put(DiscountActions.updateLocalModel(model));
  onSagaNavigate(nav);
}

// WATCHER
function* watchSearch() {
  yield takeEvery(Types.SEARCH, safe(handleSearch));
}

function* watchCreateOrUpdate() {
  yield takeEvery(Types.CREATE_OR_UPDATE, safe(handleCreateOrUpdate));
}

function* watchDeleteHeader() {
  yield takeEvery(Types.DELETE_HEADER, safe(handleDeleteHeader));
}

function* watchPostDiscount() {
  yield takeEvery(Types.POST, safe(handlePostDiscount));
}

function* watchReturnPostDiscount() {
  yield takeEvery(Types.RETURN_POST, safe(handleReturnPostDiscount));
}

function* watchSetLocalModel() {
  yield takeEvery(Types.SET_MODEL, safe(handleSetLocalModel));
}

export default function* rootDiscountSaga() {
  yield all([
    fork(watchSearch),
    fork(watchCreateOrUpdate),
    fork(watchDeleteHeader),
    fork(watchPostDiscount),
    fork(watchReturnPostDiscount),
    fork(watchSetLocalModel),
  ]);
}
