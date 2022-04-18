/* eslint-disable @typescript-eslint/no-use-before-define */
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppStrings, Colors} from '~/configs';
import CndnList from './CndnList';
import Icons from '~/assets/icons';
import {CircleButton} from '~/components/commons';
import {CnDnStatus} from '~/apis/types.service';
import CndnActions from '~/redux/cndn/cndn.actions';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';

const Tab = createMaterialTopTabNavigator();

export interface IProps {
  fromDate: string;
  toDate: string;
}

const CndnTabs = ({fromDate, toDate}: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {currentDrawerScreen} = useSelector((state: RootState) => state.global);

  return (
    <>
      <Tab.Navigator
        lazy
        tabBarPosition="top"
        tabBarOptions={{
          indicatorStyle: {backgroundColor: Colors.ORIGIN},
          allowFontScaling: false,
          showIcon: true,
          showLabel: true,
          scrollEnabled: true,
          style: {elevation: 0},
          tabStyle: styles.tabStyle,
        }}>
        <Tab.Screen
          options={{
            tabBarIcon: ({}) => (
              <Image
                source={Icons.clockwise}
                style={[styles.imgIcon, {width: 20, height: 20}]}
              />
            ),
          }}
          name={AppStrings.Cndn.status.new}>
          {() => (
            <CndnList
              status={CnDnStatus.New}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarIcon: ({}) => (
              <Image
                source={Icons.approved}
                style={[styles.imgIcon, {width: 20, height: 20}]}
              />
            ),
          }}
          name={AppStrings.Cndn.status.approved}>
          {() => (
            <CndnList
              status={CnDnStatus.Approved}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarIcon: ({}) => (
              <Image
                source={Icons.bill}
                style={[styles.imgIcon, {width: 20, height: 20}]}
              />
            ),
          }}
          name={AppStrings.Cndn.status.invoiced}>
          {() => (
            <CndnList
              status={CnDnStatus.InvoiceIssued}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarIcon: ({}) => (
              <Image
                source={Icons.rejected}
                style={[styles.imgIcon, {width: 20, height: 20}]}
              />
            ),
          }}
          name={AppStrings.Cndn.status.canceled}>
          {() => (
            <CndnList
              status={CnDnStatus.Rejected}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {currentDrawerScreen !== ScreenType.Approval.CNDN && (
        <CircleButton
          onPress={() => {
            dispatch(CndnActions.clearHeaderLocalModel());
            navigation.navigate(ScreenType.Cndn.ACCOUNT);
          }}
        />
      )}
    </>
  );
};

export default CndnTabs;
const styles = StyleSheet.create({
  imgIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    marginTop: 0,
    position: 'absolute',
  },
  tabStyle: {
    flexDirection: 'row',
    paddingBottom: 10,
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
});
