import {IBleDevice} from '~/apis/types.service';
import {IState, SettingActionType, Types} from './setting.types';

const initialState: IState = {
  devices: [],
  bleDevice: undefined,
  rongtaPrinterServices: undefined,
  bleManager: undefined,
  starPrinter: undefined,
  devicesData: [],
};

export default function SettingReducer(
  state = initialState,
  action: SettingActionType,
): IState {
  switch (action.type) {
    case Types.SET_BLUETOOTH_SCALE: {
      const {bleDevice} = action.payload;
      return {...state, bleDevice};
    }
    case Types.ADD_NEW_DEVICE: {
      const {device} = action.payload;
      const {devices} = state;
      if (!device || devices.findIndex((p) => p.deviceId === device.id) > -1)
        return state;
      const newDevice: IBleDevice = {
        deviceId: device.id,
        deviceName: device.name ?? '',
      };
      devices.push(newDevice);
      return {...state, devices};
    }
    case Types.UPDATE_BLUETOOTH_SCALE_DEVICES: {
      const {devices} = action.payload;
      const {bleDevice} = state;
      let selectedDevice: IBleDevice | undefined = bleDevice;
      if (!bleDevice && devices && devices.length > 0) {
        selectedDevice = {...devices[0]};
      } else if (bleDevice) {
        const index = devices.findIndex(
          (p) => p.deviceId === bleDevice.deviceId,
        );
        if (index < 0) {
          selectedDevice =
            devices && devices.length > 0 ? {...devices[0]} : undefined;
        }
      }
      return {...state, devices, bleDevice: selectedDevice};
    }
    case Types.UPDATE_RONGTA_SERVICES: {
      const {services} = action.payload;
      return {...state, rongtaPrinterServices: services};
    }
    case Types.UPDATE_BLUETOOTH_BLE_MANAGER: {
      const {bleManager} = action.payload;
      return {...state, bleManager};
    }
    case Types.SET_CURRENT_STAR_PRINTER: {
      const {starPrinter} = action.payload;
      return {...state, starPrinter};
    }
    case Types.FETCH_DEVICES_FROM_SERVER_SUCCESS: {
      const {devices} = action.payload;
      return {...state, devicesData: devices};
    }
    default: {
      return state;
    }
  }
}
