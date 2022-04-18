/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Sizes} from '~/configs';
import {formatDouble, numberFormat} from '~/helpers/UtilitiesHelper';

export interface IRowTitleValueProps {
  title: string;
  value: string;
  isBold?: boolean;
}
const RowTitleValue = ({title, value, isBold}: IRowTitleValueProps) => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text
        style={[styles.rowValue, {fontWeight: isBold ? 'bold' : undefined}]}>
        {value}
      </Text>
    </View>
  );
};

export interface IScaleDoDetailProps {
  doNo: string;
  farmName: string;
  customerName: string;
  totalQty: number;
  totalQtyWeighted: number;
  totalBwWeighted: number;
}

const ScaleDoDetail = ({
  doNo,
  farmName,
  customerName,
  totalQty,
  totalBwWeighted,
  totalQtyWeighted,
}: IScaleDoDetailProps) => {
  return (
    <View style={styles.container}>
      <RowTitleValue title="Mã DO" value={doNo} isBold />
      <RowTitleValue title="Trại/ Kho xuất" value={farmName} />
      <RowTitleValue title="Tên Khách Hàng" value={customerName} />
      <RowTitleValue
        title="Số Lượng Đặt"
        value={numberFormat(totalQty, 'Con')}
        isBold
      />
      <RowTitleValue
        title="Số Lượng Đã Cân"
        value={`${formatDouble(totalQtyWeighted)} Con`}
      />
      <RowTitleValue
        title="Trọng Lượng Đã Cân"
        value={`${formatDouble(totalBwWeighted)}  KG`}
      />
    </View>
  );
};

export default ScaleDoDetail;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.GRAY,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: Colors.GRAY_LIGHT,
    fontSize: Sizes.Content,
  },
  rowValue: {
    fontSize: Sizes.Title,
  },
});
