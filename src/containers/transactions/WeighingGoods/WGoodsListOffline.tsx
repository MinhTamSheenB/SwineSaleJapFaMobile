/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {IWeighingGoodsItemDTO, IWeighingGoodsModel} from '~/apis/types.service';
import {FlatListCommon} from '~/components/commons';
import {Container} from '~/components/sections';
import {RootState} from '~/redux/reducers';
import wGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';
import ScreenType from '~/navigations/screen.constant';
import {deliveryOrderDatabase} from '~/databases';
import WGoodsItem from './WGoodsItem';

const WGoodsListOffline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {wGoodsDataOffline} = useSelector((state: RootState) => state.wGoods);

  const getDataSource = useCallback(() => {
    dispatch(wGoodsActions.getScaleTempDataOffline());
  }, [dispatch]);

  useEffect(() => {
    getDataSource();
  }, [getDataSource]);

  const convertWGoodsItemToModel = async (
    item: IWeighingGoodsItemDTO,
  ): Promise<IWeighingGoodsModel> => {
    const doItem = await deliveryOrderDatabase.getOrderByDoNo(item.DONO!);

    const model: IWeighingGoodsModel = {
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
      LOCATIONNAME: item.LOCATIONNAME,
      LOCATION_NAME: item.LOCATIONNAME,
      TOTAL_BW_DO: doItem?.BW_TOTAL,
      TOTAL_QTY_DO: doItem?.TOTALQTY,
    };
    return model;
  };

  const onSelectItem = async (item: IWeighingGoodsItemDTO) => {
    const model = await convertWGoodsItemToModel(item);
    await dispatch(wGoodsActions.updateHeaderModelOffline(model, true));
    await dispatch(wGoodsActions.getDetailsOffline(item.SCALEID!));
    navigate.navigate(ScreenType.WeighingGoods.CREATE_OFFLINE);
  };

  const handleUploadScaleTemp = (item: IWeighingGoodsItemDTO) => {
    if (item.SCALEID && item.SCALEID > 0)
      dispatch(wGoodsActions.uploadScaleTempOffline(item.SCALEID));
  };

  return (
    <Container>
      <FlatListCommon
        onRefresh={getDataSource}
        isShowVertical={false}
        contentContainerStyle={{paddingVertical: 10}}
        data={wGoodsDataOffline ?? []}
        renderItem={({item}: {item: IWeighingGoodsItemDTO}) => (
          <WGoodsItem
            onSelectItem={() => onSelectItem(item)}
            onUpload={() => handleUploadScaleTemp(item)}
            doNo={item.DONO}
            isLocked={!!(item.IS_LOCKED && item.IS_LOCKED > 0)}
            isUploaded={
              !!(item.SCALE_ONLINE_ID !== undefined && item.SCALE_ONLINE_ID > 0)
            }
            tempWsNo={item.SCALENO}
            custName={item.CUSTNAME}
            isShowUpload
            createdOn={item.SCALEDATE ?? ''}
            farmName={item.LOCATIONNAME}
            bw={item.SUM_WEIGHT}
            qty={item.SUM_QTY}
          />
        )}
      />
    </Container>
  );
};

export default WGoodsListOffline;
