/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {IWeighingGoodsDetailDTO} from '~/apis/types.service';
import {TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {
  convertDdMmYyyyToDate,
  convertStringDateToDdMmYyyy,
  formatDate,
} from '~/helpers/DatetimeHelpers';
import {doubleFormat, numberFormat, scaleFactor} from '~/helpers/UtilitiesHelper';

export interface IProps {
  onSelectedItem?: (item: IWeighingGoodsDetailDTO) => void;
  onDeleteItem?: (item: IWeighingGoodsDetailDTO) => void;
  item: IWeighingGoodsDetailDTO;
  index?: number;
}

const WeighGoodsItem = ({
  onSelectedItem,
  onDeleteItem,
  item,
  index,
}: IProps) => {
  const getProductName = (): string => {
    const productDown =
      item.PRODUCTDOWN && item.PRODUCTDOWNDESC
        ? ` (${item.PRODUCTDOWNDESC})`
        : '';
    return `[${item?.PRODUCTCODE}] ${item.PRODUCTNAME}${productDown}`;
  };

  return (
    <TouchableOpacity
      key={`item-${index}`}
      onPress={() => onSelectedItem && onSelectedItem(item)}
      onLongPress={() => onDeleteItem && onDeleteItem(item)}>
      <View style={styles.productContainer}>
        <Row isSmall>
          <Column>
            <TextCustom style={{textTransform: 'capitalize'}}>
              {getProductName()}
            </TextCustom>
          </Column>
        </Row>
        <View>
          <TextCustom style={styles.date}>
            {convertStringDateToDdMmYyyy(item.CREATEDDATE, 'datetime')}
          </TextCustom>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            backgroundColor: '#f1f1f1',
            marginHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TextCustom isSmall>Số Lượng</TextCustom>
            <TextCustom>{numberFormat(item?.QTY, 'Con')}</TextCustom>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <TextCustom isSmall>KL Tổng</TextCustom>
            <TextCustom>{doubleFormat(item?.GWEIGHT, 'Kg')}</TextCustom>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <TextCustom isSmall>KL bình quân</TextCustom>
            <TextCustom>{doubleFormat(item?.AVGBW, 'Kg')}</TextCustom>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WeighGoodsItem;
const styles = StyleSheet.create({
  container: {},
  productContainer: {
    backgroundColor: Colors.WHITE,
    borderLeftColor: Colors.ORIGIN,
    borderLeftWidth: 4,
    marginBottom: 10,
    elevation: 1,
    paddingVertical: 10,
  },
  date: {
    fontSize: scaleFactor(11),
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
});
