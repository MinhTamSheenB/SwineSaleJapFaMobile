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
        <Accordion title="Phi???u Giao H??ng" isOpen>
          <RowLabelValue
            label="M?? phi???u c??n:"
            value={
              wGoodModel?.SCALENO ??
              wGoodModel?.DONO?.replace('DO', 'ON') ??
              STRING_EMPTY
            }
          />
          <RowLabelValue
            label="????n h??ng:"
            value={wGoodModel?.SONO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Phi???u xu???t kho:"
            value={wGoodModel?.DONO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Kh??ch h??ng:"
            value={wGoodModel?.CUSTNAME ?? STRING_EMPTY}
          />

          <RowLabelValue
            label="S??? xe:"
            value={wGoodModel?.TRUCKNO ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Tr???i xu???t:"
            value={wGoodModel?.LOCATION_NAME ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Ng??y xu???t:"
            value={convertStringDateToDdMmYyyy(wGoodModel?.SCALEDATE, 'date')}
          />
          <RowLabelValue
            label="Nv C??n:"
            value={wGoodModel?.WEIGHMAN ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="S??? seal:"
            value={wGoodModel?.SEALNUMBER ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="T??nh tr???ng seal:"
            value={wGoodModel?.SEALCONDITION ?? STRING_EMPTY}
          />
          <RowLabelValue
            label="Ghi ch??:"
            value={wGoodModel?.REMAKS ?? STRING_EMPTY}
          />
          <Row isSmall>
            <Column>
              <View>
                <TextCustom isSmall>KM ?????n</TextCustom>
                <TextCustom>{numberFormat(wGoodModel?.KMSTART, '')}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>KM ??i</TextCustom>
                <TextCustom>
                  {numberFormat(wGoodModel?.KMARRIVED, '')}
                </TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Gi??? v??o</TextCustom>
                <TextCustom>
                  {convertStringDateToDdMmYyyy(wGoodModel?.DEPARTTIME, 'time')}
                </TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Gi??? ra</TextCustom>
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
