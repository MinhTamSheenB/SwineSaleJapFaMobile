/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {Characteristic, Device} from 'react-native-ble-plx';
import {useDispatch, useSelector} from 'react-redux';
import {SkypeIndicator} from 'react-native-indicators';
import {IBleDevice} from '~/apis/types.service';
import {
  Button,
  Icon,
  InputWithoutFormik,
  ModalBottom,
  NotFound,
  SafeView,
  TextCustom,
} from '~/components/commons';
import {
  Column,
  ConfirmModal,
  Container,
  Header,
  Row,
} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {
  getBluetoothDevices,
  remoteBluetoothDevice,
  storeBluetoothDevice,
} from '~/helpers/AsyncStorageHelpers';
import useBluetooth from '~/helpers/useBluetooth';
import {RootState} from '~/redux/reducers';
import SettingActions from '~/redux/settings/setting.actions';
import {ScaleBluetoothItem} from '~/containers/settings';
import icons from '~/assets/icons';
import {IStarDevice} from '~/databases/DatabaseType';
import RongtaPrinterServices from '~/helpers/RongtaPrinterServices';
import {bluetoothPrinterDatabase} from '~/databases/BluetoothPrinterDatabase';
import imgs from '~/assets/imgs';
import {isAndroid, scaleFactor} from '~/helpers/UtilitiesHelper';
import GlobalActions from '~/redux/global/global.actions';

