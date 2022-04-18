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
import {WeighingGoodsStatus} from '~/apis/types.service';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import WeighingGoodsItems from './WeighingGoodsItems';
import WeighingGoodsUserActions from './WeighingGoodsUserActions';

type wGoodsActionType = 'POST_UNPOST' | 'DELETE' | 'PRINT' | 'WGOODS_LIST';
const STRING_EMPTY = '--- --- ---';

interface IProps {
  navigate: () => void;
}

const WeighingGoodsSummary = ({navigate}: IProps) => {
  const dispatch = useDispatch();
  const {starPrinter} = useSelector((state: RootState) => state.setting);
  const {wGoodModel, items} = useSelector((state: RootState) => state.wGoods);
  const {userParams} = useSelector((state: RootState) => state.global);
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
    if (!wGoodModel) return;
    switch (currentAction) {
      case 'DELETE': {
        dispatch(
          wGoodsActions.deleteHeader(wGoodModel?.SCALEID!, true, {
            isNavigate: true,
            screen: ScreenType.WeighingGoods.DO_LIST,
          }),
        );
        break;
      }
      case 'POST_UNPOST': {
        dispatch(
          wGoodsActions.uploadOrReturn(
            wGoodModel.SCALEID!,
            wGoodModel.SCALEID!.toString(),
            wGoodModel.STATUS!,
            true,
            undefined,
            wGoodModel.REGIONID ?? userParams.regionId,
          ),
        );
        break;
      }
      default:
        break;
    }
  };

  const onPrint = (num: number) => {
    dispatch(wGoodsActions.printBill(items, false, num, wGoodModel));
  };

  return (
    <>
      <Container isIncludeScrollView>
        <Accordion title="Phiếu Giao Hàng" isOpen>
          <RowLabelValue
            label="Mã phiếu cân:"
            value={
              wGoodModel?.SCALENO ??
              wGoodModel?.DONO?.replace('DO', 'ON') ??
              STRING_EMPTY
            }
          />
          <RowLabelValue
            label="Đơn hàng:"
            value={wGoodModel?.SONO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Phiếu xuất kho:"
            value={wGoodModel?.DONO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Khách hàng:"
            value={wGoodModel?.CUSTNAME ?? STRING_EMPTY}
          />

          <RowLabelValue
            label="Số xe:"
            value={wGoodModel?.TRUCKNO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Trại xuất:"
            value={wGoodModel?.LOCATION_NAME ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Ngày xuất:"
            value={convertStringDateToDdMmYyyy(wGoodModel?.SCALEDATE, 'date')}
          />
          <RowLabelValue
            label="Nv Cân:"
            value={wGoodModel?.WEIGHMAN ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Số seal:"
            value={wGoodModel?.SEALNUMBER ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Tình trạng seal:"
            value={wGoodModel?.SEALCONDITION ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Ghi chú:"
            value={wGoodModel?.REMAKS ?? STRING_EMPTY}
          />
          <Row isSmall>
            <Column>
              <View>
                <TextCustom isSmall>KM đến</TextCustom>
                <TextCustom>{numberFormat(wGoodModel?.KMSTART, '')}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>KM đi</TextCustom>
                <TextCustom>
                  {numberFormat(wGoodModel?.KMARRIVED, '')}
                </TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Giờ vào</TextCustom>
                <TextCustom>
                  {convertStringDateToDdMmYyyy(wGoodModel?.DEPARTTIME, 'time')}
                </TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Giờ ra</TextCustom>
                <TextCustom>
                  {convertStringDateToDdMmYyyy(wGoodModel?.ARRIVALTIME, 'time')}
                </TextCustom>
              </View>
            </Column>
          </Row>
        </Accordion>

        <WeighingGoodsItems
          items={items}
          totalQty={wGoodModel?.TOTAL_QTY_DO ?? 0}
          totalBw={wGoodModel?.TOTAL_BW_DO ?? 0}
        />
      </Container>
      <WeighingGoodsUserActions
        isLock={
          !!(wGoodModel && wGoodModel.STATUS === WeighingGoodsStatus.Uploaded)
        }
        onUserAction={(type) => onUserAction(type)}
        onPrint={(val) => onPrint(val)}
        printerName={starPrinter ? starPrinter.portName : ''}
      />
      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => setIsConfirm(false)}
        onAccept={() => onAccept()}
      />
    </>
  );
};

export default WeighingGoodsSummary;
