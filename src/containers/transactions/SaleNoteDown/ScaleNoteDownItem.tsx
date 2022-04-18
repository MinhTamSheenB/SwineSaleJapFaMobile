/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {TextCustom} from '~/components/commons';
import {Column, Row, RowLabelValue} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  doNo: string;
  scaleDate: string;
  productName: string;
  isLock: boolean;
  locationName: string;
  customerName: string;
  scaleNo: string;
  replaceScaleNo: string;
  qty: number;
  weight: number;
  average: number;
  onSelect?: () => void;
}

const ScaleNoteDownItem = ({
  doNo,
  scaleDate,
  productName,
  isLock,
  locationName,
  customerName,
  scaleNo,
  replaceScaleNo,
  qty,
  weight,
  average,
  onSelect,
}: IProps) => {
  return (
    <Pressable onPress={onSelect}>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: '#E1E1E1',
            paddingVertical: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.BORDER_DARK,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextCustom style={{color: Colors.BLACK, fontWeight: 'bold'}}>
              {doNo}
            </TextCustom>
            <TextCustom style={{fontSize: Sizes.Note, color: Colors.BLACK}}>
              {scaleDate}
            </TextCustom>
          </View>
          <View
            style={{
              marginTop: 5,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <TextCustom
              style={{
                fontStyle: 'italic',
                color: Colors.BLACK,
                fontSize: Sizes.Note,
              }}>
              {productName}
            </TextCustom>

            <View
              style={{
                backgroundColor: isLock ? Colors.SUCCESS : Colors.DANGER,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 10,
              }}>
              <Text style={{color: Colors.WHITE, fontSize: Sizes.Note}}>
                {isLock ? 'Đã ghi sổ' : 'Chưa ghi sổ'}
              </Text>
            </View>
          </View>
        </View>
        <RowLabelValue label="Trại:" value={locationName} />
        <RowLabelValue label="Khách hàng:" value={customerName} />
        <RowLabelValue label="Mã cân gốc:" value={scaleNo} />
        <RowLabelValue label="Mã cân thay thế:" value={replaceScaleNo} />
        <Row isSmall>
          <Column style={{alignItems: 'center'}}>
            <TextCustom isSmall>SL(con): </TextCustom>
            <TextCustom>{numberFormat(qty, '')}</TextCustom>
          </Column>
          <Column style={{alignItems: 'center'}}>
            <TextCustom isSmall>TL(kg): </TextCustom>
            <TextCustom>{numberFormat(weight, '')}</TextCustom>
          </Column>
          <Column style={{alignItems: 'center'}}>
            <TextCustom isSmall> TLTB(kg): </TextCustom>
            <TextCustom>{numberFormat(average, '')}</TextCustom>
          </Column>
        </Row>
      </View>
    </Pressable>
  );
};

export default ScaleNoteDownItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginBottom: 17,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.GRAY_LIGHT,
  },
});
