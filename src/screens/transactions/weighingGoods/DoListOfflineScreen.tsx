/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IDoLocalItem, IWeighingGoodsModel} from '~/apis/types.service';
import {CircleButton, Icon, SafeView} from '~/components/commons';
import Header from '~/components/sections/Header';
import {Colors} from '~/configs';
import {
  WeighingGoodsDoOffline,
  WGoodsListOffline,
} from '~/containers/transactions/WeighingGoods';
import {
  getCurrentDateToString,
  getCurrentTimeToString,
} from '~/helpers/DatetimeHelpers';
// import {navigate} from '~/navigations';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import wGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';

const Tab = createMaterialTopTabNavigator();

const DoListOfflineScreen = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const {userParams} = useSelector((state: RootState) => state.global);

  useEffect(() => {
    dispatch(wGoodsActions.getProductsOffline());
  }, [dispatch]);

  const handleSelectItem = async (item?: IDoLocalItem) => {
    const model: IWeighingGoodsModel = {REGIONID: userParams.regionId ?? ''};
    model.SCALEDATE = getCurrentDateToString();
    model.ARRIVALTIME = getCurrentTimeToString();
    model.DEPARTTIME = getCurrentTimeToString();
    model.KMSTART = 0.0;
    model.KMARRIVED = 0.0;
    model.USERNAME = userParams.userId;
    model.CREATEDBY = userParams.userId;
    model.WEIGHMAN = userParams.fullName;
    // model.REGIONID = userParams.regionId ?? '';
    const locationName = item?.LOCATIONNAME;

    if (item) {
      model.DONO = item.DONO;
      model.SONO = item.SONO;
      model.UNITID = item.UNITID;
      model.CUSTNAME = item.CUSTNAME;
      model.CUSTID = item.CUSTID;
      model.CUSTADD = item.CUSTADDRESS ?? '';
      model.TRUCKNO = item.TRUCK_NO;
      model.TOTAL_BW_DO = item.BW_TOTAL;
      model.TOTAL_QTY_DO = item.TOTALQTY;
      model.LOCATION_NAME = item.LOCATIONNAME;
    } else {
      // Trường hợp tạo mới mà không có DO trước
      model.DONO = '';
      model.UNITID = userParams.unitId!;
      model.CUSTNAME = '';
      model.CUSTID = '';
      model.CUSTADD = '';
      model.TRUCKNO = '';
      model.TOTAL_QTY_DO = 0;
      model.TOTAL_BW_DO = 0;
    }
    dispatch(wGoodsActions.updateHeaderModelOffline(model, true));
    navigate.navigate(ScreenType.WeighingGoods.CREATE_OFFLINE);
  };

  return (
    <SafeView>
      <Header title="Cân Hàng Offline" isMenu noShadow disableThreeDot />
      <Tab.Navigator
        lazy
        tabBarPosition="top"
        tabBarOptions={{
          scrollEnabled: false,
          indicatorStyle: {backgroundColor: Colors.ORIGIN},
          allowFontScaling: false,
          showIcon: false,
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
          name="Tab"
          options={{
            tabBarLabel: `Đơn hàng`,
            tabBarIcon: ({color}) => (
              <Icon name="infocirlceo" type="AntDesign" color={color} />
            ),
          }}>
          {() => (
            <WeighingGoodsDoOffline
              handleSelectItem={(item) => handleSelectItem(item)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Tab1"
          options={{
            tabBarLabel: 'Phiếu cân tạm',
            tabBarIcon: ({color}) => (
              <Icon name="clipboard" type="Entypo" color={color} />
            ),
          }}>
          {() => <WGoodsListOffline />}
        </Tab.Screen>
      </Tab.Navigator>

      <CircleButton onPress={() => handleSelectItem(undefined)} />
    </SafeView>
  );
};

export default DoListOfflineScreen;
