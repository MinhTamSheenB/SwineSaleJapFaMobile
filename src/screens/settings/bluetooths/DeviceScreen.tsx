/* eslint-disable @typescript-eslint/no-use-before-define */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {Characteristic, Device} from 'react-native-ble-plx';
import {SkypeIndicator} from 'react-native-indicators';
import icons from '~/assets/icons';
import {
  CircleButton,
  Dropdown,
  FlatListCommon,
  Icon,
  Input,
  ModalBottom,
  NotFound,
  SafeView,
  TextCustom,
  Button,
} from '~/components/commons';
import {Column, ConfirmModal, Header, Row} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {DeviceItem, ScaleBluetoothItem} from '~/containers/settings';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import SettingActions from '~/redux/settings/setting.actions';
import {DeviceType, IDeviceDTO, IDeviceModel} from '~/apis/types.device';
import RongtaPrinterServices from '~/helpers/RongtaPrinterServices';
import GlobalActions from '~/redux/global/global.actions';
import {IStarDevice} from '~/databases/DatabaseType';
import useBluetooth from '~/helpers/useBluetooth';
import {IBleDevice} from '~/apis/types.service';
import {isAndroid, removeUnicode} from '~/helpers/UtilitiesHelper';
import {DropdownItemType} from '~/commons/types';

const Tab = createMaterialTopTabNavigator();

const CONNECT_RONGTA_PRINTER = 'CONNECT_RONGTA_PRINTER';

interface IFarm {
  id: string;
  name: string;
}

