/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ScreenType from '../screen.constant';
import {DashboardScreen} from '~/screens/mains';
import {SoListScreen} from '~/screens/transactions/so';
import AppDrawer from './app.drawer';
import styles from '../navigation.style';
import {DoListScreen} from '~/screens/transactions/do';
import {InternalListScreen} from '~/screens/transactions/internalTransfer';
import {InvoiceListScreens} from '~/screens/transactions/invoice';
import {ScaleListScreen} from '~/screens/transactions/scale';
import {DiscountListScreen} from '~/screens/transactions/discount';
import {CndnListScreen, CndnSummaryScreen} from '~/screens/transactions/cndn';
import {CreditListScreen} from '~/screens/transactions/credit';
import {
  BluetoothDevicesScreen,
  DeviceScreen,
} from '~/screens/settings/bluetooths';
import {
  DoListOfflineScreen,
  WeighingGoodsDoListScreen,
} from '~/screens/transactions/weighingGoods';
import {ScaleNoteDownListScreen} from '~/screens/transactions/scaleNoteDown';
import {DailySaleMonitoringScreen} from '~/screens/monitorings';
import Test from '~/screens/Test';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerStyle={styles.drawerStyles}
      sceneContainerStyle={styles.sceneContainerStyle}
      drawerContent={(props) => {
        return <AppDrawer {...props} />;
      }}>
      <Drawer.Screen
        name={ScreenType.Main.Dashboard}
        component={DashboardScreen}
      />
      <Drawer.Screen name={ScreenType.DO.LIST} component={DoListScreen} />
      <Drawer.Screen name={ScreenType.SO.List} component={SoListScreen} />
      <Drawer.Screen
        name={ScreenType.InternalTransfer.LIST}
        component={InternalListScreen}
      />
      <Drawer.Screen
        name={ScreenType.Invoice.LIST}
        component={InvoiceListScreens}
      />
      <Drawer.Screen name={ScreenType.Scale.LIST} component={ScaleListScreen} />

      <Drawer.Screen
        name={ScreenType.Discount.LIST}
        component={DiscountListScreen}
      />
      <Drawer.Screen
        name={ScreenType.Approval.DISCOUNT}
        component={DiscountListScreen}
      />

      <Drawer.Screen name={ScreenType.Cndn.LIST} component={CndnListScreen} />

      <Drawer.Screen
        name={ScreenType.Cndn.SUMMARY}
        component={CndnSummaryScreen}
      />

      <Drawer.Screen
        name={ScreenType.Credit.LIST}
        component={CreditListScreen}
      />

      <Drawer.Screen
        name={ScreenType.WeighingGoods.DO_LIST}
        component={WeighingGoodsDoListScreen}
      />

      <Drawer.Screen
        name={ScreenType.Setting.BLUETOOTH_SEARCH}
        component={BluetoothDevicesScreen}
      />
      <Drawer.Screen
        name={ScreenType.WeighingGoods.DO_LIST_OFFLINE}
        component={DoListOfflineScreen}
      />

      <Drawer.Screen
        name={ScreenType.Approval.CNDN}
        component={CndnListScreen}
      />
      <Drawer.Screen
        name={ScreenType.ScaleNoteDown.List}
        component={ScaleNoteDownListScreen}
      />
      <Drawer.Screen
        name={ScreenType.Monitoring.DailySale}
        component={DailySaleMonitoringScreen}
      />

      <Drawer.Screen
        name={ScreenType.Setting.DEVICES}
        component={DeviceScreen}
      />

      <Drawer.Screen name={ScreenType.Main.Test} component={Test} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
