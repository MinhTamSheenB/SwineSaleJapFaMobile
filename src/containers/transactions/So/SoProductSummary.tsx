/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Row, Column} from '~/components/sections';
import {TextCustom, Icon} from '~/components/commons';
import {Sizes, Colors} from '~/configs';
import {ISoDetailModel} from '~/apis/types.service';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  item: ISoDetailModel;
}

const SoProductSummary = ({item}: IProps) => {
  return (
    <View style={styles.borderLeft}>
      <View style={styles.container}>
        <Row isSmall>
          <Column>
            <TextCustom
              bold>{`${item.PRODUCTID} - ${item.PRODUCTNAME}`}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column>
            <TextCustom isSmall>Giá(SP)</TextCustom>
          </Column>
          <Column mobile={4} style={{alignItems: 'center'}}>
            <TextCustom>{numberFormat(item.PRICE1)}</TextCustom>
            <Icon
              name="arrowdown"
              color={Colors.DANGER}
              type="AntDesign"
              size={Sizes.IconSub}
              style={{marginLeft: 10}}
            />
            <TextCustom>{numberFormat(item.REDUCEPRICE1)}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column>
            <TextCustom isSmall>Giá(ĐVT)</TextCustom>
          </Column>
          <Column mobile={4} style={{alignItems: 'center'}}>
            <TextCustom>{numberFormat(item.PRICE2)}</TextCustom>
            <Icon
              name="arrowdown"
              color={Colors.DANGER}
              type="AntDesign"
              size={Sizes.IconSub}
              style={{marginLeft: 10}}
            />
            <TextCustom>{numberFormat(item.REDUCEPRICE2)}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column>
            <TextCustom isSmall>SL/TL/TLBQ</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>
              {`${numberFormat(item.QTY, 'CON')} /  ${numberFormat(
                item.BW_TOTAL,
                'KG',
              )} /  ${numberFormat(item.BW_AVG, 'KG')}`}
            </TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column>
            <TextCustom isSmall>Thành tiền</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom bold>{numberFormat(item.AMOUNT)}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column>
            <TextCustom isSmall>Bảng Giá</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{item.PRICEGROUP}</TextCustom>
          </Column>
        </Row>
        <Row isSmall>
          <Column>
            <TextCustom isSmall>Ghi chú</TextCustom>
          </Column>
          <Column mobile={4}>
            <TextCustom>{item.REMARKS}</TextCustom>
          </Column>
        </Row>
      </View>
    </View>
  );
};

export default SoProductSummary;

const styles = StyleSheet.create({
  borderLeft: {
    // borderBottomWidth: 0.3,
    paddingBottom: 10,
    borderBottomColor: Colors.GRAY_LIGHT,
    marginBottom: 5,
  },
  container: {
    paddingVertical: 3,
    borderLeftWidth: 3,
    borderLeftColor: Colors.DANGER,
  },
});
