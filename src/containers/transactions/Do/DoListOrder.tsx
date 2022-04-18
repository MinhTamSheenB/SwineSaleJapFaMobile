import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FlatListCommon, TextCustom} from '~/components/commons';
import {Card} from '~/components/cards';
import {Row, RowLabelIcon, Column, ConfirmModal} from '~/components/sections';
import {Colors} from '~/configs';
import {IDoHeaderCommon, IDoItem} from '~/apis/types.service';
import {numberFormat, scaleFactor} from '~/helpers/UtilitiesHelper';
import {convertStringDateToMdDdYyyy} from '~/helpers/DatetimeHelpers';
import DoActions from '~/redux/do/do.actions';
import {RootState} from '~/redux/reducers';
import icons from '~/assets/icons';
import DoItem from './DoItem';

export interface IDoOrder {
  item: IDoItem;
  onPress?: () => void;
  onDelete?: () => void;
}

const DoOrder = (props: IDoOrder) => {
  const {item, onPress, onDelete} = props;
  return (
    <Row isSmall>
      <Card
        onPress={() => onPress}
        onLongPress={() => onDelete}
        leftStyle={{backgroundColor: Colors.WHITE}}
        leftComponent={
          <View>
            {/* <TextCustom style={{color: Colors.WHITE}}>{item.DONO}</TextCustom> */}
            <Image
              source={icons.checkList}
              style={{width: scaleFactor(60), height: scaleFactor(60)}}
            />
          </View>
        }>
        <>
          <RowLabelIcon
            iconName="profile"
            iconType="AntDesign"
            value={item.DONO}
            bold
          />
          <RowLabelIcon
            iconName="profile"
            iconType="AntDesign"
            value={item.SONO}
          />
          <RowLabelIcon
            iconName="shop"
            iconType="Entypo"
            value={item.LOCATIONNAME}
          />
          <RowLabelIcon
            iconName="users"
            iconType="Entypo"
            value={item.RECEIVERNAME}
          />
          <Row isSmall>
            <Column mobile={2} style={{marginHorizontal: 0}}>
              <RowLabelIcon
                iconType="Entypo"
                iconName="calendar"
                value={convertStringDateToMdDdYyyy(item.SODATE)}
              />
            </Column>
            <Column>
              <RowLabelIcon
                iconType="Entypo"
                iconName="shopping-cart"
                value={numberFormat(item.TOTALQTY, '')}
              />
            </Column>
          </Row>
        </>
      </Card>
    </Row>
  );
};

export interface IDoListOrderProps {
  data: IDoItem[];
  onSelect?: (item: IDoItem) => void;
}

const DoListOrder = ({data, onSelect}: IDoListOrderProps) => {
  const dispatch = useDispatch();

  const {userParams} = useSelector((state: RootState) => state.global);

  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [doSelected, setDoSelected] = useState<IDoItem | null>(null);

  const onDeleteDoItem = (): void => {
    setIsConfirm(false);
    const doRemove: IDoHeaderCommon = {
      ...userParams,
      doNo: `${doSelected?.DONO}`,
    };
    dispatch(DoActions.remove(doRemove, true));
  };

  return (
    <>
      <FlatListCommon
        isShowVertical={false}
        data={data}
        // eslint-disable-next-line react/no-unused-prop-types
        renderItem={({item}: {item: IDoItem}) => (
          <DoItem
            doNo={item.DONO}
            soNo={item.SONO}
            custName={item.CUSTNAME}
            qty={item.TOTALQTY}
            bw={item.BW_TOTAL ?? 0}
            doDate={item.DODATE}
            farmName={item.LOCATIONNAME}
            onPress={() => onSelect && onSelect(item)}
            onLongPress={() => {
              setDoSelected(item);
              setIsConfirm(true);
            }}
          />
        )}
      />
      <ConfirmModal
        title={`Bạn có chắc muốn xoá đơn hàng ${doSelected?.DONO}`}
        isVisible={isConfirm}
        onAccept={onDeleteDoItem}
        onClose={() => setIsConfirm(false)}
      />
    </>
  );
};

export default DoListOrder;