const DeviceScreen = () => {
  const dispatch = useDispatch();

  const {
    getBleManager,
    scanDevices,
    scanning,
    connectDevice,
    getAllCharacteristics,
    stopScanDevice,
  } = useBluetooth();

  const {userParams} = useSelector((state: RootState) => state.global);
  const {saleLocations} = useSelector((state: RootState) => state.master);
  const {devicesData} = useSelector((state: RootState) => state.setting);

  const {devices, bleManager, starPrinter, rongtaPrinterServices} = useSelector(
    (state: RootState) => state.setting,
  );

  const [locationDropDownData, setLocationDropDownData] = useState<
    DropdownItemType[]
  >([]);

  const [locationId, setLocationId] = useState<string>('');
  const [scaleDevices, setScaleDevices] = useState<IDeviceDTO[]>();
  const [bluetoothDevices, setBluetoothDevices] = useState<IDeviceDTO[]>();

  const [printerDevice, setPrinterDevice] = useState<IDeviceDTO>();
  const [isPrinterConnected, setPrinterConnected] = useState<boolean>(false);

  const [farm] = useState<IFarm>({id: '', name: ''});
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const [isOpenScaleModal, setIsOpenScaleModal] = useState<boolean>(false);

  // Máy in
  const [createUpdateModel, setCreateUpdateModel] = useState<boolean>(false);
  const [isOpenPrinterModal, setIsOpenPrinterModal] = useState<boolean>(false);
  const [starDevices, setStarDevices] = useState<IStarDevice[]>([]);
  const [deviceModel, setDeviceModel] = useState<IDeviceModel>(() => {
    const device: IDeviceModel = {
      AUTOID: 0,
      Type: 0,
      DeviceName: '',
      Characteristics: '',
      STATUS: 1,
      Enabled: 1,
    };
    return device;
  });

  const [scaleIdConnected, setScaleIdConnected] = useState<string>();

  const [valueTest, setValueTest] = useState<string>();

  useEffect(() => {
    const data: DropdownItemType[] = saleLocations.map((item) => {
      const newItem: DropdownItemType = {
        label: item.LOCATIONNAME ?? '',
        value: item.LOCATIONID ?? '',
        keySearch: removeUnicode(`${item.LOCATIONID} ${item.LOCATIONNAME}`),
      };
      return newItem;
    });
    setLocationDropDownData(data);
  }, [saleLocations]);

  useEffect(() => {
    if (!rongtaPrinterServices && isAndroid()) {
      const rtServices = new RongtaPrinterServices('');
      dispatch(SettingActions.updateRongtaPrintService(rtServices));
    }
  }, [dispatch, rongtaPrinterServices]);

  const handleDataChange = useCallback(() => {
    let dataTemps: IDeviceDTO[] = devicesData;
    if (locationId != null && locationId !== undefined && locationId !== '')
      dataTemps = dataTemps.filter((p) => p.FarmId === locationId);
    const temps = dataTemps.filter((p) => p.Type === DeviceType.SCALE);
    setScaleDevices(temps);
    const blues = dataTemps.filter((p) => p.Type === DeviceType.PRINTER);
    setBluetoothDevices(blues);
  }, [devicesData, locationId]);

  useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  useEffect(() => {
    dispatch(MasterActions.getSaleLocation());
  }, [dispatch]);

  useEffect(() => {
    dispatch(SettingActions.fetchDevicesFromServer());
  }, [dispatch]);

  const handleConnectPrinter = async (device: IDeviceDTO) => {
    await dispatch(GlobalActions.openLoadingModal(CONNECT_RONGTA_PRINTER));
    setPrinterDevice(device);
    setPrinterConnected(false);
    if (device.MacAddress)
      await rongtaPrinterServices?.connectRongtaPrinter(device.MacAddress);
  };

  // #region Lắng nghe connect từ máy in
  const handleOnDeviceChangeStatus = useCallback(
    (event) => {
      const isConnectStatus = event.status === 'Connected';
      if (isConnectStatus) {
        setPrinterConnected(isConnectStatus);
        if (printerDevice) {
          const starDevice: IStarDevice = {
            macAddress: printerDevice?.MacAddress ?? '',
            isDefault: true,
            type: 'RONGTA',
            moduleName: printerDevice?.DeviceName,
            remindName: printerDevice?.DeviceName,
            portName: printerDevice.DeviceName ?? '',
          };
          dispatch(SettingActions.setStarPrinter(starDevice));
        }
      } else {
        dispatch(
          GlobalActions.openErrorInfoModal(
            'Không thể kết nối máy in. Vui lòng tắt/ mở lại bluetooth và kết nối lại.',
            'ERROR',
          ),
        );
      }
      dispatch(GlobalActions.closeLoadingModal(CONNECT_RONGTA_PRINTER));
    },
    [dispatch, printerDevice],
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'onDeviceChangeStatus',
      handleOnDeviceChangeStatus,
    );
  }, [handleOnDeviceChangeStatus]);
  // #endregion

  // #region Begin BLE
  const scanDeviceCallback = (device: Device) => {
    dispatch(SettingActions.addNewDevice(device));
  };

  const scanOrStopDevices = () => {
    if (!scanning) {
      scanDevices(undefined, scanDeviceCallback, bleManager!);
    } else {
      stopScanDevice(bleManager!);
    }
  };

  useEffect(() => {
    if (!bleManager) {
      const ble = getBleManager();
      dispatch(SettingActions.updateBleManager(ble));
    }
  }, [bleManager, dispatch, getBleManager]);

  const onSaveBluetoothDevice = async (currentDevice: IDeviceModel) => {
    try {
      setValueTest('');
      if (!currentDevice) return;

      if (currentDevice.Characteristics) {
        const strJson = JSON.stringify(currentDevice);
        setValueTest(strJson);
        dispatch(SettingActions.createUpdateDeviceServer(currentDevice));
        return;
      }

      if (!currentDevice.MacAddress) return;

      const services = await getAllCharacteristics(
        currentDevice.MacAddress,
        bleManager!,
      );

      const monitoring: Characteristic | undefined = services?.find(
        (p) => p.isNotifiable,
      );
      const write: Characteristic | undefined = services?.find(
        (p) => p.isWritableWithResponse || p.isWritableWithoutResponse,
      );

      const newDevice: IBleDevice = {
        deviceId: currentDevice.MacAddress,
        deviceName: currentDevice.DeviceName ?? '',
        localName: currentDevice.DeviceName ?? '',
      };

      if (monitoring) {
        newDevice.serviceUUID = monitoring.serviceUUID;
        newDevice.monitoringCharacteristicUUID = monitoring.uuid;
      }
      if (write) {
        newDevice.serviceUUID = write.serviceUUID;
        newDevice.writeCharacteristicUUID = write.uuid;
      }

      const tempModel: IDeviceModel = {...currentDevice};
      tempModel.Characteristics = JSON.stringify(newDevice);
      const jSonTest = JSON.stringify(tempModel);
      setValueTest(jSonTest);
      dispatch(SettingActions.createUpdateDeviceServer(tempModel));
    } catch (er) {
      dispatch(GlobalActions.openErrorInfoModal(`${er}`, 'ERROR'));
    }
  };

  const handleScanPrinter = useCallback(async () => {
    if (isAndroid() && isOpenPrinterModal) {
      const result = await rongtaPrinterServices?.scanDevices();
      setStarDevices(result ?? []);
    }
  }, [isOpenPrinterModal, rongtaPrinterServices]);

  useEffect(() => {
    handleScanPrinter();
  }, [handleScanPrinter]);

  const handleConnectScale = async (device: IDeviceDTO): Promise<void> => {
    try {
      if (!device.Characteristics) {
        dispatch(
          GlobalActions.openErrorInfoModal(
            'Không tìm thấy dịch vu với cân bạn đang chọn.',
            'ERROR',
          ),
        );
        return;
      }
      const bleDevice: IBleDevice = JSON.parse(device.Characteristics);
      if (bleDevice && !bleDevice.localName)
        bleDevice.localName = device.DeviceName;
      dispatch(SettingActions.setBluetoothScaleDevice(bleDevice));
      const isConnected = await connectDevice(bleDevice.deviceId, bleManager!);
      console.log({isConnected});
      setScaleIdConnected(isConnected ? bleDevice.deviceId : undefined);
    } catch (er) {
      dispatch(GlobalActions.openErrorInfoModal(`${er}`, 'ERROR'));
    }
  };
  // #end BLE

  const onCreateUpdateDevice = (device: IDeviceModel) => {
    setCreateUpdateModel(false);
    if (device.Type === DeviceType.PRINTER) {
      setValueTest(JSON.stringify(device));
      dispatch(SettingActions.createUpdateDeviceServer(device));
    } else {
      onSaveBluetoothDevice(device);
    }
  };

  return (
    <SafeView>
      <Header
        title="Thiết bị"
        isMenu
        disableThreeDot
        component={
          <Formik
            enableReinitialize
            initialValues={farm}
            onSubmit={(values) => {}}>
            {({values}) => {
              return (
                <Row style={{marginHorizontal: 20}}>
                  <Column>
                    <Dropdown
                      label="Trại"
                      name="id"
                      selectedValue={values.id}
                      data={[
                        {label: 'Tất cả', value: '', keySearch: 'tat ca'},
                        ...locationDropDownData,
                      ]}
                      searchPlaceholder="Nhập tên trại để tìm kiếm."
                      onSelect={(item) => {
                        setLocationId(item.value.toString());
                      }}
                      labelStyle={{display: 'none'}}
                      containerStyle={{
                        borderWidth: 0.5,
                        borderColor: Colors.BORDER_DARK,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                      }}
                      wrapStyle={{borderBottomWidth: 0}}
                    />
                  </Column>
                </Row>
              );
            }}
          </Formik>
        }
      />
      <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
        <Tab.Navigator
          lazy
          tabBarPosition="top"
          tabBarOptions={{
            scrollEnabled: false,
            indicatorStyle: {backgroundColor: Colors.ORIGIN},
            allowFontScaling: false,
            showIcon: true,
            showLabel: true,
            activeTintColor: Colors.ORIGIN,
            inactiveTintColor: Colors.GRAY_LIGHT,
            labelStyle: {fontSize: 13, textTransform: 'none', marginTop: 10},
          }}>
          <Tab.Screen
            name="Tab"
            options={{
              tabBarLabel: `Cân điện tử`,
              tabBarIcon: () => (
                <Image source={icons.scale} style={{width: 35, height: 35}} />
              ),
            }}>
            {() => (
              <View style={{flex: 1}}>
                <FlatListCommon
                  isShowVertical
                  data={scaleDevices ?? []}
                  renderItem={({item}: {item: IDeviceDTO}) => {
                    return (
                      <DeviceItem
                        deviceName={item.DeviceName ?? ''}
                        macAddress={item.MacAddress}
                        connected={scaleIdConnected === item.MacAddress}
                        farmName={item.UPDATEBY}
                        type="SCALE"
                        onSelect={() => {
                          setDeviceModel({...item});
                          setCreateUpdateModel(true);
                        }}
                        onConnect={() => handleConnectScale(item)}
                        onDelete={() => {
                          setIsConfirm(true);
                          setSelectedDeviceId(item.AUTOID);
                        }}
                      />
                    );
                  }}
                />
                <CircleButton
                  onPress={() => {
                    setIsOpenScaleModal(true);
                  }}
                />
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Tab1"
            options={{
              tabBarLabel: 'Máy in',
              tabBarIcon: ({color}) => (
                <Icon name="printer" type="AntDesign" color={color} />
              ),
            }}>
            {() => (
              <View style={{flex: 1}}>
                <FlatListCommon
                  isShowVertical
                  data={bluetoothDevices ?? []}
                  renderItem={({item}: {item: IDeviceDTO}) => (
                    <DeviceItem
                      onSelect={() => {
                        setDeviceModel({
                          ...item,
                          Characteristics: item.Characteristics ?? '',
                        });
                        setCreateUpdateModel(true);
                      }}
                      onConnect={() => {
                        if (item.MacAddress) handleConnectPrinter(item);
                      }}
                      onDelete={() => {
                        setIsConfirm(true);
                        setSelectedDeviceId(item.AUTOID);
                      }}
                      deviceName={item.DeviceName ?? ''}
                      macAddress={item.MacAddress}
                      connected={
                        !!(
                          item.MacAddress &&
                          starPrinter &&
                          starPrinter.macAddress === item.MacAddress &&
                          isPrinterConnected
                        )
                      }
                      farmName={item.FarmId}
                      type="PRINTER"
                    />
                  )}
                />

                <CircleButton onPress={() => setIsOpenPrinterModal(true)} />
              </View>
            )}
          </Tab.Screen>
        </Tab.Navigator>

        <Row style={{display: 'none'}}>
          <Column>
            <TextInput
              multiline
              style={{borderWidth: 1, width: '100%'}}
              value={valueTest}
            />
          </Column>
        </Row>
      </View>
      <ConfirmModal
        title="Bạn có chắc muốn xóa thiết bị này ?"
        isVisible={isConfirm}
        onAccept={() => {
          setIsConfirm(false);
          if (selectedDeviceId)
            dispatch(SettingActions.deleteDeviceServer(selectedDeviceId));
        }}
        onClose={() => setIsConfirm(false)}
      />

      {/* Quét thiết bị cân */}
      <ModalBottom
        title="Thiết bị cân"
        isVisible={isOpenScaleModal}
        onClose={() => setIsOpenScaleModal(false)}>
        <FlatListCommon
          contentContainerStyle={{
            alignItems: devices.length > 0 ? 'flex-start' : 'center',
          }}
          data={devices}
          renderItem={({item}: {item: IBleDevice}) => (
            <ScaleBluetoothItem
              item={item}
              isConnected={item.deviceId === scaleIdConnected}
              connectText="Lưu cân điện tử"
              onConnect={() => {
                setDeviceModel({
                  AUTOID: 0,
                  DeviceName: item.deviceName,
                  MacAddress: item.deviceId,
                  Characteristics: '',
                  Type: DeviceType.SCALE,
                  STATUS: 1,
                  Enabled: 1,
                  UPDATEBY: userParams.userId,
                });
                setIsOpenScaleModal(false);
                setCreateUpdateModel(true);
              }}
            />
          )}
          isShowVertical={false}
        />

        <Row>
          <Column>
            <Button
              onPress={scanOrStopDevices}
              title={scanning ? 'Dừng tìm thiết bị' : 'Nhấn để quét thiết bị'}
              color={Colors.WHITE}
              bgColor={scanning ? Colors.DISABLED : Colors.ORIGIN}
              radius={5}
              leftComponent={
                scanning && (
                  <View style={{width: 30}}>
                    <SkypeIndicator color={Colors.WHITE} size={25} />
                  </View>
                )
              }
            />
          </Column>
        </Row>
      </ModalBottom>

      {/** quét máy in */}
      <ModalBottom
        style={{minHeight: 160}}
        isVisible={isOpenPrinterModal}
        title="Máy In"
        onClose={() => setIsOpenPrinterModal(false)}>
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
              <TouchableOpacity
                onPress={() => {
                  const model: IDeviceModel = {
                    AUTOID: 0,
                    FarmId: '',
                    MacAddress: item.macAddress,
                    DeviceName: item.portName,
                    Type: DeviceType.PRINTER,
                    UPDATEBY: userParams.userId,
                    Characteristics: '',
                    STATUS: 1,
                    Enabled: 1,
                  };
                  setDeviceModel(model);

                  setIsOpenPrinterModal(false);
                  setCreateUpdateModel(true);
                }}>
                <View
                  style={[
                    styles.btnConnect,
                    {
                      backgroundColor: Colors.GRAY,
                    },
                  ]}>
                  <Icon
                    style={styles.iconConnect}
                    type="AntDesign"
                    name="save"
                  />
                  <TextCustom style={styles.textConnect}>Lưu máy in</TextCustom>
                </View>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<NotFound />}
        />
      </ModalBottom>

      <ModalBottom
        style={{minHeight: 170}}
        title="Lưu thông tin thiết bị"
        isVisible={createUpdateModel}
        onClose={() => setCreateUpdateModel(false)}>
        <Formik
          enableReinitialize
          initialValues={deviceModel}
          onSubmit={(values) => {
            onCreateUpdateDevice(values);
          }}>
          {({values, setFieldValue, handleSubmit}) => {
            return (
              <>
                <Row>
                  <Column>
                    <Dropdown
                      label="Trại"
                      name="FarmId"
                      selectedValue={values.FarmId}
                      data={locationDropDownData}
                      searchPlaceholder="Nhập tên trại để tìm kiếm."
                      onSelect={(item) => {
                        const index = values.DeviceName?.indexOf(item.label);
                        if (index && index < 0)
                          setFieldValue(
                            'DeviceName',
                            `${values.DeviceName} ${item.label}`,
                          );
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Tên máy  in"
                      name="DeviceName"
                      value={values.DeviceName}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Địa chỉ Mac"
                      name="MacAddress"
                      value={values.MacAddress}
                      readonly
                    />
                  </Column>
                </Row>

                <Row>
                  <Column
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Button
                      title="Lưu thiết bị"
                      onPress={handleSubmit}
                      color={Colors.WHITE}
                      radius={50}
                    />
                  </Column>
                </Row>
              </>
            );
          }}
        </Formik>
      </ModalBottom>
    </SafeView>
  );
};

export default DeviceScreen;
const styles = StyleSheet.create({
  btnConnect: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
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
    marginRight: 10,
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
