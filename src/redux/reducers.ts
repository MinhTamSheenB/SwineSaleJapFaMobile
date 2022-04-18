import {combineReducers} from 'redux';
import {reducer as network} from 'react-native-offline';
import test from './test/test-reducer';
import so from './so/so.reducers';
import global from './global/global.reducers';
import master from './master/master.reducers';
import dos from './do/do.reducers';
import invoice from './invoice/invoice.reducers';
import scale from './scale/scale.reducers';
import discount from './discount/discount.reducers';
import cndn from './cndn/cndn.reducers';
import credit from './credit/credit.reducers';
import setting from './settings/setting.reducers';
import wGoods from './weighingGoods/weighing.goods.reducers';
import {Types} from './global/global.types';
import scaleNoteDown from './scaleNoteDown/scale.note.down.reducers';
import monitoring from './monitoring/monitoring.reducers';

const appReducer = combineReducers({
  test,
  global,
  so,
  dos,
  master,
  invoice,
  scale,
  discount,
  cndn,
  credit,
  setting,
  wGoods,
  network,
  scaleNoteDown,
  monitoring,
});

const rootReducer = (state, action) => {
  if (action.type === Types.GLOBAL_RESET_APP_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
