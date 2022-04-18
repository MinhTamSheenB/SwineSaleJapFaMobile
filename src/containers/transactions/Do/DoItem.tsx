/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon, TextCustom} from '~/components/commons';
import {Colors, Sizes} from '~/configs';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {doubleFormat, numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  doNo: string;
  soNo?: string;
  custName?: string;
  qty?: number;
  bw?: number;
  doDate?: string;
  farmName?: string;

  onPress?: () => void;
  onLongPress?: () => void;
}

const DoItem = ({
  doNo,
  soNo,
  custName,
  qty,
  bw,
  doDate,
  farmName,
  onPress,
  onLongPress,
}: IProps) => {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <Icon
              name="qq-with-circle"
              type="Entypo"
              style={{marginRight: 10}}
            />
            <TextCustom style={styles.doNo}>{doNo}</TextCustom>
          </View>
          <View>
            <TextCustom style={styles.date}>
              {convertStringDateToDdMmYyyy(doDate, 'date')}
            </TextCustom>
          </View>
        </View>
        <View style={styles.itemBody}>
          <View style={styles.itemRow}>
            <TextCustom style={styles.lable}>Đơn hàng:</TextCustom>
            <TextCustom style={styles.value}>{soNo ?? '--- ---'}</TextCustom>
          </View>
          <View style={styles.itemRow}>
            <TextCustom style={styles.lable}>Khách hàng:</TextCustom>
            <TextCustom style={styles.value}>
              {custName ?? '--- ---'}
            </TextCustom>
          </View>
          <View style={styles.itemRow}>
            <TextCustom style={styles.lable}>Trại xuất:</TextCustom>
            <TextCustom style={styles.value}>
              {farmName ?? '--- ---'}
            </TextCustom>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TextCustom style={styles.lable}>Số con:</TextCustom>
              <TextCustom style={styles.value}>
                {numberFormat(qty, '')}
              </TextCustom>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TextCustom style={styles.lable}>TLBQ (kg):</TextCustom>
              <TextCustom style={styles.value}>
                {doubleFormat(bw, '')}
              </TextCustom>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoItem;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.WHITE,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 0.5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f1f1',
    paddingBottom: 5,
    marginBottom: 5,
  },
  doNo: {color: Colors.BLACK, fontWeight: '900'},
  date: {fontSize: Sizes.Note},
  itemBody: {paddingHorizontal: 15},
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    paddingVertical: 3,
  },
  lable: {fontSize: Sizes.Note},
  value: {color: Colors.BLACK},
});
