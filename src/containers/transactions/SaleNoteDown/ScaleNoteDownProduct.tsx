/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {doubleFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  productName: string;
  qty: number;
  weight: number;
  avg: number;
  id: number;
  onSelect?: () => void;
  onDelete?: () => void;
}

const ScaleNoteDownProduct = ({
  productName,
  qty,
  weight,
  avg,
  id,
  onSelect,
  onDelete,
}: IProps) => {
  return (
    <TouchableOpacity onPress={onSelect} onLongPress={onDelete}>
      <View style={styles.container}>
        <TextCustom>{productName}</TextCustom>
        <Row
          style={{
            backgroundColor: Colors.BG,
            paddingVertical: 10,
            borderRadius: 7,
            marginVertical: 0,
            marginTop: 5,
          }}>
          <Column>
            <View style={styles.item}>
              <TextCustom isSmall>SL (con)</TextCustom>
              <TextCustom>{qty}</TextCustom>
            </View>
          </Column>
          <Column>
            <View style={styles.item}>
              <TextCustom isSmall>TL (kg)</TextCustom>
              <TextCustom>{doubleFormat(weight, '')}</TextCustom>
            </View>
          </Column>
          <Column>
            <View style={styles.item}>
              <TextCustom isSmall>TLBQ (kg)</TextCustom>
              <TextCustom>{doubleFormat(avg, '')}</TextCustom>
            </View>
          </Column>
        </Row>
      </View>
    </TouchableOpacity>
  );
};

export default ScaleNoteDownProduct;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginVertical: 7,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
  },
});
