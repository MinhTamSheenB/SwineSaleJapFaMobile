import {call, takeEvery, fork, all, put} from 'redux-saga/effects';
import {LoginAction, ActionType} from './test.types';
import {testFetchApi} from '~/apis/test.service';
import {IResult} from '~/commons/types';
import {IAnimal} from '~/apis/types.service';
import userAction from './test.action';

function* handleLogin({payload}: LoginAction) {
  const response: IResult<IAnimal> = yield call(testFetchApi);
  if (response) {
    yield put(userAction.loginSuccess(response));
  }
}

function* watchLogin() {
  yield takeEvery(ActionType.LOGIN_REQUEST, handleLogin);
}

export default function* testSaga() {
  yield all([fork(watchLogin)]);
}
