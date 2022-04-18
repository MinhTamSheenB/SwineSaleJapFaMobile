import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {Card} from '~/components/cards';
import {Row, Column} from '~/components/sections';
import {TextCustom, Icon} from '~/components/commons';
import {Sizes, Colors} from '~/configs';
import {ISoDetailModel} from '~/apis/types.service';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import SoAction from '~/redux/so/so.actions';

export interface ISoProductProps {
  detail: ISoDetailModel;
  onDelete?(detailId: number): void;
}

const SoProduct: React.FC<ISoProductProps> = ({detail, onDelete}) => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const handleSelect = (): void => {
    dispatch(SoAction.selectedSoDetail(detail));
    navigate.navigate(ScreenType.SO.ADD_PRODUCT);
  };

  return (
    <Card
      onPress={handleSelect}
      onLongPress={() => onDelete && onDelete(detail.SODTID)}
      rightComponent={
        <View
          style={{
            transform: [{rotate: '90deg'}],
            width: 200,
            position: 'absolute',
            bottom: 90,
            flex: 1,
            right: -65,
            alignItems: 'center',
          }}>
          <TextCustom bold style={{color: Colors.WHITE, fontSize: Sizes.Title}}>
            {`${numberFormat(detail.AMOUNT)}`}
          </TextCustom>
          <TextCustom style={{color: Colors.WHITE, fontSize: Sizes.Content}}>
            {numberFormat(detail.QTY, 'CON')} -{' '}
            {numberFormat(detail.BW_TOTAL, 'KG')}
          </TextCustom>
        </View>
      }>
      <Row isSmall>
        <Column>
          <TextCustom bold>{detail.PRODUCTID}</TextCustom>
          <TextCustom style={{fontSize: Sizes.Note, marginLeft: 10}}>
            {`(${detail.PRODUCTNAME})`}
          </TextCustom>
        </Column>
      </Row>
      <Row isSmall>
        <Column mobile={2}>
          <TextCustom style={{fontSize: Sizes.Note, marginLeft: 10}}>
            TL - TLBQ:
          </TextCustom>
        </Column>
        <Column mobile={4}>
          <TextCustom>{numberFormat(detail.BW_AVG, '')}</TextCustom>
        </Column>
      </Row>
      <Row isSmall>
        <Column mobile={2}>
          <TextCustom style={{fontSize: Sizes.Note, marginLeft: 10}}>
            Giá (SP):
          </TextCustom>
        </Column>
        <Column mobile={4} style={{alignItems: 'center'}}>
          <TextCustom>{numberFormat(detail.PRICE1, '')}</TextCustom>
          <Icon
            name="arrowdown"
            color={Colors.DANGER}
            type="AntDesign"
            size={Sizes.IconSub}
            style={{marginLeft: 10}}
          />
          <TextCustom>{numberFormat(detail.REDUCEPRICE1, '')}</TextCustom>
        </Column>
      </Row>

      <Row isSmall>
        <Column mobile={2}>
          <TextCustom style={{fontSize: Sizes.Note, marginLeft: 10}}>
            Giá (ĐVT):
          </TextCustom>
        </Column>
        <Column mobile={4} style={{alignItems: 'center'}}>
          <TextCustom>{numberFormat(detail.PRICE2, '')}</TextCustom>
          <Icon
            name="arrowdown"
            color={Colors.DANGER}
            type="AntDesign"
            size={Sizes.IconSub}
            style={{marginLeft: 10}}
          />
          <TextCustom>{numberFormat(detail.REDUCEPRICE2, '')}</TextCustom>
        </Column>
      </Row>
      <Row isSmall>
        <Column mobile={2}>
          <TextCustom style={{fontSize: Sizes.Note, marginLeft: 10}}>
            Bảng Giá
          </TextCustom>
        </Column>
        <Column mobile={4}>
          <TextCustom bold>{detail.PRICEGROUP}</TextCustom>
        </Column>
      </Row>
    </Card>
  );
};

export default SoProduct;
