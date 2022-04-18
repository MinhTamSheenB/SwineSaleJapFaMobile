/* eslint-disable @typescript-eslint/no-use-before-define */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {EventArg} from '@react-navigation/native';
import {IBleDevice} from '~/apis/types.service';
import ScreenType from '~/navigations/screen.constant';

import {
  FlatListCommon,
  Icon,
  ModalBottom,
  SafeView,
} from '~/components/commons';
import {ConfirmModal, Header} from '~/components/sections';
import {Colors} from '~/configs';
import {BluetoothItem, NoSettingBluetooth} from '~/containers/settings';
import {
  GeneralInformation,
  WeighingGoodsDetail,
  WeighingGoodsSummary,
} from '~/containers/transactions/WeighingGoods';
import {RootState} from '~/redux/reducers';
import SettingActions from '~/redux/settings/setting.actions';
import {isValidString} from '~/helpers/UtilitiesHelper';
import {navigate} from '~/navigations/navigation.services';
import wGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';
import GlobalActions from '~/redux/global/global.actions';
import RongtaPrinterServices from '~/helpers/RongtaPrinterServices';

const Tab = createMaterialTopTabNavigator();
const ICON_SIZE = 18;

const WeighingGoodsCreateScreen = () => {
  const dispatch = useDispatch();

  const {isConnected} = useSelector((state: RootState) => state.network);
  const {starPrinter, rongtaPrinterServices} = useSelector(
    (state: RootState) => state.setting,
  );
  const {wGoodModel} = useSelector((state: RootState) => state.wGoods);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSwipeEnabled, setSwipeEnabled] = useState<boolean>(() => {
    return !!(wGoodModel?.SCALEID && wGoodModel.SCALEID > 0);
  });
  const {devices, bleDevice} = useSelector((state: RootState) => state.setting);
  const [connectedDeviceName, setConnectedDeviceName] = useState<
    string | undefined
  >();

  const [isConfirmOffline, setIsConfirmOffline] = useState<boolean>(false);

  const handleConnectPrinter = useCallback(() => {
    if (!starPrinter) return;
    if (starPrinter.type === 'RONGTA') {
      if (!rongtaPrinterServices) {
        const rpServices = new RongtaPrinterServices(starPrinter.macAddress);
        rpServices?.connectRongtaPrinter(starPrinter.macAddress);
        dispatch(SettingActions.updateRongtaPrintService(rpServices));
      }
    }
  }, [dispatch, rongtaPrinterServices, starPrinter]);

  useEffect(() => {
    if (!isConnected) {
      setIsConfirmOffline(true);
    }
  }, [isConnected]);

  useEffect(() => {
    if (wGoodModel && wGoodModel.DONO) {
      dispatch(wGoodsActions.getProducts(wGoodModel?.DONO!));
    }
  }, [dispatch, wGoodModel]);

  useEffect(() => {
    const isSwipe = !!(wGoodModel?.SCALEID && wGoodModel.SCALEID > 0);
    setSwipeEnabled(isSwipe);
  }, [wGoodModel, wGoodModel?.SCALEID]);

  // const getBleDevicesFromAsyncStorage = useCallback(async () => {
  //   const devicesStored: IBleDevice[] = await getBluetoothDevices();
  //   dispatch(SettingActions.updateBluetoothScaleDevices(devicesStored));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   getBleDevicesFromAsyncStorage();
  // }, [getBleDevicesFromAsyncStorage]);

  useEffect(() => {
    if (!bleDevice) setConnectedDeviceName('Chưa kết nối');
    else {
      const name = isValidString(bleDevice.localName)
        ? bleDevice.localName
        : bleDevice.deviceName;
      setConnectedDeviceName(name);
    }
  }, [bleDevice]);

  // useEffect(() => {
  //   dispatch(SettingActions.getDefaultPrinter());
  // }, [dispatch]);

  useEffect(() => {
    handleConnectPrinter();
  }, [handleConnectPrinter]);

  const onSelectBluetoothScale = (device: IBleDevice) => {
    dispatch(SettingActions.setBluetoothScaleDevice(device));
    setIsVisible(false);
  };

  const handleTabPress = (e: EventArg<'tabPress', true, undefined>) => {
    if (!isSwipeEnabled) {
      dispatch(
        GlobalActions.openErrorInfoModal(
          'Vui lòng hoàn thành thông tin chung trước.',
          'WARNING',
        ),
      );
      e.preventDefault();
    }
  };

  return (
    <SafeView>
      <Header
        title="Cân Bán Hàng"
        isMenu={false}
        noShadow
        isBluetoothIcon
        disableThreeDot
        bluetoothName={connectedDeviceName}
        onMenuPress={() => setIsVisible(true)}
      />
      <Tab.Navigator
        swipeEnabled={isSwipeEnabled}
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
          labelStyle: {fontSize: 15, textTransform: 'none'},
          tabStyle: {
            flexDirection: 'row',
            flex: 1,
          },
          iconStyle: {marginTop: 5},
        }}>
        <Tab.Screen
          name="informationTab"
          options={{
            tabBarLabel: `Thông tin chung`,
            tabBarIcon: ({color}) => (
              <Icon
                name="infocirlceo"
                type="AntDesign"
                color={color}
                size={ICON_SIZE}
              />
            ),
          }}>
          {() => <GeneralInformation />}
        </Tab.Screen>
        <Tab.Screen
          name="detailsTab"
          listeners={{
            tabPress: (e) => handleTabPress(e),
          }}
          options={{
            tabBarLabel: 'Chi tiết',
            tabBarIcon: ({color}) => (
              <Icon
                name="clipboard"
                type="Entypo"
                color={color}
                size={ICON_SIZE}
              />
            ),
          }}>
          {() => <WeighingGoodsDetail />}
        </Tab.Screen>
        <Tab.Screen
          name="summaryTab"
          listeners={{
            tabPress: (e) => handleTabPress(e),
          }}
          options={{
            tabBarLabel: `Tổng hợp`,
            tabBarIcon: ({color}) => (
              <Icon
                name="checkcircleo"
                type="AntDesign"
                color={color}
                size={ICON_SIZE}
              />
            ),
          }}>
          {() => (
            <WeighingGoodsSummary
              navigate={() => navigate(ScreenType.WeighingGoods.DO_LIST)}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      <ModalBottom
        style={{backgroundColor: Colors.BG}}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title="Danh sách cân bluetooth">
        <FlatListCommon
          isShowVertical
          data={devices}
          renderItem={({item}) => (
            <BluetoothItem
              item={item}
              onPress={() => onSelectBluetoothScale(item)}
            />
          )}
          emptyComponent={
            <NoSettingBluetooth
              onPress={() => {
                setIsVisible(false);
                navigate(ScreenType.Setting.BLUETOOTH_SEARCH);
              }}
            />
          }
        />
      </ModalBottom>

      <ConfirmModal
        title="Dường như bạn đã gặp sự cố về đường truyền internet. Bạn có muốn tiếp tục cân với chế độ offline?"
        isVisible={isConfirmOffline}
        onClose={() => setIsConfirmOffline(false)}
        onAccept={() => {
          setIsConfirmOffline(false);
          dispatch(wGoodsActions.convertModelFromOnlineToOffline());
        }}
      />
    </SafeView>
  );
};

export default WeighingGoodsCreateScreen;
