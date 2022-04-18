/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {IDoItem} from '~/apis/types.service';
import {Icon, TextCustom} from '~/components/commons';
import {Row} from '~/components/sections';
import {Colors} from '~/configs';
import {convertStringDateToMdDdYyyy} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  item: IDoItem;
  onPress?: (item: IDoItem) => void;
}

const DoInvoiceItem = ({item, onPress}: IProps) => {
  return (
    <Pressable onPress={() => onPress && onPress(item)}>
      <View style={styles.invoiceItemContainer}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            paddingBottom: 10,
            borderBottomColor: Colors.GRAY_LIGHT,
          }}>
          <TextCustom bold>{item.SONO}</TextCustom>
        </View>
        <Row isSmall style={{marginVertical: 0, paddingVertical: 0}}>
          <Row isSmall style={{flex: 1}}>
            <Icon type="AntDesign" name="profile" style={styles.rowIcon} />
            <TextCustom style={styles.rowText}>{item.DONO}</TextCustom>
          </Row>
          <Row isSmall style={{flex: 1}}>
            <Icon type="AntDesign" name="calendar" style={styles.rowIcon} />
            <TextCustom style={styles.rowText}>
              {convertStringDateToMdDdYyyy(item.DODATE)}
            </TextCustom>
          </Row>
        </Row>

        <Row isSmall>
          <Icon type="Entypo" name="export" style={styles.rowIcon} />
          <TextCustom style={styles.rowText}>{item.LOCATIONNAME}</TextCustom>
        </Row>
        <Row isSmall>
          <Icon type="Entypo" name="v-card" style={styles.rowIcon} />
          <TextCustom style={styles.rowText}>{item.CUSTNAME}</TextCustom>
        </Row>
        <Row isSmall>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Icon type="AntDesign" name="shoppingcart" style={styles.icon} />
            <TextCustom style={styles.subText}>
              {numberFormat(item.TOTALQTY, '')}
            </TextCustom>
          </View>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Icon type="FontAwesome" name="dollar" style={styles.icon} />
            <TextCustom style={styles.subText}>
              {numberFormat(item.TOTALAMTAFTERVAT, 'VNĐ')}
            </TextCustom>
          </View>
        </Row>
      </View>
    </Pressable>
  );
};

export default DoInvoiceItem;

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
