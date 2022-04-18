import {
  all,
  call,
  fork,
  put,
  takeEvery,
  select,
  takeLatest,
  cancel,
} from 'redux-saga/effects';
import messaging from '@react-native-firebase/messaging';
import {getUserParams, safe} from '../saga.helpers';
import {
  IConnectScaleDevice,
  ICreateUpdateDeviceServer,
  IDeleteDeviceFromServer,
  IFetchDevicesFromServer,
  IGetDefaultPrinter,
  IStoreDefaultPrinter,
  IStoreFcmTokenToLocal,
  Types,
} from './setting.types';
import {bluetoothPrinterDatabase} from '~/databases/BluetoothPrinterDatabase';
import SettingActions from './setting.actions';
import {IStarDevice} from '~/databases/DatabaseType';
import {IDeviceDTO} from '~/apis/types.device';
import {
  search,
  deleteDevice,
  createDevice,
  updateDevice,
} from '~/apis/device.services';
import {IUserParams} from '~/commons/types';
import GlobalActions from '../global/global.actions';
import {getFcmToken, storeFcmToken} from '~/helpers/AsyncStorageHelpers';
import { IBleDevice } from '~/apis/types.service';
import useBluetooth from '~/helpers/useBluetooth';

// WORKER
function* storeDefaultPrinter({payload}: IStoreDefaultPrinter) {
  const {device} = payload;
  const isResult = yield call(bluetoothPrinterDatabase.addNewDevice, device);
  if (isResult) {
    yield call(bluetoothPrinterDatabase.setDefault, device.macAddress);
    yield put(SettingActions.setStarPrinter(device));
  }
}

function* getDefaultPrinter({payload}: IGetDefaultPrinter) {
  const {} = payload;
  const device: IStarDevice | undefined = yield call(
    bluetoothPrinterDatabase.getDefaultPrinter,
  );
  yield put(SettingActions.setStarPrinter(device));
}

function* fetchDevicesFromServer({payload}: IFetchDevicesFromServer) {
  const {macAddress} = payload;
  let devices: IDeviceDTO[] = yield call(search, macAddress);
  devices = devices.filter((p) => p.STATUS === 1); // 1: Chưa xóa, 0: đã xóa.
  yield put(SettingActions.fetchDevicesFromServerSuccess(devices));
}

function* deleteDeviceFromServer({payload}: IDeleteDeviceFromServer) {
  const {autoId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const isResult: boolean = yield call(deleteDevice, autoId, userParams.userId);
  if (isResult) {
    yield put(
      GlobalActions.openErrorInfoModal('Xóa thiết bị thành công', 'INFO'),
    );
    yield put(SettingActions.fetchDevicesFromServer());
  }
}

function* handleCreateUpdateNewDeviceFromServer({
  payload,
}: ICreateUpdateDeviceServer) {
  const {model} = payload;
  let autoId = model.AUTOID;
  let isSuccess = false;
  if (autoId < 1) {
    autoId = yield call(createDevice, model);
    isSuccess = autoId > 0;
  } else {
    isSuccess = yield call(updateDevice, model);
  }

  if (isSuccess) {
    yield put(
      GlobalActions.openErrorInfoModal('Lưu thông tin thiết bị thành công'),
    );
    yield put(SettingActions.fetchDevicesFromServer());
  }
}

function* handleStoreFcmToken({payload}: IStoreFcmTokenToLocal) {
  const {} = payload;
  let fcmToken = yield getFcmToken();
  if (!fcmToken) {
    const authStatus = yield messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      fcmToken = yield messaging().getToken();
      yield storeFcmToken(fcmToken);
    }
  }
  console.log({fcmToken});
}

// WATCHER
function* watchStoreDefaultPrinter() {
  yield takeEvery(Types.STORE_DEFAULT_PRINTER, safe(storeDefaultPrinter));
}

function* watchGetDefaultPrinter() {
  yield takeEvery(Types.GET_DEFAULT_PRINTER, safe(getDefaultPrinter));
}

function* watchFetchDevicesFromServer() {
  yield takeEvery(
    Types.FETCH_DEVICES_FROM_SERVER,
    safe(fetchDevicesFromServer),
  );
}

function* watchDeleteDeviceFromServer() {
  yield takeEvery(
    Types.DELETE_DEVICE_FROM_SERVER,
    safe(deleteDeviceFromServer),
  );
}

function* watchCreateUpdateDeviceFromServer() {
  yield takeEvery(
    Types.CREATE_UPDATE_NEW_DEVICE_SERVER,
    safe(handleCreateUpdateNewDeviceFromServer),
  );
}

function* watchStoreFcmToken() {
  yield takeEvery(Types.STORE_FCM_TOKEN_TO_LOCAL, safe(handleStoreFcmToken));
}

export default function* scaleSaga() {
  yield all([
    fork(watchStoreDefaultPrinter),
    fork(watchGetDefaultPrinter),
    fork(watchFetchDevicesFromServer),
    fork(watchDeleteDeviceFromServer),
    fork(watchCreateUpdateDeviceFromServer),
    fork(watchStoreFcmToken),
  ]);
}
