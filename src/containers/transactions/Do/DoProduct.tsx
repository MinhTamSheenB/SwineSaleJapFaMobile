import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {IDoItemDetailModel} from '~/apis/types.service';
import {TextCustom} from '~/components/commons';
import {Row, Column} from '~/components/sections';
import {Colors} from '~/configs';
import {formatDouble, numberFormat} from '~/helpers/UtilitiesHelper';

export interface IDoProductProps {
  item: IDoItemDetailModel;
  onSelect?: () => void;
  onDelete?: () => void;
}

const DoProduct = ({onDelete, onSelect, item}: IDoProductProps) => {
  return (
    <View
      style={{
        marginBottom: 20,
        backgroundColor: Colors.WHITE,
        borderLeftWidth: 5,
        borderLeftColor: Colors.ORIGIN,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 2,
        minHeight: 20,
      }}>
      <TouchableOpacity onPress={onSelect} onLongPress={onDelete}>
        <>
          <Row isSmall>
            <TextCustom bold>{item.PRODUCTID}</TextCustom>
            <TextCustom isSmall style={{marginLeft: 10}}>
              {`(${item.PRODUCTNAME})`}
            </TextCustom>
          </Row>
          <Row isSmall>
            <Column>
              <View>
                <TextCustom isSmall>Số Lượng:</TextCustom>
                <TextCustom>{numberFormat(item.QTY, 'Con')}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Trọng Lượng:</TextCustom>
                <TextCustom>{numberFormat(item.BW_TOTAL, 'KG')}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>TLTB</TextCustom>
                <TextCustom>{`${formatDouble(item.BW_AVG)} KG`}</TextCustom>
              </View>
            </Column>
          </Row>
        </>
        <View />
      </TouchableOpacity>
    </View>
  );
};

export default DoProduct;
