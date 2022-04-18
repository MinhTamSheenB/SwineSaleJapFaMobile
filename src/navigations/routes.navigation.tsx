/* eslint-disable no-return-assign */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import DrawerNavigation from './drawers/drawer.navigation';
import {isMountedRef, navigationRef} from './navigation.services';
import ScreenType from './screen.constant';
import {
  SoCreateCustomerScreen,
  SoCreateReceptScreen,
  SoCreateDiscountScreen,
  SoCreateProductAddScreen,
  SoCreateProductsScreen,
  SoSummaryScreen,
} from '~/screens/transactions/so';
import {
  OfficeScreen,
  LoginScreen,
  WebViewScreen,
  PassCodeScreen,
  StartScreen,
  SetupPassCodeScreen,
  ConfirmSetupPassCodeScreen,
  PdfViewerScreen,
  CustomerBalanceScreen,
} from '~/screens/mains';
import TestScreen from '~/screens/Test';
import {
  DoCreateOrder,
  DoReceptScreen,
  DoProductsScreen,
  DoCreateProductScreen,
  DoSummaryScreen,
} from '~/screens/transactions/do';
import {InvoiceDetailScreen} from '~/screens/transactions/invoice';
import {DiscountDetailScreen} from '~/screens/transactions/discount';
import {
  CndnAccountScreen,
  CndnAddProductScreen,
  CndnCreateScreen,
  CndnOrderScreen,
  CndnProductsScreen,
  CndnTotalPaymentScreen,
} from '~/screens/transactions/cndn';
import {
  CreditCreateScreen,
  CreditDetailScreen,
} from '~/screens/transactions/credit';
import {
  WeighingGoodsCreateOfflineScreen,
  WeighingGoodsCreateScreen,
} from '~/screens/transactions/weighingGoods';
import {
  ScaleNoteDownDoListScreen,
  ScaleNoteDownEditDetailScreen,
  ScaleNoteDownEditScreen,
  ScaleNoteDownSummaryScreen,
} from '~/screens/transactions/scaleNoteDown';
import {
  DoReleaseListScreen,
  DoReleaseSummaryScreen,
} from '~/screens/transactions/doRelease';
import {RootState} from '~/redux/reducers';
import {DeviceScreen} from '~/screens/settings/bluetooths';
import {ResultsMonitoringScreen} from '~/screens/monitorings';

const Stack = createStackNavigator();

