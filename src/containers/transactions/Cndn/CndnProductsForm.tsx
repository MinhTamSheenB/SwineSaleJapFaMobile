/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CnDnStatus,
  ICndnDetailDtoItem,
  ICndnDetailModel,
} from '~/apis/types.service';
import {Button, CircleButton, FlatListCommon} from '~/components/commons';
import {ConfirmModal, Container} from '~/components/sections';
import {Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import GlobalActions from '~/redux/global/global.actions';
import {RootState} from '~/redux/reducers';
import CndnProductItem from './CndnProductItem';

const CndnProductsForm = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const {items, model} = useSelector((state: RootState) => state.cndn);

  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [dto, setDto] = React.useState<ICndnDetailDtoItem>();

  const handleSelect = (item: ICndnDetailDtoItem | undefined) => {
    const modelItem: ICndnDetailModel = {
      PROD_QTY: 0,
      PROD_ID: '',
      PROD_PRICE: 0,
      STATUS: CnDnStatus.New,
      CNDNNO: model.CNDNNO,
      UNITID: model.UNITID,
      REGIONID: model.REGIONID,
      OFFICEID: model.OFFICEID,
      DEPTID: model.DEPTID,
    };
    if (item) {
      modelItem.CNDNDTID = item.CNDNDTID;
      modelItem.PROD_QTY = item.PROD_QTY ?? 0;
      modelItem.PROD_ID = item.PROD_ID ?? '';
      modelItem.PROD_NAME = item.PROD_NAME;
      modelItem.PROD_UOM = item.PROD_UOM;
      modelItem.PROD_PRICE = item.PROD_PRICE ?? 0;
      modelItem.STATUS = item.STATUS;
      modelItem.CNDNNO = item.CNDNNO;
      modelItem.UNITID = item.UNITID;
      modelItem.REGIONID = item.REGIONID;
      modelItem.OFFICEID = item.OFFICEID;
      modelItem.DEPTID = item.DEPTID;
    }
    navigate.navigate(ScreenType.Cndn.ADD_PRODUCT, {item: modelItem});
  };

  const handleDelete = (item: ICndnDetailDtoItem | undefined) => {
    setIsVisible(false);
    if (item) {
      dispatch(
        CndnActions.deleteDetail(model.CNDNNO ?? '', item.CNDNDTID ?? 0, true),
      );
    }
  };

  return (
    <>
      <Container>
        <FlatListCommon
          data={items}
          isShowVertical={false}
          renderItem={({item}) => (
            <CndnProductItem
              item={item}
              onDelete={() => {
                setDto(item);
                setIsVisible(true);
              }}
              onSelect={() => handleSelect(item)}
            />
          )}
          footer={
            <View style={{marginTop: 20}}>
              <Button
                title="Tiếp tục"
                color={Colors.WHITE}
                onPress={() => {
                  if (items.length < 1) {
                    dispatch(
                      GlobalActions.openErrorInfoModal(
                        'Vui lòng thêm sản phẩm điều chỉnh.',
                        'WARNING',
                      ),
                    );
                  } else {
                    // navigate.navigate(ScreenType.Cndn.SUMMARY, {
                    //   cndnNo: model.CNDNNO,
                    // });
                    navigate.navigate(ScreenType.Cndn.TOTAL_PAYMENT);
                  }
                }}
              />
            </View>
          }
        />
      </Container>

      <CircleButton onPress={() => handleSelect(undefined)} />
      <ConfirmModal
        onAccept={() => handleDelete(dto)}
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
      />
    </>
  );
};

export default CndnProductsForm;
