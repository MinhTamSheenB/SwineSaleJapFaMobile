import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {EventArg} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatListCommon,
  Icon,
  ModalBottom,
  SafeView,
} from '~/components/commons';
import {Header} from '~/components/sections';
import {Colors} from '~/configs';
import {
  GeneralInformationOffline,
  WeighingGoodsDetailOffline,
  WeighingGoodsSummaryOffline,
} from '~/containers/transactions/WeighingGoods';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '~/redux/global/global.actions';
import {RootState} from '~/redux/reducers';
import {navigate} from '~/navigations/navigation.services';
import {BluetoothItem, NoSettingBluetooth} from '~/containers/settings';
import SettingActions from '~/redux/settings/setting.actions';
import {IBleDevice} from '~/apis/types.service';
import {isValidString} from '~/helpers/UtilitiesHelper';
import RongtaPrinterServices from '~/helpers/RongtaPrinterServices';

const Tab = createMaterialTopTabNavigator();
const ICON_SIZE = 18;

const WeighingGoodsCreateOfflineScreen = () => {
  const dispatch = useDispatch();

  const {wOfflineModel} = useSelector((state: RootState) => state.wGoods);
  const {devices, bleDevice, starPrinter, rongtaPrinterServices} = useSelector(
    (state: RootState) => state.setting,
  );

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState<
    string | undefined
  >();

  const [isSwipeEnabled, setSwipeEnabled] = useState<boolean>(() => {
    return !!(wOfflineModel?.SCALEID && wOfflineModel.SCALEID > 0);
  });

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
    dispatch(SettingActions.getDefaultPrinter());
  }, [dispatch]);

  useEffect(() => {
    const isSwipe = !!(wOfflineModel?.SCALEID && wOfflineModel.SCALEID > 0);
    setSwipeEnabled(isSwipe);
  }, [wOfflineModel?.SCALEID]);

  useEffect(() => {
    if (!bleDevice) {
      setConnectedDeviceName('Chưa kết nối');
    } else {
      const name = isValidString(bleDevice.localName)
        ? bleDevice.localName
        : bleDevice.deviceName;
      setConnectedDeviceName(name);
    }
  }, [bleDevice]);

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
        title="Cân Bán Hàng (offline)"
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
          {() => <GeneralInformationOffline />}
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
          {() => <WeighingGoodsDetailOffline />}
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
            <WeighingGoodsSummaryOffline
              navigate={() =>
                navigate(ScreenType.WeighingGoods.DO_LIST_OFFLINE)
              }
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
    </SafeView>
  );
};

export default WeighingGoodsCreateOfflineScreen;
