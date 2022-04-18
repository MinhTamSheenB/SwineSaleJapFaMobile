import React, {useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {Pressable, View} from 'react-native';
import {
  DateRowWithoutFormik,
  FlatListCommon,
  Icon,
  ModalBottom,
  SafeView,
  TextCustom,
} from '~/components/commons';
import {Column, Header, Row, SearchBox} from '~/components/sections';
import {Colors} from '~/configs';
import {
  WGoodsDOList,
  WGoodsList,
} from '~/containers/transactions/WeighingGoods';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import {ILocation} from '~/apis/types.service';
import {scaleFactor} from '~/helpers/UtilitiesHelper';
import {convertStringToDate} from '~/helpers/DatetimeHelpers';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';

const Tab = createMaterialTopTabNavigator();

const WeighingGoodsDoListScreen = () => {
  const dispatch = useDispatch();

  const {locationsOfUser} = useSelector((state: RootState) => state.master);

  const [isOpenFarmModal, setOpenFarmModal] = useState<boolean>(false);
  const [currentFarm, setCurrentFarm] = useState<ILocation | undefined>();
  const [farms, setFarms] = useState<ILocation[]>([]);
  const [farmsSearchDatasource, setFarmsSearchDatasource] = useState<
    ILocation[]
  >([]);

  const [fromDate, setFromDate] = useState<string>(() => FROM_DATE);
  const [toDate, setToDate] = useState<string>(() => TO_DATE);

  useEffect(() => {
    const newLocations: ILocation[] = [...locationsOfUser];
    newLocations.unshift({
      UNITNAME: '',
      LOCATIONNAME: 'Tất cả',
      PROVINCEID: '',
      ACTIVE: 0,
      keySearch: '',
      label: 'Tất cả',
      value: '',
    });
    setFarms(newLocations);
    setFarmsSearchDatasource(newLocations);
  }, [locationsOfUser]);

  useEffect(() => {
    dispatch(MasterActions.getLocationsByUser());
  }, [dispatch]);

  return (
    <SafeView>
      <Header
        title="Cân Hàng"
        isMenu
        noShadow
        onMenuPress={() => {
          setOpenFarmModal(true);
        }}
      />

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
            <WGoodsDOList
              locationId={currentFarm?.LOCATIONID}
              unitId={currentFarm?.UNITID}
              fromDate={fromDate}
              toDate={toDate}
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
          {() => (
            <WGoodsList
              unitId={currentFarm?.UNITID}
              locationId={currentFarm?.LOCATIONID}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      <ModalBottom
        isVisible={isOpenFarmModal}
        onClose={() => setOpenFarmModal(false)}
        title="Danh Sách Trại"
        style={{
          minHeight: scaleFactor(150),
          height: scaleFactor(450),
          maxHeight: scaleFactor(550),
        }}>
        <View>
          <View style={{marginTop: -10}}>
            <SearchBox
              dataSource={farmsSearchDatasource}
              accessor="keySearch"
              onSearch={(newData) => setFarms(newData ?? [])}
              placeholder="Nhập mã trại, tên trại."
            />
          </View>
          <Row>
            <Column>
              <DateRowWithoutFormik
                label="Từ ngày"
                date={convertStringToDate(fromDate)}
                type="date"
                onDateChange={(date) => {
                  setFromDate(date);
                }}
              />
            </Column>
            <Column>
              <DateRowWithoutFormik
                label="Đến ngày"
                date={convertStringToDate(toDate)}
                type="date"
                onDateChange={(date) => {
                  setToDate(date);
                }}
              />
            </Column>
          </Row>
        </View>
        <FlatListCommon
          isShowVertical={false}
          data={farms}
          renderItem={({item}: {item: ILocation}) => (
            <Pressable
              onPress={() => {
                setCurrentFarm(item);
                setOpenFarmModal(false);
                setFarms(farmsSearchDatasource);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  backgroundColor: Colors.BG,
                  marginVertical: 10,
                  paddingHorizontal: 20,
                }}>
                <Icon
                  name="house"
                  type="MaterialIcons"
                  color={Colors.GRAY_LIGHT}
                  style={{marginRight: 10}}
                />
                <TextCustom>{`${item.UNITNAME} - ${item.LOCATIONNAME}`}</TextCustom>
              </View>
            </Pressable>
          )}
        />
      </ModalBottom>
    </SafeView>
  );
};

export default WeighingGoodsDoListScreen;
