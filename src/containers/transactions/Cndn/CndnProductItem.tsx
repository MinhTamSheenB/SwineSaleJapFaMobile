/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ICndnDetailDtoItem} from '~/apis/types.service';
import {RowLabelValue} from '~/components/sections';
import {Colors} from '~/configs';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  item: ICndnDetailDtoItem;
  onSelect?: () => void;
  onDelete?: () => void;
}
const CndnProductItem = ({item, onSelect, onDelete}: IProps) => {
  return (
    <TouchableOpacity onPress={onSelect} onLongPress={onDelete}>
      <View style={styles.productContainer}>
        <RowLabelValue label="Số hóa đơn:" value={item.CNDNNO ?? ''} />
        <RowLabelValue label="Mã hàng:" value={item.PROD_ID ?? ''} />
        <RowLabelValue label="Tên hàng:" value={item.PROD_NAME ?? ''} isBold />
        <RowLabelValue label="Đơn vị tính:" value={item.PROD_UOM ?? ''} />
        <RowLabelValue
          label="Số Lượng:"
          value={numberFormat(item.PROD_QTY, '')}
        />
        <RowLabelValue label="Đơn giá:" value={numberFormat(item.PROD_PRICE)} />
        <RowLabelValue
          label="Thành tiền:"
          value={numberFormat(item.PROD_AMOUNT)}
          isBold
        />
        <RowLabelValue
          label="Diễn giải:"
          value={item.NOTES ?? '--- --- --- ---'}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CndnProductItem;
const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: Colors.WHITE,
    borderLeftColor: Colors.ORIGIN,
    borderLeftWidth: 4,
    marginTop: 15,
    elevation: 1,
    paddingVertical: 10,
  },
});
