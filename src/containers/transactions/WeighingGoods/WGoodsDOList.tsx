/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View} from 'react-native';
import {
  IDoFilterModel,
  IDoItem,
  IWeighingGoodsModel,
} from '~/apis/types.service';
import {Colors} from '~/configs';
import {navigate} from '~/navigations/navigation.services';
import ScreenType from '~/navigations/screen.constant';
import WGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';
import {RootState} from '~/redux/reducers';
import {
  getCurrentDateToString,
  getCurrentTimeToString,
} from '~/helpers/DatetimeHelpers';
import {FlatListCommon, CircleButton} from '~/components/commons';
import DoItem from '../Do/DoItem';
import {SearchBox} from '~/components/sections';

export interface IProps {
  locationId?: string;
  unitId?: string;
  fromDate: string;
  toDate: string;
}

const WGoodsDOList = ({locationId, unitId, fromDate, toDate}: IProps) => {
  const dispatch = useDispatch();
  const [doLocalData, setDoLocalData] = useState<IDoItem[]>([]);
  const {doData} = useSelector((state: RootState) => state.wGoods);
  const {userParams} = useSelector((state: RootState) => state.global);

  const getDoData = useCallback(
    (isStore = false) => {
      const filter: IDoFilterModel = {
        userId: userParams.userId,
        deptId: undefined,
        loadScaleHeader: false,
        loadDetail: false,
        loadDoDetail: false,
        fromDate,
        toDate,
      };
      dispatch(WGoodsActions.getListDo(filter, isStore));
    },
    [dispatch, fromDate, toDate, userParams.userId],
  );

  const handleFilterDo = useCallback(() => {
    let newLocalData: IDoItem[] = doData;
    if (locationId) {
      newLocalData = newLocalData.filter((p) => p.LOCATIONID === locationId);
    }
    if (unitId) {
      newLocalData = newLocalData.filter((p) => p.UNITID === unitId);
    }
    setDoLocalData(newLocalData);
  }, [doData, locationId, unitId]);

  useEffect(() => {
    getDoData(false);
  }, [getDoData]);

  useEffect(() => {
    handleFilterDo();
  }, [handleFilterDo]);

  const convertDoItemToWeighingGoodsModel = (
    doItem: IDoItem,
  ): IWeighingGoodsModel => {
    const wGoodsModel: IWeighingGoodsModel = {
      REGIONID: doItem.REGIONID,
      DONO: doItem.DONO,
      SONO: doItem.SONO,
      SCALEDATE: getCurrentDateToString(),
      ARRIVALTIME: getCurrentTimeToString(),
      DEPARTTIME: getCurrentTimeToString(),
      KMSTART: 0.0,
      KMARRIVED: 0.0,
      UNITID: doItem.UNITID,
      CUSTNAME: doItem.CUSTNAME,
      CUSTID: doItem.CUSTID,
      CUSTADD: doItem.CUSTADDRESS ?? '',
      USERNAME: userParams.userId,
      CREATEDBY: userParams.userId,
      WEIGHMAN: userParams.fullName,
      TRUCKNO: doItem.TRUCK_NO ?? '',
      LOCATION_NAME: doItem.LOCATIONNAME,
      TOTAL_BW_DO: doItem.BW_TOTAL ?? 0,
      TOTAL_QTY_DO: doItem.TOTALQTY ?? 0,
    };
    return wGoodsModel;
  };

  const onSelectDo = (doItem: IDoItem) => {
    const model = convertDoItemToWeighingGoodsModel(doItem);
    dispatch(WGoodsActions.updateLocalHeaderModel(model, true));
    setTimeout(() => {
      navigate(ScreenType.WeighingGoods.CREATE);
    }, 1000);
  };

  return (
    <>
      <View style={{marginHorizontal: 10}}>
        <SearchBox
          dataSource={doData}
          accessor="DONO"
          onSearch={(searchData) => setDoLocalData(searchData ?? [])}
          placeholder="Nhập số DO để tìm kiếm."
        />
      </View>
      <FlatListCommon
        data={doLocalData}
        isShowVertical
        onRefresh={() => getDoData()}
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 10}}
        renderItem={({item}: {item: IDoItem}) => (
          <DoItem
            doNo={item.DONO}
            soNo={item.SONO}
            custName={item.CUSTNAME}
            qty={item.TOTALQTY}
            bw={item.BW_TOTAL ?? 0}
            onPress={() => onSelectDo(item)}
            doDate={item.DODATE}
            farmName={item.LOCATIONNAME}
          />
        )}
      />
      <CircleButton
        iconName="download"
        iconColor={Colors.BLACK}
        onPress={() => {
          getDoData(true);
        }}
      />
    </>
  );
};

export default WGoodsDOList;
