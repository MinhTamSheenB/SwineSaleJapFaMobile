/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {CnDnStatus, ICndnDtoItem} from '~/apis/types.service';
import {TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {AppStrings, Colors, Sizes} from '~/configs';
import {formatDate} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import GlobalActions from '~/redux/global/global.actions';

export interface IProps {
  item: ICndnDtoItem;
  onPress?: () => void;
  onLongPress?: () => void;
}

const CndnItem = ({item, onPress, onLongPress}: IProps) => {
  const {STATUS} = item;
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (STATUS !== CnDnStatus.New) {
      return dispatch(
        GlobalActions.openErrorInfoModal(
          AppStrings.Cndn.unDeleteMessage,
          'WARNING',
        ),
      );
    }
    return onLongPress && onLongPress();
  };

  return (
    <TouchableWithoutFeedback onLongPress={handleDelete} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextCustom bold>{item.CNDNNO}</TextCustom>
          <TextCustom style={styles.date}>
            {formatDate(item.CNDNDATE, 'date')}
          </TextCustom>
        </View>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.label}>Khách hàng:</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{item.CUSTNAME} </TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.label}>Địa chỉ:</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{item.CUSTADDRESS}</TextCustom>
          </Column>
        </Row>
        {/* <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.label}>Mã số thuế:</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{item.CUSTTAXCODE}</TextCustom>
          </Column>
        </Row> */}
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.label}>Số lượng:</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{numberFormat(item.TOTALQTY, 'CON')}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.label}>Tổng tiền:</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{numberFormat(item.TOTALAMT)}</TextCustom>
          </Column>
        </Row>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CndnItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderLeftWidth: 5,
    borderLeftColor: Colors.ORIGIN,
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.BORDER_DARK,
  },
  label: {
    color: Colors.GRAY_LIGHT,
    fontSize: Sizes.Content,
    fontStyle: 'italic',
  },
  date: {
    color: Colors.GRAY,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
