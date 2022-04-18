/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import icons from '~/assets/icons';
import {Icon, TextCustom} from '~/components/commons';
import {Colors, Sizes} from '~/configs';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {
  doubleFormat,
  isValidString,
  numberFormat,
  scaleFactor,
} from '~/helpers/UtilitiesHelper';

export interface IProps {
  onSelectItem?: () => void;
  onUpload?: () => void;

  tempWsNo?: string;
  doNo?: string;
  custName?: string;
  isUploaded: boolean;
  isLocked: boolean;
  qty?: number;
  bw?: number;
  createdOn: string;
  isShowUpload: boolean;
  farmName?: string;
}

const WGoodsItem = ({
  onSelectItem,
  onUpload,
  tempWsNo,
  doNo,
  custName,
  isUploaded,
  isLocked,
  qty,
  bw,
  createdOn,
  isShowUpload,
  farmName,
}: IProps) => {
  const showScaleNo = (): string => {
    if (isValidString(tempWsNo)) return tempWsNo!;
    if (isValidString(doNo))
      return `ON${doNo?.toUpperCase().replace('DO', '')}`;
    return '--- ---';
  };
  return (
    <TouchableOpacity onPress={onSelectItem}>
      <View style={styles.itemContainer}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: Colors.GRAY_LIGHT,
            borderBottomWidth: 0.5,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}>
            <Image
              source={icons.checkList}
              style={{width: scaleFactor(80), height: scaleFactor(90)}}
            />
          </View>
          <View style={{flex: 3}}>
            <View style={styles.rowItem}>
              <TextCustom style={{fontSize: 12}}>Mã phiếu cân:</TextCustom>
              <TextCustom style={styles.rowText}>{showScaleNo()}</TextCustom>
            </View>
            <View style={styles.rowItem}>
              <TextCustom style={{fontSize: 12}}>Phiếu xuất:</TextCustom>
              <TextCustom style={styles.rowText}>{doNo}</TextCustom>
            </View>
            <View style={styles.rowItem}>
              <TextCustom style={{fontSize: 12}}>Khách hàng:</TextCustom>
              <TextCustom style={styles.rowText}>{custName}</TextCustom>
            </View>
            <View style={styles.rowItem}>
              <TextCustom style={{fontSize: 12}}>Trại xuất:</TextCustom>
              <TextCustom style={styles.rowText}>
                {farmName ?? '---'}
              </TextCustom>
            </View>
            <View style={styles.rowItem}>
              <TextCustom style={{fontSize: 12}}>Ngày giờ cân:</TextCustom>
              <TextCustom style={styles.rowText}>
                {convertStringDateToDdMmYyyy(createdOn, 'datetime')}
              </TextCustom>
            </View>
            <View style={styles.rowItem}>
              <TextCustom style={{fontSize: 12}}>Số con/số kg:</TextCustom>
              <TextCustom style={styles.rowText}>
                {numberFormat(qty, 'con')} / {doubleFormat(bw, 'kg')}
              </TextCustom>
            </View>
          </View>
        </View>
        <View style={styles.actionContainer}>
          {isShowUpload && !isUploaded && (
            <TouchableOpacity onPress={onUpload}>
              <View style={[styles.btn, styles.btnDisable]}>
                <TextCustom style={styles.btnText}>Tải lên</TextCustom>
                <Icon name="upload" type="AntDesign" style={styles.btnIcon} />
              </View>
            </TouchableOpacity>
          )}

          {isShowUpload && isUploaded && (
            <TextCustom
              style={{
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.GRAY_LIGHT,
              }}>
              Đã được tải lên
            </TextCustom>
          )}

          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: isLocked ? Colors.SUCCESS : Colors.DANGER,
              },
            ]}>
            <TextCustom style={styles.statusLabel}>
              {isLocked ? 'Đã chốt' : 'Chưa chốt'}
            </TextCustom>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WGoodsItem;
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    elevation: 1,
    marginBottom: 15,
    paddingVertical: 5,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  rowText: {fontSize: scaleFactor(15)},
  actionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  btn: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderColor: Colors.SUCCESS,
  },
  btnText: {fontSize: 14, color: Colors.SUCCESS, marginRight: 10},
  btnIcon: {fontSize: 14, color: Colors.SUCCESS},
  btnDisable: {backgroundColor: Colors.BG},
  statusContainer: {
    backgroundColor: Colors.DANGER,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.WHITE,
  },
  statusLabel: {color: Colors.WHITE, fontSize: Sizes.Note, marginVertical: -1},
});
