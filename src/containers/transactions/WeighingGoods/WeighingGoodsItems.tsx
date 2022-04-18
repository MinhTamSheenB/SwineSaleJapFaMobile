import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {IWeighingGoodsDetailDTO} from '~/apis/types.service';
import {Icon, TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {doubleFormat} from '~/helpers/UtilitiesHelper';
import WeighGoodsItem from './WeighingGoodsItem';

const styles = StyleSheet.create({
  accordionIcon: {
    color: Colors.GRAY,
    marginRight: 10,
    fontWeight: 'bold',
  },
  textSum: {
    color: Colors.DANGER,
    fontStyle: 'italic',
    fontSize: Sizes.Note,
    fontWeight: 'bold',
  },
});

export interface IProps {
  totalQty: number;
  totalBw: number;
  items: IWeighingGoodsDetailDTO[];
  onDeleteItem?: (item: IWeighingGoodsDetailDTO) => void;
  onSelectedItem?: (item: IWeighingGoodsDetailDTO) => void;
}

const WeighingGoodsItems = ({
  items,
  totalBw,
  totalQty,
  onDeleteItem,
  onSelectedItem,
}: IProps) => {
  const getSummaryWeighingGoods = () => {
    const totalKg = items.reduce((total, item) => total + item.GWEIGHT!, 0);
    const totalQtyTemp = items.reduce((total, item) => total + item.QTY!, 0);
    return (
      <View style={{alignItems: 'flex-end'}}>
        <Text style={styles.textSum}>
          {totalQtyTemp} con/ ${totalQty} con
        </Text>
        <Text style={styles.textSum}>
          {doubleFormat(totalKg, 'kg')} /{doubleFormat(totalBw, 'kg')}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 10,
      }}>
      <Row>
        <Column>
          <Icon name="bars" type="AntDesign" style={styles.accordionIcon} />
          <TextCustom>Chi Tiết Lần Cân</TextCustom>
        </Column>
        <Column style={{justifyContent: 'flex-end'}}>
          {getSummaryWeighingGoods()}
        </Column>
      </Row>
      {items.map((item, index) => (
        <WeighGoodsItem
          onDeleteItem={() => onDeleteItem && onDeleteItem(item)}
          onSelectedItem={() => onSelectedItem && onSelectedItem(item)}
          index={index}
          item={item}
          // eslint-disable-next-line react/no-array-index-key
          key={`weighing-goods-item-${index}`}
        />
      ))}
    </View>
  );
};

export default WeighingGoodsItems;
