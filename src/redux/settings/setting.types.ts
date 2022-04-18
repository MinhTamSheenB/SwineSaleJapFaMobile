import {BleManager, Device} from 'react-native-ble-plx';
import {IDeviceDTO, IDeviceModel} from '~/apis/types.device';
import {IBleDevice} from '~/apis/types.service';
import {IStarDevice} from '~/databases/DatabaseType';
import RongtaPrinterServices from '~/helpers/RongtaPrinterServices';

export interface IState {
  bleDevice?: IBleDevice;
  starPrinter?: IStarDevice;
  devices: IBleDevice[];
  rongtaPrinterServices?: RongtaPrinterServices;
  bleManager?: BleManager;

  devicesData: IDeviceDTO[];
}

export enum Types {
  SET_BLUETOOTH_SCALE = 'SET_BLUETOOTH_SCALE',
  ADD_NEW_DEVICE = 'BLUETOOTH_ADD_NEW_DEVICE',
  UPDATE_BLUETOOTH_SCALE_DEVICES = 'UPDATE_BLUETOOTH_SCALE_DEVICES',

  UPDATE_RONGTA_SERVICES = 'UPDATE_RONGTA_SERVICES',
  UPDATE_BLUETOOTH_BLE_MANAGER = 'UPDATE_BLUETOOTH_BLE_MANAGER',

  SET_CURRENT_STAR_PRINTER = 'SETTING_SET_CURRENT_STAR_PRINTER',

  ADD_NEW_PRINTER_DEVICE = 'SETTING_ADD_NEW_PRINTER_DEVICE',
  ADD_NEW_PRINTER_DEVICE_SUCCESS = 'SETTING_ADD_NEW_PRINTER_DEVICE_SUCCESS',

  DELETE_PRINTER_DEVICE = 'SETTING_DELETE_PRINTER_DEVICE',
  DELETE_PRINTER_DEVICE_SUCCESS = 'SETTING_DELETE_PRINTER_DEVICE_SUCCESS',

  GET_LIST_PRINTER_DEVICE = 'SETTING_GET_LIST_PRINTER_DEVICE',
  GET_LIST_PRINTER_DEVICE_SUCCESS = 'SETTING_GET_LIST_PRINTER_DEVICE_SUCCESS',

  STORE_DEFAULT_PRINTER = 'SETTING_STORE_DEFAULT_PRINTER',
  GET_DEFAULT_PRINTER = 'SETTING_GET_DEFAULT_PRINTER',

  FETCH_DEVICES_FROM_SERVER = 'SETTING_FETCH_DEVICES_FROM_SERVER',
  FETCH_DEVICES_FROM_SERVER_SUCCESS = 'SETTING_FETCH_DEVICES_FROM_SERVER_SUCCESS',

  CREATE_UPDATE_NEW_DEVICE_SERVER = 'SETTING_CREATE_UPDATE_NEW_DEVICE_SERVER',
  DELETE_DEVICE_FROM_SERVER = 'SETTING_DELETE_DEVICE_FROM_SERVER',
  DELETE_DEVICE_FROM_SERVER_SUCCESS = 'SETTING_DELETE_DEVICE_FROM_SERVER_SUCCESS',

  STORE_FCM_TOKEN_TO_LOCAL = 'SETTING_STORE_FCM_TOKEN_TO_LOCAL',
  GET_FCM_TOKEN_FROM_LOCAL = 'SETTING_GET_FCM_TOKEN_FROM_LOCAL',
  DELETE_FCM_TOKEN_FROM_LOCAL = 'SETTING_DELETE_FCM_TOKEN_FROM_LOCAL',

  CONNECT_SCALE_DEVICE = 'SETTING/CONNECT_SCALE_DEVICE',
}

export interface ISetCurrentBluetoothScale {
  type: Types.SET_BLUETOOTH_SCALE;
  payload: {bleDevice: IBleDevice};
}

export interface IAddNewBluetoothDevice {
  type: Types.ADD_NEW_DEVICE;
  payload: {device: Device};
}

export interface IUpdateBluetoothScaleDevices {
  type: Types.UPDATE_BLUETOOTH_SCALE_DEVICES;
  payload: {devices: IBleDevice[]};
}

export interface IUpdateRongtaPrinterService {
  type: Types.UPDATE_RONGTA_SERVICES;
  payload: {services: RongtaPrinterServices};
}

export interface IUpdateBleManager {
  type: Types.UPDATE_BLUETOOTH_BLE_MANAGER;
  payload: {bleManager: BleManager | undefined};
}

export interface ISetCurrentStarPrint {
  type: Types.SET_CURRENT_STAR_PRINTER;
  payload: {starPrinter?: IStarDevice};
}

export interface IAddNewPrinterDevice {
  type: Types.ADD_NEW_PRINTER_DEVICE;
  payload: {device: IStarDevice};
}

export interface IAddNewPrinterDeviceSuccess {
  type: Types.ADD_NEW_PRINTER_DEVICE_SUCCESS;
  payload: {device: IStarDevice};
}

export interface IDeletePrinterDevice {
  type: Types.DELETE_PRINTER_DEVICE;
  payload: {macAddress: string};
}

export interface IDeletePrinterDeviceSuccess {
  type: Types.DELETE_PRINTER_DEVICE_SUCCESS;
  payload: {macAddress: string};
}

export interface IGetListPrinterDevices {
  type: Types.GET_LIST_PRINTER_DEVICE;
  payload: {};
}

export interface IGetListPrinterDevicesSuccess {
  type: Types.GET_LIST_PRINTER_DEVICE_SUCCESS;
  payload: {devices: IStarDevice[]};
}

export interface IStoreDefaultPrinter {
  type: Types.STORE_DEFAULT_PRINTER;
  payload: {device: IStarDevice};
}

export interface IGetDefaultPrinter {
  type: Types.GET_DEFAULT_PRINTER;
  payload: {};
}

export interface IFetchDevicesFromServer {
  type: Types.FETCH_DEVICES_FROM_SERVER;
  payload: {macAddress?: string};
}

export interface IFetchDevicesFromServerSuccess {
  type: Types.FETCH_DEVICES_FROM_SERVER_SUCCESS;
  payload: {devices: IDeviceDTO[]};
}

export interface ICreateUpdateDeviceServer {
  type: Types.CREATE_UPDATE_NEW_DEVICE_SERVER;
  payload: {model: IDeviceModel};
}

export interface IDeleteDeviceFromServer {
  type: Types.DELETE_DEVICE_FROM_SERVER;
  payload: {autoId: number};
}

export interface IDeleteDeviceFromServerSuccess {
  type: Types.DELETE_DEVICE_FROM_SERVER_SUCCESS;
  payload: {autoId: number};
}

export interface IStoreFcmTokenToLocal {
  type: Types.STORE_FCM_TOKEN_TO_LOCAL;
  payload: {};
}

export interface IDeleteFcmTokenFromLocal {
  type: Types.DELETE_FCM_TOKEN_FROM_LOCAL;
  payload: {};
}

export type SettingActionType =
  | ISetCurrentBluetoothScale
  | IAddNewBluetoothDevice
  | IUpdateBluetoothScaleDevices
  | IUpdateRongtaPrinterService
  | IUpdateBleManager
  | ISetCurrentStarPrint
  | IAddNewPrinterDeviceSuccess
  | IDeletePrinterDeviceSuccess
  | IGetListPrinterDevicesSuccess
  | IFetchDevicesFromServerSuccess
  | IDeleteDeviceFromServerSuccess;
