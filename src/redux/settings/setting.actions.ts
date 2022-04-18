import {BleManager, Device} from 'react-native-ble-plx';
import {IDeviceDTO, IDeviceModel} from '~/apis/types.device';
import {IBleDevice} from '~/apis/types.service';
import {IStarDevice} from '~/databases/DatabaseType';
import RongtaPrinterServices from '~/helpers/RongtaPrinterServices';
import {
  IAddNewBluetoothDevice,
  IAddNewPrinterDevice,
  IAddNewPrinterDeviceSuccess,
  IConnectScaleDevice,
  ICreateUpdateDeviceServer,
  IDeleteDeviceFromServer,
  IDeleteDeviceFromServerSuccess,
  IDeleteFcmTokenFromLocal,
  IDeletePrinterDevice,
  IDeletePrinterDeviceSuccess,
  IFetchDevicesFromServer,
  IFetchDevicesFromServerSuccess,
  IGetDefaultPrinter,
  ISetCurrentBluetoothScale,
  ISetCurrentStarPrint,
  IStoreDefaultPrinter,
  IStoreFcmTokenToLocal,
  IUpdateBleManager,
  IUpdateBluetoothScaleDevices,
  IUpdateRongtaPrinterService,
  Types,
} from './setting.types';

const SettingActions = {
  setBluetoothScaleDevice: (
    bleDevice: IBleDevice,
  ): ISetCurrentBluetoothScale => ({
    type: Types.SET_BLUETOOTH_SCALE,
    payload: {bleDevice},
  }),
  addNewDevice: (device: Device): IAddNewBluetoothDevice => ({
    type: Types.ADD_NEW_DEVICE,
    payload: {device},
  }),
  updateBluetoothScaleDevices: (
    devices: IBleDevice[],
  ): IUpdateBluetoothScaleDevices => ({
    type: Types.UPDATE_BLUETOOTH_SCALE_DEVICES,
    payload: {devices},
  }),
  updateRongtaPrintService: (
    services: RongtaPrinterServices,
  ): IUpdateRongtaPrinterService => ({
    type: Types.UPDATE_RONGTA_SERVICES,
    payload: {services},
  }),
  updateBleManager: (bleManager?: BleManager): IUpdateBleManager => ({
    type: Types.UPDATE_BLUETOOTH_BLE_MANAGER,
    payload: {bleManager},
  }),
  setStarPrinter: (device?: IStarDevice): ISetCurrentStarPrint => ({
    type: Types.SET_CURRENT_STAR_PRINTER,
    payload: {starPrinter: device},
  }),

  addPrinterDevice: (device: IStarDevice): IAddNewPrinterDevice => ({
    type: Types.ADD_NEW_PRINTER_DEVICE,
    payload: {device},
  }),
  addPrinterDeviceSuccess: (
    device: IStarDevice,
  ): IAddNewPrinterDeviceSuccess => ({
    type: Types.ADD_NEW_PRINTER_DEVICE_SUCCESS,
    payload: {device},
  }),
  deletePrinterDevice: (macAddress: string): IDeletePrinterDevice => ({
    type: Types.DELETE_PRINTER_DEVICE,
    payload: {macAddress},
  }),
  deletePrinterDeviceSuccess: (
    macAddress: string,
  ): IDeletePrinterDeviceSuccess => ({
    type: Types.DELETE_PRINTER_DEVICE_SUCCESS,
    payload: {macAddress},
  }),
  storeDefaultPrinter: (device: IStarDevice): IStoreDefaultPrinter => ({
    type: Types.STORE_DEFAULT_PRINTER,
    payload: {device},
  }),
  getDefaultPrinter: (): IGetDefaultPrinter => ({
    type: Types.GET_DEFAULT_PRINTER,
    payload: {},
  }),
  fetchDevicesFromServer: (macAddress?: string): IFetchDevicesFromServer => ({
    type: Types.FETCH_DEVICES_FROM_SERVER,
    payload: {macAddress},
  }),
  fetchDevicesFromServerSuccess: (
    devices: IDeviceDTO[],
  ): IFetchDevicesFromServerSuccess => ({
    type: Types.FETCH_DEVICES_FROM_SERVER_SUCCESS,
    payload: {devices},
  }),
  createUpdateDeviceServer: (
    model: IDeviceModel,
  ): ICreateUpdateDeviceServer => ({
    type: Types.CREATE_UPDATE_NEW_DEVICE_SERVER,
    payload: {model},
  }),
  deleteDeviceServer: (autoId: number): IDeleteDeviceFromServer => ({
    type: Types.DELETE_DEVICE_FROM_SERVER,
    payload: {autoId},
  }),
  deleteDeviceServerSuccess: (
    autoId: number,
  ): IDeleteDeviceFromServerSuccess => ({
    type: Types.DELETE_DEVICE_FROM_SERVER_SUCCESS,
    payload: {autoId},
  }),
  storeFcmToken: (): IStoreFcmTokenToLocal => ({
    type: Types.STORE_FCM_TOKEN_TO_LOCAL,
    payload: {},
  }),
  removeFcmToken: (): IDeleteFcmTokenFromLocal => ({
    type: Types.DELETE_FCM_TOKEN_FROM_LOCAL,
    payload: {},
  }),
  connectScaleDevice: (device: IDeviceDTO): IConnectScaleDevice => ({
    type: Types.CONNECT_SCALE_DEVICE,
    payload: {device},
  }),
};

export default SettingActions;
