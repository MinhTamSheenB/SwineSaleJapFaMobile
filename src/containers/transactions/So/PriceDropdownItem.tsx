import React from 'react';
import {Pressable} from 'react-native';
import {DropdownItemType} from '~/commons/types';
import {TextCustom} from '~/components/commons';
import {Column, Row, RowLabelIcon} from '~/components/sections';
import {Colors} from '~/configs';
import {numberFormat} from '~/helpers/UtilitiesHelper';

export interface IProps {
  item: DropdownItemType;
  onSelect?: () => void;
}

const PriceDropdownItem = ({item, onSelect}: IProps) => {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        marginVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.GRAY_LIGHT,
      }}>
      <Row isSmall style={{justifyContent: 'space-between'}}>
        <TextCustom bold>{item.label}</TextCustom>
      </Row>
      <Row isSmall>
        <RowLabelIcon
          iconName="calendar"
          iconType="AntDesign"
          value={item.date}
        />
      </Row>
      <Row isSmall>
        <Column>
          <TextCustom isSmall>BW</TextCustom>
        </Column>
        <Column mobile={4}>
          <TextCustom>
            {item.BWOPERATOR} {item.BW}
          </TextCustom>
        </Column>
      </Row>
      <Row isSmall>
        <Column>
          <TextCustom isSmall>Giá:</TextCustom>
        </Column>
        <Column mobile={4}>
          <TextCustom>{numberFormat(item.PRICE)}</TextCustom>
          <TextCustom> - </TextCustom>
          <TextCustom>{numberFormat(item.PRICE2)}</TextCustom>
        </Column>
      </Row>
    </Pressable>
  );
};

export default PriceDropdownItem;
