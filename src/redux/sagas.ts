import {all, fork} from 'redux-saga/effects';
import {networkSaga} from 'react-native-offline';
import testSaga from './test/test-saga';
import soSagas from './so/so.sagas';
import masterSagas from './master/master.sagas';
import doSagas from './do/do.sagas';
import invoiceSagas from './invoice/invoice.sagas';
import scaleSagas from './scale/scale.sagas';
import discountSagas from './discount/discount.sagas';
import cndnSagas from './cndn/cndn.sagas';
import creditSagas from './credit/credit.sagas';
import wGoodsSagas from './weighingGoods/weighing.goods.sagas';
import settingSagas from './settings/setting.sagas';
import globalSaga from './global/global.saga';
import scaleNoteDown from './scaleNoteDown/scale.note.down.sagas';
import monitoringSaga from './monitoring/monitoring.sagas';

export default function* rootSaga() {
  yield all([
    fork(testSaga),
    fork(masterSagas),
    fork(soSagas),
    fork(doSagas),
    fork(invoiceSagas),
    fork(scaleSagas),
    fork(discountSagas),
    fork(cndnSagas),
    fork(creditSagas),
    fork(wGoodsSagas),
    fork(settingSagas),
    fork(globalSaga),
    fork(networkSaga),
    fork(scaleNoteDown),
    fork(monitoringSaga),
  ]);
}