const RoutesNavigatorContainer = (): any => {
  const {userOfficeS} = useSelector((state: RootState) => state.master);

  React.useEffect(() => {
    isMountedRef!.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={ScreenType.Main.Start}
          headerMode="none">
          {/* <Stack.Screen name="TestScreen" component={TestScreen} /> */}
          <Stack.Screen name={ScreenType.Main.Start} component={StartScreen} />
          <Stack.Screen name={ScreenType.Main.Login} component={LoginScreen} />
          <Stack.Screen
            name={ScreenType.Main.SetUpPassCode}
            component={SetupPassCodeScreen}
          />
          <Stack.Screen
            name={ScreenType.Main.ConfirmSetUpPassCode}
            component={ConfirmSetupPassCodeScreen}
          />
          <Stack.Screen
            name={ScreenType.Main.PassCode}
            component={PassCodeScreen}
          />
          <Stack.Screen
            name={ScreenType.Main.Office}
            component={OfficeScreen}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen
            name={ScreenType.Main.Home}
            component={DrawerNavigation}
            options={{gestureEnabled: userOfficeS.length > 1}}
          />
          <Stack.Screen
            name={ScreenType.SO.CREATE_CUSTOMER}
            component={SoCreateCustomerScreen}
          />
          <Stack.Screen
            name={ScreenType.SO.CREATE_RECEPT}
            component={SoCreateReceptScreen}
          />
          <Stack.Screen
            name={ScreenType.SO.PRODUCT_LIST}
            component={SoCreateProductsScreen}
          />
          <Stack.Screen
            name={ScreenType.SO.ADD_PRODUCT}
            component={SoCreateProductAddScreen}
          />
          <Stack.Screen
            name={ScreenType.SO.DISCOUNT}
            component={SoCreateDiscountScreen}
          />
          <Stack.Screen
            name={ScreenType.SO.SUMMARY}
            component={SoSummaryScreen}
          />
          <Stack.Screen
            name={ScreenType.DO.CREATE_ORDER}
            component={DoCreateOrder}
          />
          <Stack.Screen
            name={ScreenType.DO.RECEPT}
            component={DoReceptScreen}
          />
          <Stack.Screen
            name={ScreenType.DO.PRODUCTS}
            component={DoProductsScreen}
          />
          <Stack.Screen
            name={ScreenType.DO.ADD_PRODUCT}
            component={DoCreateProductScreen}
          />
          <Stack.Screen
            name={ScreenType.DO.SUMMARY}
            component={DoSummaryScreen}
          />

          <Stack.Screen
            name={ScreenType.Invoice.DETAIL}
            component={InvoiceDetailScreen}
          />
          <Stack.Screen
            name={ScreenType.Discount.DETAIL}
            component={DiscountDetailScreen}
          />

          <Stack.Screen
            name={ScreenType.Cndn.CREATE}
            component={CndnCreateScreen}
          />

          <Stack.Screen
            name={ScreenType.Cndn.ACCOUNT}
            component={CndnAccountScreen}
          />
          <Stack.Screen
            name={ScreenType.Cndn.ORDER}
            component={CndnOrderScreen}
          />

          <Stack.Screen
            name={ScreenType.Cndn.PRODUCTS}
            component={CndnProductsScreen}
          />
          <Stack.Screen
            name={ScreenType.Cndn.ADD_PRODUCT}
            component={CndnAddProductScreen}
          />
          <Stack.Screen
            name={ScreenType.Cndn.TOTAL_PAYMENT}
            component={CndnTotalPaymentScreen}
          />
          <Stack.Screen
            name={ScreenType.Main.WebView}
            component={WebViewScreen}
          />

          <Stack.Screen
            name={ScreenType.Credit.CREATE}
            component={CreditCreateScreen}
          />
          <Stack.Screen
            name={ScreenType.Credit.DETAIL}
            component={CreditDetailScreen}
          />
          <Stack.Screen
            name={ScreenType.WeighingGoods.CREATE}
            component={WeighingGoodsCreateScreen}
          />
          <Stack.Screen
            name={ScreenType.WeighingGoods.CREATE_OFFLINE}
            component={WeighingGoodsCreateOfflineScreen}
          />
          <Stack.Screen
            name={ScreenType.Main.PdfViewer}
            component={PdfViewerScreen}
          />
          {/* <!-- Scale note down --> */}
          <Stack.Screen
            name={ScreenType.ScaleNoteDown.DO_LIST}
            component={ScaleNoteDownDoListScreen}
          />
          <Stack.Screen
            name={ScreenType.ScaleNoteDown.EDIT}
            component={ScaleNoteDownEditScreen}
          />
          <Stack.Screen
            name={ScreenType.ScaleNoteDown.EDIT_DETAIL}
            component={ScaleNoteDownEditDetailScreen}
          />
          <Stack.Screen
            name={ScreenType.ScaleNoteDown.SUMMARY}
            component={ScaleNoteDownSummaryScreen}
          />

          {/* DO RELEASE */}
          <Stack.Screen
            name={ScreenType.DoRelease.LIST}
            component={DoReleaseListScreen}
          />
          <Stack.Screen
            name={ScreenType.DoRelease.SUMMARY}
            component={DoReleaseSummaryScreen}
          />
          <Stack.Screen
            name={ScreenType.Setting.DEVICES}
            component={DeviceScreen}
          />
          <Stack.Screen
            name={ScreenType.Monitoring.Results}
            component={ResultsMonitoringScreen}
          />
          <Stack.Screen
            name={ScreenType.Main.CustomerBalance}
            component={CustomerBalanceScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RoutesNavigatorContainer;
