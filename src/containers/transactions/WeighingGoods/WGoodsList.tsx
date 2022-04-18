import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {
  IWeighingGoodsItemDTO,
  IWeighingGoodsModel,
  WeighingGoodsStatus,
} from '~/apis/types.service';
import {FlatListCommon, TagButton} from '~/components/commons';
import {Container} from '~/components/sections';
import {RootState} from '~/redux/reducers';
import wGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';
import ScreenType from '~/navigations/screen.constant';
import WGoodsItem from './WGoodsItem';

export interface IProps {
  unitId?: string;
  fromDate: string;
  toDate: string;
  locationId?: string;
}

const WGoodsList = ({unitId, fromDate, toDate, locationId}: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {wGoodsData} = useSelector((state: RootState) => state.wGoods);
  const {userParams} = useSelector((state: RootState) => state.global);

  const [status, setStatus] = useState<number | undefined>(undefined);

  const handleGetWList = useCallback(() => {
    dispatch(
      wGoodsActions.getWGoodsList(fromDate, toDate, status, unitId, locationId),
    );
  }, [dispatch, fromDate, locationId, status, toDate, unitId]);

  useEffect(() => {
    handleGetWList();
  }, [handleGetWList]);

  const convertWGoodsItemToModel = (
    item: IWeighingGoodsItemDTO,
  ): IWeighingGoodsModel => {
    const model: IWeighingGoodsModel = {
      REGIONID: item.REGIONID ?? userParams.regionId ?? '',
      ARRIVALTIME: item.ARRIVALTIME,
      COMNO: item.COMNO,
      CREATEDBY: item.CREATEDBY,
      CREATEDDATE: item.CREATEDDATE,
      UPDATEDBY: item.UPDATEDBY,
      UPDATEDDATE: item.UPDATEDDATE,
      CUSTADD: item.CUSTADD,
      CUSTID: item.CUSTID,
      CUSTNAME: item.CUSTNAME,
      DEPARTTIME: item.DEPARTTIME,
      DONO: item.DONO,
      SONO: item.DOHEADER?.SONO,
      KMARRIVED: item.KMARRIVED,
      KMSTART: item.KMSTART,
      REMAKS: item.REMAKS,
      SCALEDATE: item.SCALEDATE,
      SCALEID: item.SCALEID,
      SEALCONDITION: item.SEALCONDITION,
      SEALNUMBER: item.SEALNUMBER,
      STATUS: item.STATUS,
      TEMP_WS_NO: item.TEMP_WS_NO,
      TRUCKNO: item.TRUCKNO,
      UNITID: item.UNITID,
      USERNAME: item.USERNAME,
      WEIGHMAN: item.WEIGHMAN,
      WEIGHTTYPE: item.WEIGHTTYPE,
      LOCATION_NAME: item.LOCATIONNAME,
      TOTAL_BW_DO: item.DOHEADER?.BW_TOTAL ?? 0,
      TOTAL_QTY_DO: item.DOHEADER?.TOTALQTY ?? 0,
    };
    return model;
  };

  const onSelectItem = async (item: IWeighingGoodsItemDTO) => {
    const model = convertWGoodsItemToModel(item);
    await dispatch(wGoodsActions.updateLocalHeaderModel(model, true));
    await dispatch(
      wGoodsActions.getItemsByScaleId(item.SCALEID!, model.REGIONID ?? ''),
    );
    navigate.navigate(ScreenType.WeighingGoods.CREATE);
  };

  return (
    <Container>
      <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
        <TagButton
          text="Tất cả"
          isActive={status === undefined}
          onPress={() => setStatus(undefined)}
        />
        <TagButton
          text="Chưa chốt"
          isActive={status === 1}
          onPress={() => setStatus(1)}
        />
        <TagButton
          text="Đã chốt"
          isActive={status === 2}
          onPress={() => setStatus(2)}
        />
      </View>
      <FlatListCommon
        isShowVertical={false}
        contentContainerStyle={{paddingVertical: 10}}
        data={wGoodsData ?? []}
        renderItem={({item}: {item: IWeighingGoodsItemDTO}) => {
          return (
            <WGoodsItem
              onSelectItem={() => onSelectItem(item)}
              doNo={item.DONO}
              isLocked={
                !!(item.STATUS && item.STATUS === WeighingGoodsStatus.Uploaded)
              }
              tempWsNo={item.SCALENO}
              custName={item.CUSTNAME}
              isUploaded
              isShowUpload={false}
              createdOn={item.SCALEDATE ?? ''}
              qty={item.TOTALQTY}
              bw={item.TOTALBW}
              farmName={item.LOCATIONNAME}
            />
          );
        }}
      />
    </Container>
  );
};

export default WGoodsList;
