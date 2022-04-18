import React, { useEffect } from 'react';
import {useSelector} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {IInvoiceFilterModel, InvoiceStatus} from '~/apis/types.service';
import {Header} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {DoInvoiceTab, InvoiceTab} from '~/containers/transactions/Invoice';
import {ModalFilter} from '~/containers/transactions/So';
import {RootState} from '~/redux/reducers';
import {Icon, SafeView} from '~/components/commons';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';

const Tab = createMaterialTopTabNavigator();

const InvoiceListScreens = () => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const {userParams} = useSelector((state: RootState) => state.global);
  const [fromDate, setFromDate] = React.useState<string>(() => FROM_DATE);
  const [toDate, setToDate] = React.useState<string>(() => TO_DATE);

  const [invoiceFilterModel, setInvoiceFilterModel] =
    React.useState<IInvoiceFilterModel>(() => {
      return {
        ...userParams,
        status: InvoiceStatus.New,
        loadDetail: false,
        fromDate,
        toDate,
      };
    });

  useEffect(() => {
    const temp: IInvoiceFilterModel = {...invoiceFilterModel, ...userParams};
    setInvoiceFilterModel(temp);
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userParams.deptId]);

  return (
    <SafeView>
      <Header
        title={AppStrings.Invoice.title}
        isMenu
        noShadow
        onMenuPress={() => setIsVisible(true)}
      />
      <Tab.Navigator
        lazy
        tabBarPosition="top"
        tabBarOptions={{
          indicatorStyle: {backgroundColor: Colors.BORDER_DARK},
          allowFontScaling: false,
          showIcon: true,
          showLabel: true,
          activeTintColor: Colors.GRAY,
          inactiveTintColor: Colors.GRAY_LIGHT,
          labelStyle: {fontSize: 16, textTransform: 'uppercase'},
          tabStyle: {flexDirection: 'row', alignItems: 'center'},
        }}>
        <Tab.Screen
          name="Tab"
          options={{
            tabBarLabel: `${AppStrings.Invoice.doTabTitle}`,
            tabBarIcon: ({color}) => (
              <Icon name="list" type="Entypo" color={color} size={22} />
            ),
          }}>
          {() => <DoInvoiceTab model={invoiceFilterModel} />}
        </Tab.Screen>
        <Tab.Screen
          name="Tab1"
          options={{
            tabBarLabel: `${AppStrings.Invoice.invoiceTabTitle}`,
            tabBarIcon: ({color}) => (
              <Icon name="clipboard" type="Entypo" color={color} size={20} />
            ),
          }}>
          {() => <InvoiceTab model={invoiceFilterModel} />}
        </Tab.Screen>
      </Tab.Navigator>
      <ModalFilter
        title={AppStrings.Invoice.modalFilterTitle}
        isVisible={isVisible}
        fromDate={fromDate}
        toDate={toDate}
        onClose={() => setIsVisible(false)}
        onDateChange={(strDate, type) => {
          if (type === 'fromDate') {
            setFromDate(strDate);
          }
          if (type === 'toDate') {
            setToDate(strDate);
          }
        }}
        onFilter={() => {
          const obj: IInvoiceFilterModel = {
            ...invoiceFilterModel,
            fromDate,
            toDate,
          };
          setInvoiceFilterModel(obj);
          setIsVisible(false);
        }}
      />
    </SafeView>
  );
};

export default InvoiceListScreens;
