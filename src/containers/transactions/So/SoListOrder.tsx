/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FlatListCommon, TextCustom} from '~/components/commons';
import {Card} from '~/components/cards';
import {RowLabelIcon, Row, ConfirmModal} from '~/components/sections';
import {Sizes, Colors} from '~/configs';
import {ISoDetail, ISoHeaderCommon} from '~/apis/types.service';
import SoAction from '~/redux/so/so.actions';
import {RootState} from '~/redux/reducers';
import {doubleFormat} from '~/helpers/UtilitiesHelper';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';

export interface ISoListOrder {
  data: ISoDetail[];
  onSelect: (so: ISoDetail) => void;
}

const SoListOrder: React.FC<ISoListOrder> = ({
  data,
  onSelect,
}: ISoListOrder) => {
  const dispatch = useDispatch();
  // reducer
  const {userParams} = useSelector((state: RootState) => state.global);
  // state
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [soDelete, setSoDelete] = useState<ISoDetail | null>(null);

  const handleDeleteSoHeader = (): void => {
    setIsConfirm(false);
    const objDelete: ISoHeaderCommon = {
      ...userParams,
      soNo: soDelete?.SONO!,
    };
    dispatch(SoAction.deleteHeader(objDelete));
  };

  // render FlatList Item,
  const renderSoItem = (so: ISoDetail): JSX.Element => {
    return (
      <Row isSmall>
        <Card
          onPress={() => onSelect(so)}
          onLongPress={() => {
            setIsConfirm(true);
            setSoDelete(so);
          }}>
          <View style={styles.view}>
            <TextCustom bold style={styles.text}>
              {`${doubleFormat(so.TOTALAMTAFTERVAT, 'VNĐ')}`}
            </TextCustom>
            <TextCustom style={styles.date}>
              {convertStringDateToDdMmYyyy(so.SODATE, 'date')}
            </TextCustom>
          </View>
          <RowLabelIcon bold iconName="wallet" value={so.SONO} />
          <RowLabelIcon
            iconName="adduser"
            value={`${so.CUSTID} - ${so.CUSTNAME}`}
          />
          <RowLabelIcon iconName="copyright" value={so.LOCATIONNAME} />
          <RowLabelIcon
            iconName="location"
            iconType="Entypo"
            value={so.PLACEDELIVERY}
          />

          <RowLabelIcon
            iconName="pay-circle-o1"
            iconType="AntDesign"
            value={`(PIT ${so.PIT}%) ${doubleFormat(so.P_USAGEDIS, 'VNĐ')}`}
          />
        </Card>
      </Row>
    );
  };

  return (
    <>
      <FlatListCommon
        isShowVertical={false}
        data={data}
        renderItem={({item}) => renderSoItem(item)}
      />
      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => setIsConfirm(false)}
        onAccept={handleDeleteSoHeader}
      />
    </>
  );
};

export default SoListOrder;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BG,
    flex: 1,
  },
  view: {
    marginHorizontal: -10,
    marginTop: -10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    borderBottomColor: Colors.ORIGIN,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: Colors.GRAY,
    fontSize: Sizes.Title,
  },
  date: {fontSize: Sizes.Note},
});
