import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {getUserParams, safe} from '../saga.helpers';
import {Types, ISearch} from './scale.types';
import {search} from '~/apis/scale.service';
import {IUserParams} from '~/commons/types';
import {
  IScaleDetailDTO,
  IScaleFilterModel,
  ScaleStatus,
} from '~/apis/types.service';
import ScaleActions from './scale.actions';

// WORKER
function* workerSearch({payload}: ISearch) {
  const {fromDate, toDate, scaleCode, doCode} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const objFilter: IScaleFilterModel = {
    ...userParams,
    fromDate,
    toDate,
    scaleCode,
    doCode,
    status: ScaleStatus.New,
  };
  const response: IScaleDetailDTO[] = yield call(search, objFilter);
  const doNos: string[] = [...new Set(response.map((item) => item.DONO))];
  yield put(ScaleActions.searchSuccess(response, doNos));
}

// WATCHER
function* watcherSearchSale() {
  yield takeEvery(Types.SCALE_SEARCH, safe(workerSearch));
}

export default function* scaleSaga() {
  yield all([fork(watcherSearchSale)]);
}
