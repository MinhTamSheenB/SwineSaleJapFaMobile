/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Accordion, TextCustom} from '~/components/commons';
import {
  Column,
  ConfirmModal,
  Container,
  Row,
  RowLabelValue,
} from '~/components/sections';
import {RootState} from '~/redux/reducers';
import wGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';
import ScreenType from '~/navigations/screen.constant';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import WeighingGoodsItems from './WeighingGoodsItems';
import WeighingGoodsUserActions, {
  wGoodsActionType,
} from './WeighingGoodsUserActions';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';

const STRING_EMPTY = '--- --- ---';

interface IProps {
  navigate: () => void;
}

const WeighingGoodsSummaryOffline = ({navigate}: IProps) => {
  const dispatch = useDispatch();

  const {starPrinter} = useSelector((state: RootState) => state.setting);
  const {wOfflineModel, detailsOffline} = useSelector(
    (state: RootState) => state.wGoods,
  );

  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<wGoodsActionType>();

  const onUserAction = (type: wGoodsActionType) => {
    switch (type) {
      case 'DELETE': {
        setIsConfirm(true);
        setCurrentAction('DELETE');
        break;
      }
      case 'POST_UNPOST': {
        setIsConfirm(true);
        setCurrentAction('POST_UNPOST');
        break;
      }
      case 'WGOODS_LIST': {
        navigate();
        break;
      }
      default:
        break;
    }
  };

  const onAccept = () => {
    setIsConfirm(false);
    if (!wOfflineModel) return;
    switch (currentAction) {
      case 'DELETE': {
        dispatch(
          wGoodsActions.deleteHeaderOffline(
            wOfflineModel?.SCALEID!,
            wOfflineModel.DONO!,
            true,
            {
              isNavigate: true,
              screen: ScreenType.WeighingGoods.DO_LIST_OFFLINE,
            },
          ),
        );
        break;
      }
      case 'POST_UNPOST': {
        dispatch(
          wGoodsActions.lockUnlockScaleOffline(wOfflineModel.SCALEID!, true),
        );
        break;
      }
      default:
        break;
    }
  };

  const onPrint = (num: number) => {
    dispatch(wGoodsActions.printBill(detailsOffline, true, num, wOfflineModel));
  };

  return (
    <>
      <Container isIncludeScrollView>
        <Accordion title="Phiếu Giao Hàng" isOpen>
          <RowLabelValue
            label="Mã phiếu cân:"
            value={
              wOfflineModel?.SCALENO ??
              wOfflineModel?.DONO?.replace('DO', 'OFF') ??
              STRING_EMPTY
            }
          />
          <RowLabelValue
            label="Đơn hàng:"
            value={wOfflineModel?.SONO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Phiếu xuất kho:"
            value={wOfflineModel?.DONO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Khách hàng:"
            value={wOfflineModel?.CUSTNAME ?? STRING_EMPTY}
          />

          <RowLabelValue
            label="Số xe:"
            value={wOfflineModel?.TRUCKNO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Trại xuất:"
            value={wOfflineModel?.LOCATION_NAME ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Ngày xuất:"
            value={convertStringDateToDdMmYyyy(
              wOfflineModel?.SCALEDATE,
              'date',
            )}
          />
          <RowLabelValue
            label="Nv Cân:"
            value={wOfflineModel?.WEIGHMAN ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Số seal:"
            value={wOfflineModel?.SEALNUMBER ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Tình trạng seal:"
            value={wOfflineModel?.SEALCONDITION ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Ghi chú:"
            value={wOfflineModel?.REMAKS ?? STRING_EMPTY}
          />
          <Row isSmall>
            <Column>
              <View>
                <TextCustom isSmall>KM đến</TextCustom>
                <TextCustom>
                  {numberFormat(wOfflineModel?.KMSTART, '')}
                </TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>KM đi</TextCustom>
                <TextCustom>
                  {numberFormat(wOfflineModel?.KMARRIVED, '')}
                </TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Giờ vào</TextCustom>
                <TextCustom>{wOfflineModel?.DEPARTTIME}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Giờ ra</TextCustom>
                <TextCustom>{wOfflineModel?.ARRIVALTIME}</TextCustom>
              </View>
            </Column>
          </Row>
        </Accordion>
        <WeighingGoodsItems
          items={detailsOffline}
          totalQty={wOfflineModel?.TOTAL_QTY_DO ?? 0}
          totalBw={wOfflineModel?.TOTAL_BW_DO ?? 0}
        />
      </Container>
      <WeighingGoodsUserActions
        onUserAction={(action) => onUserAction(action)}
        onPrint={(num) => onPrint(num)}
        isLock={!!(wOfflineModel?.IS_LOCKED && wOfflineModel.IS_LOCKED > 0)}
        printerName={starPrinter?.portName}
      />

      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => setIsConfirm(false)}
        onAccept={() => onAccept()}
      />
    </>
  );
};

export default WeighingGoodsSummaryOffline;
