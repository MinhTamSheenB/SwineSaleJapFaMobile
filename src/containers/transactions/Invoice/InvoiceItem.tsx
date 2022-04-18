/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {IInvoiceHeaderDetail} from '~/apis/types.service';
import {Icon, TextCustom} from '~/components/commons';
import {Row, RowLabelIcon} from '~/components/sections';
import {Colors} from '~/configs';
import {formatDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';

export interface IProps {
  onPress?: () => void;
  item: IInvoiceHeaderDetail;
}

const InvoiceItem = ({onPress, item}: IProps) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.invoiceItemContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            paddingBottom: 10,
            borderBottomColor: Colors.GRAY_LIGHT,
          }}>
          <TextCustom bold>{item.INVNO}</TextCustom>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Icon type="AntDesign" name="calendar" style={styles.rowIcon} />
            <TextCustom style={styles.rowText}>
              {formatDateToDdMmYyyy(item.INVDATE)}
            </TextCustom>
          </View>
        </View>
        <Row isSmall>
          <RowLabelIcon
            iconName="v-card"
            iconType="Entypo"
            value={item.CUSTNAME}
          />
        </Row>
        <Row isSmall>
          <RowLabelIcon
            iconName="address"
            iconType="Entypo"
            value={item.CUSTADDRESS}
          />
        </Row>
        <Row isSmall>
          <RowLabelIcon
            iconName="clipboard"
            iconType="Entypo"
            value={item.DONO}
          />
        </Row>
      </View>
    </Pressable>
  );
};

export default InvoiceItem;

const styles = StyleSheet.create({
  invoiceItemContainer: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 0.5,
    marginBottom: 20,
    borderLeftColor: Colors.ORIGIN,
    borderLeftWidth: 4,
  },
  icon: {
    color: Colors.GRAY_LIGHT,
    fontSize: 16,
    marginRight: 10,
  },
  subText: {
    color: Colors.GRAY_LIGHT,
    fontSize: 16,
    fontWeight: '800',
  },
  rowIcon: {
    fontSize: 16,
    color: Colors.GRAY,
    marginRight: 10,
  },
  rowText: {
    fontSize: 14,
  },
});
