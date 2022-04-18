import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {IInvoiceItemDetail} from '~/apis/types.service';
import {TextCustom} from '~/components/commons';
import {Row, Column} from '~/components/sections';
import {Colors} from '~/configs';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  item: IInvoiceItemDetail;
  onSelect?: () => void;
  onDelete?: () => void;
}

const InvoiceProductItem = ({onDelete, onSelect, item}: IProps) => {
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
            <TextCustom bold>{item.PROD_ID}</TextCustom>
            <TextCustom isSmall style={{marginLeft: 10}}>
              {`(${item.PROD_NAME})`}
            </TextCustom>
          </Row>
          <Row isSmall>
            <Column>
              <View>
                <TextCustom isSmall>Đơn Giá</TextCustom>
                <TextCustom>{numberFormat(item.PROD_PRICE)}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Thành tiền</TextCustom>
                <TextCustom>{numberFormat(item.PROD_AMOUNT)}</TextCustom>
              </View>
            </Column>
          </Row>
          <Row>
            <Column>
              <View>
                <TextCustom isSmall>Đơn Vị Tính:</TextCustom>
                <TextCustom>{item.PROD_UOM}</TextCustom>
              </View>
            </Column>
            <Column>
              <View>
                <TextCustom isSmall>Ghi Chú</TextCustom>
                <TextCustom>{item.NOTES ?? '--- ---'}</TextCustom>
              </View>
            </Column>
          </Row>
        </>
        <View />
      </TouchableOpacity>
    </View>
  );
};

export default InvoiceProductItem;