const BluetoothDevicesScreen = () => {
  const dispatch = useDispatch();
  const {bleManager, starPrinter, rongtaPrinterServices} = useSelector(
    (state: RootState) => state.setting,
  );
  const {
    getBleManager,
    scanDevices,
    scanning,
    connectDevice,
    getAllCharacteristics,
    stopScanDevice,
  } = useBluetooth();
  const {devices} = useSelector((state: RootState) => state.setting);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [currentDevice, setCurrentDevice] = useState<IBleDevice | undefined>();
  const [scaleIdConnected, setScaleIdConnected] = useState<
    string | undefined
  >();

  const [starDevices, setStarDevices] = useState<IStarDevice[]>([]);
  const [defaultPrinter, setDefaultPrinter] = useState<IStarDevice>();
  const [isVisibleDefault, setIsVisibleDefault] = useState<boolean>(false);
  const [isPrinterConnected, setPrinterConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!bleManager) {
      const ble = getBleManager();
      dispatch(SettingActions.updateBleManager(ble));
    }
  }, [bleManager, dispatch, getBleManager]);

  const getBleDevicesFromAsyncStorage = useCallback(async () => {
    const devicesStored: IBleDevice[] = await getBluetoothDevices();
    dispatch(SettingActions.updateBluetoothScaleDevices(devicesStored));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBleDevicesFromAsyncStorage();
  }, [getBleDevicesFromAsyncStorage]);

  useEffect(() => {
    dispatch(SettingActions.getDefaultPrinter());
  }, [dispatch]);

  const handleOnDeviceChangeStatus = useCallback(
    (event) => {
      const isConnectStatus = event.status === 'Connected';
      if (isConnectStatus) {
        setPrinterConnected(isConnectStatus);
      } else {
        dispatch(
          GlobalActions.openErrorInfoModal(
            'Không thể kết nối máy in. Vui lòng tắt/ mở lại bluetooth và kết nối lại.',
            'ERROR',
          ),
        );
      }
    },
    [dispatch],
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'onDeviceChangeStatus',
      handleOnDeviceChangeStatus,
    );
  }, [handleOnDeviceChangeStatus]);

  const scanDeviceCallback = (device: Device) => {
    dispatch(SettingActions.addNewDevice(device));
  };

  const getService = async (device: IBleDevice) => {
    await stopScanDevice(bleManager!);
    setCurrentDevice(device);
    setIsOpenModal(true);
  };

  const scanOrStopDevices = () => {
    if (!scanning) {
      scanDevices(undefined, scanDeviceCallback, bleManager!);
    } else {
      stopScanDevice(bleManager!);
    }
  };

  const onSaveBluetoothDevice = async () => {
    if (!currentDevice) return;
    if (
      !currentDevice.monitoringCharacteristicUUID ||
      !currentDevice.writeCharacteristicUUID
    ) {
      const services = await getAllCharacteristics(
        currentDevice.deviceId,
        bleManager!,
      );
      const monitoring: Characteristic | undefined = services?.find(
        (p) => p.isNotifiable,
      );
      const write: Characteristic | undefined = services?.find(
        (p) => p.isWritableWithResponse || p.isWritableWithoutResponse,
      );
      if (monitoring) {
        currentDevice.serviceUUID = monitoring.serviceUUID;
        currentDevice.monitoringCharacteristicUUID = monitoring.uuid;
      }
      if (write) {
        currentDevice.serviceUUID = write.serviceUUID;
        currentDevice.writeCharacteristicUUID = write.uuid;
      }
    }
    await storeBluetoothDevice(currentDevice);
    const storedDevices = await getBluetoothDevices();
    dispatch(SettingActions.updateBluetoothScaleDevices(storedDevices));
    setIsOpenModal(false);
    setCurrentDevice(undefined);
  };

  const onRemoveBluetoothDevice = async () => {
    if (currentDevice) {
      const newDevices = await remoteBluetoothDevice(currentDevice?.deviceId);
      dispatch(SettingActions.updateBluetoothScaleDevices(newDevices));
    }
    setIsConfirm(false);
  };

  const handleConnectDevice = async (item: IBleDevice) => {
    dispatch(SettingActions.setBluetoothScaleDevice(item));
    const isConnected = await connectDevice(item.deviceId, bleManager!);
    setScaleIdConnected(isConnected ? item.deviceId : undefined);
  };

  const handleScanPrinter = useCallback(async () => {
    if (isAndroid()) {
      const storedDevices = await bluetoothPrinterDatabase.getList();
      const rtServices = rongtaPrinterServices ?? new RongtaPrinterServices('');
      dispatch(SettingActions.updateRongtaPrintService(rtServices));
      const devices1 = await rtServices.scanDevices();
      const diffDevices = devices1.filter((d) => {
        return !storedDevices.some((d1) => {
          return d.macAddress === d1.macAddress;
        });
      });
      const result = storedDevices.concat(diffDevices);
      setStarDevices(result);
    }
  }, [dispatch, rongtaPrinterServices]);

  useEffect(() => {
    handleScanPrinter();
  }, [handleScanPrinter]);

  const handleSetDefaultPrinter = (printerType: 'STAR' | 'RONGTA') => {
    if (defaultPrinter) {
      dispatch(
        SettingActions.storeDefaultPrinter({
          ...defaultPrinter,
          type: printerType,
        }),
      );
      setIsVisibleDefault(false);
    }
  };

  const handleConnectPrinter = async (device: IStarDevice) => {
    await rongtaPrinterServices?.connectRongtaPrinter(device.macAddress);
  };

  return (
    <SafeView>
      <Header title="Danh Sách Thiết Bị Bluetooth" noShadow isMenu />
      <>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 5,
              paddingBottom: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: Colors.BORDER_DARK,
              marginTop: 20,
              marginHorizontal: 20,
              backgroundColor: Colors.WHITE,
              paddingHorizontal: 10,
            }}>
            <TextCustom
              style={{fontSize: 16, fontWeight: 'bold', paddingVertical: 5}}>
              Cài đặt thiết bị cân
            </TextCustom>
            <Pressable
              onPress={scanOrStopDevices}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 5,
              }}>
              {!scanning && (
                <Icon
                  name="reload1"
                  type="AntDesign"
                  style={{fontSize: 20, color: Colors.BLACK}}
                />
              )}
              {scanning && <SkypeIndicator color={Colors.ORIGIN} size={25} />}
            </Pressable>
          </View>
          <FlatList
            data={devices}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={({item}) => (
              <ScaleBluetoothItem
                item={item}
                isConnected={scaleIdConnected === item.deviceId}
                onConnect={() => handleConnectDevice(item)}
                onPress={() => getService(item)}
                onLongPress={() => {
                  setIsConfirm(true);
                  setCurrentDevice(item);
                }}
              />
            )}
            ListEmptyComponent={<NotFound style={{marginTop: 10}} />}
          />
        </View>

        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 5,
              paddingBottom: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: Colors.BORDER_DARK,
              marginTop: 20,
              marginHorizontal: 20,
              backgroundColor: Colors.WHITE,
              paddingHorizontal: 10,
              marginBottom: 5,
            }}>
            <TextCustom
              style={{fontSize: 16, fontWeight: 'bold', paddingVertical: 5}}>
              Cài đặt máy in
            </TextCustom>
            <Pressable
              onPress={handleScanPrinter}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 5,
              }}>
              {!scanning && (
                <Icon
                  name="reload1"
                  type="AntDesign"
                  style={{fontSize: 20, color: Colors.BLACK}}
                />
              )}
              {scanning && <SkypeIndicator color={Colors.ORIGIN} size={25} />}
            </Pressable>
          </View>

          <FlatList
            data={starDevices}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={({item}: {item: IStarDevice}) => (
              <View style={styles.printContainer}>
                <View>
                  <Image
                    source={icons.escPrinter}
                    style={{width: 100, height: 100}}
                  />
                </View>
                <Text style={{color: 'green'}}>{item.portName}</Text>
                <Text>{item.macAddress}</Text>
                {starPrinter?.macAddress !== item.macAddress && (
                  <TouchableOpacity
                    onPress={() => {
                      setDefaultPrinter(item);
                      setIsVisibleDefault(true);
                    }}>
                    <View
                      style={[
                        styles.btnConnect,
                        {
                          backgroundColor: Colors.GRAY,
                        },
                      ]}>
                      <TextCustom style={styles.textConnect}>
                        Đặt làm mặt định
                      </TextCustom>
                      <Icon
                        style={styles.iconConnect}
                        type="AntDesign"
                        name="right"
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {starPrinter && starPrinter.macAddress === item.macAddress && (
                  <TouchableOpacity onPress={() => handleConnectPrinter(item)}>
                    <View
                      style={[
                        styles.btnConnect,
                        {
                          backgroundColor: isPrinterConnected
                            ? Colors.ORIGIN
                            : Colors.GRAY,
                        },
                      ]}>
                      <TextCustom style={styles.textConnect}>
                        {isPrinterConnected ? 'Đã kết nối' : 'Kết nối'}
                      </TextCustom>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={<NotFound />}
          />
        </View>
      </>
      <ModalBottom
        isVisible={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Thiết bị bluetooth">
        <Container isIncludeScrollView>
          <Row>
            <InputWithoutFormik
              label="Tên thiết bị"
              value={currentDevice?.deviceName}
              readonly
            />
          </Row>
          <Row>
            <InputWithoutFormik
              label="Địa chỉ mac"
              value={currentDevice?.deviceId}
              readonly
            />
          </Row>
          <Row>
            <InputWithoutFormik
              label="Tên gợi ý"
              value={currentDevice?.localName}
              isNumber={false}
              onValueChange={(str) => {
                if (currentDevice) {
                  const obj = {...currentDevice, localName: str.toString()};
                  setCurrentDevice(obj);
                }
              }}
            />
          </Row>
          <Row>
            <Button
              iconLeft={{type: 'AntDesign', name: 'save'}}
              title="Lưu Thiết Bị"
              color={Colors.WHITE}
              radius={20}
              onPress={() => onSaveBluetoothDevice()}
            />
          </Row>
        </Container>
      </ModalBottom>

      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => {
          setIsConfirm(false);
          setCurrentDevice(undefined);
        }}
        onAccept={onRemoveBluetoothDevice}
      />

      <ModalBottom
        isVisible={isVisibleDefault}
        style={{minHeight: scaleFactor(180)}}
        title="Chọn dòng máy in"
        onClose={() => {
          setDefaultPrinter(undefined);
          setIsVisibleDefault(false);
        }}>
        <Row>
          <Column>
            <Pressable
              style={styles.btnPrinter}
              onPress={() => handleSetDefaultPrinter('RONGTA')}>
              <Image source={imgs.rongtaLogo} resizeMode="cover" />
            </Pressable>
          </Column>
          <Column>
            <Pressable
              style={styles.btnPrinter}
              onPress={() => handleSetDefaultPrinter('STAR')}>
              <Image
                source={imgs.starLogo}
                style={{width: '90%'}}
                resizeMode="cover"
              />
            </Pressable>
          </Column>
        </Row>
      </ModalBottom>
    </SafeView>
  );
};

export default BluetoothDevicesScreen;
const styles = StyleSheet.create({
  container: {marginBottom: 20, backgroundColor: Colors.WHITE, elevation: 1},
  deviceContainer: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.GRAY_LIGHT,
  },
  deviceHeader: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceTitle: {},
  scanDevice: {
    height: 50,
    backgroundColor: Colors.ORIGIN,
  },
  btnSearchDeviceContainer: {
    flexDirection: 'row',
    backgroundColor: '#2891CA',
    paddingVertical: 20,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  btnSearchDevice: {
    color: Colors.WHITE,
    marginLeft: 10,
    textTransform: 'capitalize',
  },

  btnConnect: {
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.WHITE,
    backgroundColor: Colors.ORIGIN,
    elevation: 1,
  },
  textConnect: {
    fontSize: Sizes.Content,
    color: Colors.WHITE,
  },
  iconConnect: {
    fontSize: Sizes.IconSub,
    color: Colors.WHITE,
  },
  btnPrinter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.4,
    paddingVertical: 5,
    borderRadius: 10,
  },
  printContainer: {
    width: 200,
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: Colors.GRAY_LIGHT,
    marginVertical: 10,
    borderRadius: 5,
    marginRight: 10,
    position: 'relative',
  },
});
