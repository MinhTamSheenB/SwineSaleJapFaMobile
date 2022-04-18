/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IDoLocalItem} from '~/apis/types.service';
import {FlatListCommon} from '~/components/commons';
import {Container} from '~/components/sections';
import {RootState} from '~/redux/reducers';
import wGoodsAction from '~/redux/weighingGoods/weighing.goods.actions';
import DoItem from '../Do/DoItem';

export interface IProp {
  handleSelectItem?: (item: IDoLocalItem) => void;
}

const WeighingGoodsDoOffline = ({handleSelectItem}: IProp) => {
  const dispatch = useDispatch();
  const {dosOffline} = useSelector((state: RootState) => state.wGoods);

  const getDosFromLocalDb = useCallback(() => {
    dispatch(wGoodsAction.getDosOffline());
    dispatch(wGoodsAction.getProductsOffline());
  }, [dispatch]);

  useEffect(() => {
    getDosFromLocalDb();
  }, [getDosFromLocalDb]);

  return (
    <>
      <Container>
        <FlatListCommon
          isShowVertical={false}
          data={dosOffline}
          onRefresh={getDosFromLocalDb}
          renderItem={({item}: {item: IDoLocalItem}) => (
            <DoItem
              doNo={item.DONO}
              doDate={item.DODATE}
              soNo={item.SONO}
              custName={item.CUSTNAME}
              qty={item.TOTALQTY}
              bw={item.BW_TOTAL}
              farmName={item.LOCATIONNAME}
              onPress={() => handleSelectItem && handleSelectItem(item)}
            />
          )}
        />
      </Container>
    </>
  );
};

export default WeighingGoodsDoOffline;
