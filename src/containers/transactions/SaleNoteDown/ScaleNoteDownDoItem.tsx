/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {doubleFormat} from '~/helpers/UtilitiesHelper';

export interface IScaleRowITem {
  key: number;
  no: string;
  name: string;
  qty: number;
  avg: number;
  weight: number;
  note?: string;
}

export interface IProps {
  visibleDO: boolean;
  note?: string;
  doNo: string;
  custName: string;
  onSelect?: (item: IScaleRowITem) => void;
  scaleData: IScaleRowITem[];
}

const ScaleNoteDownDoItem = ({
  visibleDO,
  note,
  doNo,
  custName,
  scaleData,
  onSelect,
}: IProps) => {
  return (
    <View style={styles.container}>
      {visibleDO && (
        <View style={{marginBottom: 10, paddingHorizontal: 10}}>
          <TextCustom bold>{`[${doNo}] ${custName}`}</TextCustom>
        </View>
      )}
      <View>
        {scaleData.map((item) => (
          <Pressable
            onPress={() => onSelect && onSelect(item)}
            style={styles.itemContainer}
            key={`${item.key}`}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                alignItems: 'center',
                overflow: 'hidden',
              }}>
              <TextCustom
                bold
                style={{color: Colors.GRAY_LIGHT, marginRight: 5}}>
                {item.no}
              </TextCustom>
              <TextCustom isSmall>{item.name}</TextCustom>
            </View>
            <Row>
              <Column style={{alignItems: 'center'}}>
                <TextCustom isSmall>SL(con): </TextCustom>
                <TextCustom>{item.qty}</TextCustom>
              </Column>
              <Column style={{alignItems: 'center'}}>
                <TextCustom isSmall>TL(kg): </TextCustom>
                <TextCustom>{doubleFormat(item.weight, '')}</TextCustom>
              </Column>
              <Column style={{alignItems: 'center'}}>
                <TextCustom isSmall>TLBQ(kg): </TextCustom>
                <TextCustom>{doubleFormat(item.avg, '')}</TextCustom>
              </Column>
            </Row>
            {item.note && (
              <Row isSmall style={{marginVertical: 0}}>
                <Column style={{alignItems: 'center'}}>
                  <TextCustom isSmall>Ghi chú:</TextCustom>
                  <TextCustom> {item.note}</TextCustom>
                </Column>
              </Row>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default ScaleNoteDownDoItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginBottom: 17,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: Colors.BG,
    marginHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.3,
    borderColor: '#DFDFDF',
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.ORIGIN,
  },
});
