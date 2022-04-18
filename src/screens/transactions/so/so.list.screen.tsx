/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Header, Container, SearchBox} from '~/components/sections';
import {AppStrings} from '~/configs';
import {SoFilter, ModalFilter, SoListOrder} from '~/containers/transactions/So';
import {CircleButton, SafeView} from '~/components/commons';
import ScreenType from '~/navigations/screen.constant';
import SoActions from '~/redux/so/so.actions';
import {
  ISoDetail,
  ISoFilterModel,
  ISoHeaderModel,
  OrderStatus,
} from '~/apis/types.service';
import {RootState} from '~/redux/reducers';
import {
  convertStringDateToMdDdYyyy,
  convertStringToDate,
  getCurrentDateToString,
  getCurrentTimeToString,
} from '~/helpers/DatetimeHelpers';
import MasterActions from '~/redux/master/master.actions';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';

const SoListScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {userParams} = useSelector((state: RootState) => state.global);
  const {data} = useSelector((state: RootState) => state.so);
  // state

  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  const [soData, setSoData] = useState<ISoDetail[]>([]);
  const [soFilter, setSoFilter] = useState<ISoFilterModel>(() => {
    return {
      userId: userParams.userId,
      deptId: userParams.deptId,
      loadDetail: false,
      status: OrderStatus.New,
      fromDate: FROM_DATE,
      toDate: TO_DATE,
    };
  });

  /**
   * Lấy danh sách Đơn đặt hàng
   */
  const fetchSoList = useCallback(() => {
    setFilterVisible(false);
    const filter: ISoFilterModel = {
      ...soFilter,
      ...userParams,
    };
    dispatch(SoActions.search(filter));
  }, [dispatch, soFilter, userParams]);

  useEffect(() => {
    setSoData(data);
  }, [data]);

  useEffect(() => {
    fetchSoList();
  }, [fetchSoList]);

  useEffect(() => {
    dispatch(MasterActions.getSaleLocation());
  }, [dispatch]);

  const handleSelect = (so: ISoDetail | undefined): void => {
    console.log({so});
    const currentDate = getCurrentDateToString();
    const model: ISoHeaderModel = so
      ? {
          ...so,
          SODATE: so.SODATE,
          DELIVERYDATE: so.DELIVERYDATE,
        }
      : {
          REGIONID: `${userParams.regionId}`,
          UNITID: `${userParams.unitId}`,
          OFFICEID: userParams.officeId ?? 0,
          DEPTID: userParams.deptId ?? 0,
          SONO: '',
          CUSTID: '',
          LOCATIONID: '',
          SALEMAN: 'SaleMan',
          SODATE: currentDate,
          DELIVERYDATE: currentDate,
          PLACEDELIVERY: '',
          RECEIVEHOUR: getCurrentTimeToString(),
          STATUS: OrderStatus.New,
        };
    dispatch(SoActions.updateHeader(model));
    if (so?.STATUS === OrderStatus.Posted) {
      navigation.navigate(ScreenType.SO.SUMMARY);
    } else {
      navigation.navigate(ScreenType.SO.CREATE_CUSTOMER);
    }
  };

  return (
    <SafeView>
      <Header
        title={AppStrings.SO.title}
        isMenu
        onMenuPress={() => setFilterVisible(true)}
      />
      <Container>
        <SearchBox<ISoDetail>
          placeholder={AppStrings.SO.search}
          dataSource={data}
          accessor="key"
          onSearch={(dataFilter) => dataFilter && setSoData(dataFilter)}
        />
        <SoFilter
          currentValue={soFilter.status ?? OrderStatus.New}
          onChange={(value) => setSoFilter({...soFilter, status: value})}
        />
        <SoListOrder
          data={soData}
          onSelect={(soDetail) => handleSelect(soDetail)}
        />
      </Container>
      <CircleButton onPress={() => handleSelect(undefined)} />
      <ModalFilter
        title={AppStrings.SO.modalFilterTitle}
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        fromDate={soFilter.fromDate!}
        toDate={soFilter.toDate!}
        onDateChange={(strDate, type) => {
          const obj = {...soFilter};
          obj[type] = strDate;
          setSoFilter(obj);
        }}
        onFilter={() => fetchSoList()}
      />
    </SafeView>
  );
};

export default SoListScreen;
