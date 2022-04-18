import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Header, Container, SearchBox} from '~/components/sections';
import {AppStrings} from '~/configs';
import {DoFilter, DoListOrder} from '~/containers/transactions/Do';
import {CircleButton, SafeView} from '~/components/commons';
import ScreenType from '~/navigations/screen.constant';
import DoActions from '~/redux/do/do.actions';
import {
  DeliveryOrderStatus,
  IDoFilterModel,
  IDoHeaderModel,
  IDoItem,
} from '~/apis/types.service';
import {RootState} from '~/redux/reducers';
import {
  getCurrentDateToString,
  getCurrentTimeToString,
} from '~/helpers/DatetimeHelpers';
import {ModalFilter} from '~/containers/transactions/So';
import MasterActions from '~/redux/master/master.actions';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';
import {MenuPermission} from '~/commons';

const DoListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const {userParams, isInternalTransfer, drawerId, drawerTitle} = useSelector(
    (state: RootState) => state.global,
  );
  const {data} = useSelector((state: RootState) => state.dos);

  // local state
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [doLocalData, setDoLocalData] = useState<IDoItem[]>([]);
  const [doFilterModel, setDoFilterModel] = useState<IDoFilterModel>(() => {
    return {
      ...userParams,
      status: DeliveryOrderStatus.New,
      loadScaleHeader: false,
      loadDetail: false,
      fromDate: FROM_DATE,
      toDate: TO_DATE,
    };
  });

  const searchDo = useCallback((): void => {
    setIsVisible(false);
    const loadDoRel = drawerId === MenuPermission.DO_RELEASE_MENU_ID;
    const filter: IDoFilterModel = {...doFilterModel, ...userParams, loadDoRel};
    dispatch(DoActions.search(filter));
  }, [dispatch, doFilterModel, drawerId, userParams]);

  React.useEffect(() => {
    searchDo();
  }, [searchDo]);

  React.useEffect(() => {
    setDoLocalData(data);
  }, [data]);

  React.useEffect(() => {
    dispatch(MasterActions.getSaleLocation());
  }, [dispatch]);

  const handleNavigate = () => {
    const model: IDoHeaderModel = {
      REGIONID: userParams.regionId ?? '',
      OFFICEID: userParams.officeId ?? 0,
      DEPTID: userParams.deptId ?? 0,
      UNITID: userParams.unitId ?? '',
      DONO: '',
      SONO: isInternalTransfer ? 'INTERNAL' : '',
      DODATE: getCurrentDateToString(),
      LOCATIONID: '',
      CUSTID: '',
      PLACEDELIVERY: '',
      TRUCK_NO: '',
      RECEIVEHOUR: getCurrentTimeToString(),
      RECEIVERNAME: '',
      RECEIVERPHONE: '',
      SALEMAN: '',
      SALESPV: '',
      CUSTNAME: '',
      TOTALAMTAFTERVAT: 0,
      SKIP_SCALE_QTY_VALID: false,
      STATUS: DeliveryOrderStatus.New,
      UPDATEDBY: userParams.userId ?? '',
    };
    dispatch(DoActions.updateHeaderInfoModelState(model));
    navigate.navigate(ScreenType.DO.CREATE_ORDER);
  };

  return (
    <SafeView>
      <Header
        // title={
        //   isInternalTransfer ? AppStrings.IN_TF.title : AppStrings.DO.title
        // }
        title={drawerTitle}
        isMenu
        onMenuPress={() => setIsVisible(true)}
      />
      <Container>
        <SearchBox
          placeholder={AppStrings.DO.search}
          accessor="key"
          dataSource={data}
          onSearch={(dataSearch) => setDoLocalData(dataSearch!)}
        />
        <DoFilter
          currentValue={doFilterModel.status ?? DeliveryOrderStatus.New}
          onChange={(status) => setDoFilterModel({...doFilterModel, status})}
        />
        <DoListOrder
          data={doLocalData}
          onSelect={(item) => {
            if (item.STATUS === DeliveryOrderStatus.New) {
              dispatch(DoActions.getHeaderInfo(item.DONO, true));
            } else {
              dispatch(DoActions.getHeaderInfo(item.DONO, false));
              navigate.navigate(ScreenType.DO.SUMMARY);
            }
          }}
        />
      </Container>
      {isInternalTransfer && <CircleButton onPress={() => handleNavigate()} />}
      <ModalFilter
        title={AppStrings.DO.titleModalSeach}
        isVisible={isVisible}
        fromDate={doFilterModel.fromDate!}
        toDate={doFilterModel.toDate!}
        onClose={() => setIsVisible(false)}
        onDateChange={(strDate, type) => {
          const obj: IDoFilterModel = {...doFilterModel};
          obj[type] = strDate;
          setDoFilterModel(obj);
        }}
        onFilter={searchDo}
      />
    </SafeView>
  );
};

export default DoListScreen;
