/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {DiscountStatus, IDiscountItemDTO} from '~/apis/types.service';
import {TextCustom} from '~/components/commons';
import {Row, RowLabelIcon} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {formatDate} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps extends TouchableOpacityProps {
  item: IDiscountItemDTO;
}

const DiscountItem = ({item, onPress, onLongPress}: IProps) => {
  const bgColor =
    item.STATUS === DiscountStatus.Approved ? Colors.SUCCESS : Colors.ORIGIN;
  const textStatus =
    item.STATUS === DiscountStatus.Approved ? 'Đã duyệt' : 'Chưa duyệt';
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.container}>
        <Row isSmall>
          <TextCustom bold>{`[${item.DISCOUNTID.toString().padStart(8, '0')}] ${
            item.UNITNAME
          }`}</TextCustom>
        </Row>
        <RowLabelIcon
          iconName="calendar"
          iconType="FontAwesome"
          value={formatDate(item.TDATE, 'date')}
        />
        <RowLabelIcon
          iconName="users"
          iconType="FontAwesome"
          value={`${item.CUSTID} - ${item.CUSTNAME}`}
        />
        <RowLabelIcon
          iconName="usd"
          iconType="FontAwesome"
          value={numberFormat(item.AMOUNT, 'VNĐ')}
        />
        <RowLabelIcon
          iconName="th-list"
          iconType="FontAwesome"
          value={item.DISCOUNTTYPENAME}
        />
        <RowLabelIcon
          iconName="edit"
          iconType="FontAwesome"
          value={`${item.NOTES ?? '--- --- ---'}`}
        />
        <View style={[styles.viewStatus, {backgroundColor: bgColor}]}>
          <TextCustom style={styles.textStatus}>{textStatus}</TextCustom>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DiscountItem;
const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.ORIGIN,
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    elevation: 1,
    marginBottom: 15,
  },
  viewStatus: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: Colors.SUCCESS,
    borderRadius: 10,
  },
  textStatus: {
    color: Colors.WHITE,
    fontSize: Sizes.Note,
  },
});
