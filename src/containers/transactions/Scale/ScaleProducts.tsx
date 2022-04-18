/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IScaleDetailDTO} from '~/apis/types.service';
import {Accordion, TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {convertStringDateToDdMmYyyy, formatDate} from '~/helpers/DatetimeHelpers';
import {formatDouble, numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProductProps {
  noBorderBottom?: boolean;
  item: IScaleDetailDTO;
}

const Product = ({noBorderBottom, item}: IProductProps) => {
  const borderStyle = noBorderBottom
    ? {borderBottomWidth: 0, marginBottom: 10}
    : undefined;
  return (
    <View style={[styles.productOutLine, borderStyle]}>
      <View style={styles.productContainer}>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.productTitle}>Mã Phiếu Cân:</TextCustom>
          </Column>
          <Column mobile={3}>
            <TextCustom bold>{item.SCALEID}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.productTitle}>Ngày Cân:</TextCustom>
          </Column>
          <Column mobile={3}>
            <TextCustom>
              {convertStringDateToDdMmYyyy(`${item.SCALEDATE}`, 'date')}
            </TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.productTitle}>Số Lượng:</TextCustom>
          </Column>
          <Column mobile={3}>
            <TextCustom>{`${numberFormat(item.TOTALQTY, 'Con')}`}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.productTitle}>Trọng Lượng</TextCustom>
          </Column>
          <Column mobile={3}>
            <TextCustom>{`${numberFormat(item.NETGROSS, 'KG')}`}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column mobile={2}>
            <TextCustom style={styles.productTitle}>Trọng Lượng TB</TextCustom>
          </Column>
          <Column mobile={3}>
            <TextCustom>{`${formatDouble(item.AVGWIGHT)} KG`}</TextCustom>
          </Column>
        </Row>
      </View>
    </View>
  );
};

export interface IScaleProductsProps {
  productName: string;
  productId: string;
  data: IScaleDetailDTO[];
}

const ScaleProducts = ({productName, productId, data}: IScaleProductsProps) => {
  return (
    <Accordion title={productName} isOpen>
      {data.map((item) => (
        <Product key={`${productId}-${item.SCALEID}`} item={item} />
      ))}
    </Accordion>
  );
};

export default ScaleProducts;
const styles = StyleSheet.create({
  productContainer: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.ORIGIN,
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
  },
  title: {},
  titleIcon: {
    color: Colors.BLACK,
    fontSize: 30,
    marginRight: 20,
  },
  productTitle: {
    color: Colors.GRAY_LIGHT,
  },
  productOutLine: {
    borderBottomColor: Colors.GRAY_LIGHT,
    borderBottomWidth: 0.3,
    marginBottom: 10,
  },
});
