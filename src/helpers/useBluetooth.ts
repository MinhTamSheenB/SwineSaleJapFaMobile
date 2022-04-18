import {useEffect, useRef, useState} from 'react';
import {BleManager, Characteristic, State} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import SoundPlayer from 'react-native-sound-player';
import PermissionHelper from './PermissionHelper';
import {isAndroid} from './UtilitiesHelper';

const SCALE_SERVICE = '6e4';

export const SCALE_CHARACTER = {
  R: 'r', // nhận dữ liệu từ cân trả về.
  F: 'f', // Yêu cầu cân tính trung bình.
};

const playScanMusic = () => {
  try {
    SoundPlayer.playSoundFile('scansound', 'wav');
  } catch (e) {
    console.log(`cannot play the sound file`, e);
  }
};

const useBluetooth = () => {
  const [bluetoothDeviceStatus, setStatus] = useState(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    SoundPlayer.onFinishedLoading((success: boolean) => {
      console.log({success});
    });
  }, []);

  const scaleValueRef = useRef<string>();

  const getBleManager = (): BleManager => {
    const bleManager = new BleManager();
    return bleManager;
  };

  const disconnectDevice = async (deviceId: string, bleManager: BleManager) => {
    const connected = await bleManager.isDeviceConnected(deviceId);
    if (connected) {
      await bleManager.cancelDeviceConnection(deviceId);
    }
  };

  const stopScanDevice = (bleManager: BleManager) => {
    setScanning(false);
    if (bleManager) {
      bleManager.stopDeviceScan();
    }
  };

  const checkBluetoothIsTurnOn = (bleManager: BleManager) => {
    bleManager.onStateChange((state) => {
      setStatus(state === State.PoweredOn);
    }, true);
  };

  const scanDevices = async (
    name: string | undefined,
    funCallback: Function,
    bleManager: BleManager,
    timeout = 30000,
  ) => {
    const isPowerOn = (await bleManager.state()) === State.PoweredOn;
    if (!isPowerOn) {
      if (isAndroid()) {
        await bleManager.enable();
      } else {
        throw console.warn(
          'Bluetooth chưa được bật, vui lòng bật bluetooth trước.',
        );
      }
    }
    setScanning(true);
    if (await PermissionHelper.requestLocation()) {
      setTimeout(() => {
        stopScanDevice(bleManager);
      }, timeout);
      bleManager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          stopScanDevice(bleManager);
          return console.log({error});
        }
        if (device) {
          const deviceName = device.name;
          if (deviceName) {
            if (name && deviceName === name) {
              stopScanDevice(bleManager);
              funCallback(device);
            } else {
              funCallback(device);
            }
          }
        }
      });
    }
  };

  const connectDevice = async (
    deviceId: string,
    bleManager: BleManager,
  ): Promise<boolean> => {
    const connected = await bleManager.isDeviceConnected(deviceId);
    if (!connected) {
      await bleManager.connectToDevice(deviceId);
      await bleManager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
    }
    return true;
  };

  const getAllCharacteristics = async (
    deviceId: string,
    bleManager: BleManager,
  ) => {
    const characteristics: Characteristic[] = [];
    await connectDevice(deviceId, bleManager);
    const services = await bleManager.servicesForDevice(deviceId);
    console.log({Characteristic: services});
    await Promise.all(
      services.map(async (service) => {
        const characteristicsOfService =
          await bleManager.characteristicsForDevice(deviceId, service.uuid);
        characteristicsOfService.forEach((cha: Characteristic) => {
          if (cha.uuid.startsWith(SCALE_SERVICE)) {
            characteristics.push(cha);
          }
        });
      }),
    );
    await disconnectDevice(deviceId, bleManager);
    return characteristics;
  };

  /**
   *
   * @param deviceId
   * @param serviceUUID
   * @param characteristicUUID
   * @param value
   */
  const writeWithOutResponse = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    value: string,
    bleManager: BleManager,
  ): Promise<void> => {
    await connectDevice(deviceId, bleManager);
    scaleValueRef.current = undefined;
    const base64Value = Buffer.from(value).toString('base64');
    await bleManager.writeCharacteristicWithoutResponseForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      base64Value,
    );
  };

  const writeWithResponse = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    value: string,
    bleManager: BleManager,
  ): Promise<void> => {
    try {
      scaleValueRef.current = undefined;
      const base64Value = Buffer.from(value).toString('base64');
      await bleManager.writeCharacteristicWithResponseForDevice(
        deviceId,
        serviceUUID,
        characteristicUUID,
        base64Value,
      );
    } catch (ex) {
      console.log({writeWithResponse: ex});
    }
  };

  /**
   *
   * @param {*} deviceId
   * @param {*} serviceUUID
   * @param {*} characteristicUUID
   * @param {*} funCallback
   */
  const monitoringValueChange = async (
    deviceId,
    serviceUUID,
    characteristicUUID,
    funCallback,
    bleManager: BleManager,
  ) => {
    await connectDevice(deviceId, bleManager);
    bleManager.monitorCharacteristicForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      (error, result) => {
        if (error) {
          console.log('Monitoring Error: ', error);
        } else if (result && result.value) {
          const value = Buffer.from(result.value, 'base64').toString().trim();
          const regex = /[+-]?\d+(\.\d+)?/g;
          const matches = value.match(regex);
          const strValue = matches && matches.length > 0 ? matches[0] : '';

          if (funCallback && scaleValueRef.current !== strValue) {
            scaleValueRef.current = strValue;
            playScanMusic();
            funCallback(strValue);
          }
        }
      },
    );
  };

  const destroyBleManager = (bleManager: BleManager) => {
    bleManager.destroy();
  };

  return {
    getBleManager,
    scanDevices,
    checkBluetoothIsTurnOn,
    stopScanDevice,
    connectDevice,
    disconnectDevice,
    monitoringValueChange,
    getAllCharacteristics,
    writeWithOutResponse,
    writeWithResponse,
    destroyBleManager,
    isConnected,
    bluetoothDeviceStatus,
    scanning,
  };
};

export default useBluetooth;
