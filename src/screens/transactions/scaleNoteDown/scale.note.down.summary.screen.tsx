/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ScaleStatus} from '~/apis/types.service';
import {Icon, SafeView, TextCustom} from '~/components/commons';
import {ConfirmModal, Container, Header} from '~/components/sections';
import {Colors} from '~/configs';
import {
  ScaleNoteDownDoInfo,
  ScaleNoteDownDoItem,
  ScaleNoteDownInfo,
} from '~/containers/transactions/SaleNoteDown';
import {IScaleRowITem} from '~/containers/transactions/SaleNoteDown/ScaleNoteDownDoItem';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {scaleFactor} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import ScaleNoteDownActions from '~/redux/scaleNoteDown/scale.note.down.actions';

export interface IProps {}

const ScaleNoteDownSummaryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {model} = useSelector((state: RootState) => state.scaleNoteDown);
  const items: IScaleRowITem[] | undefined = model?.SCALEDOWNDETAILS.map(
    (de, index) => ({
      key: index,
      no: de.SCALENO ?? '',
      name: de.NAME_VN ?? '',
      qty: de.TOTALQTY ?? 0,
      avg: de.AVGWIGHT ?? 0,
      weight: de.NETGROSS ?? 0,
    }),
  );

  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [confirmType, setConfirmType] = useState<'POST' | 'DELETE'>();

  return (
    <SafeView>
      <Header
        title="Tổng hợp thông tin điều chỉnh"
        isMenu={false}
        disableThreeDot
      />
      <Container style={styles.container} isIncludeScrollView>
        <ScaleNoteDownDoInfo
          doNo={model?.DONO ?? '----'}
          custName={model?.CUSTNAME}
          farmAddress={model?.LOCATIONADDRESS}
          from={model?.LOCATIONNAME}
          receiverName={model?.RECEIVERNAME}
        />
        <ScaleNoteDownInfo
          scaleDate={convertStringDateToDdMmYyyy(model?.SCALEDATE, 'date')}
          scaleMan={model?.WEIGHMAN}
          time={`${model?.ARRIVALTIME} - ${model?.DEPARTTIME}`}
          exportCode={model?.FLOCKCODE}
          receivedCode={model?.FLOCKNAME}
        />
        <View>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              paddingHorizontal: 10,
              paddingTop: 10,
            }}>
            <TextCustom bold>Chi tiết điều chỉnh</TextCustom>
          </View>
          <ScaleNoteDownDoItem
            visibleDO={false}
            note="Heo bình thường"
            scaleData={items ?? []}
            doNo={model?.DONO ?? ''}
            custName={model?.CUSTNAME ?? ''}
          />
        </View>
      </Container>
      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            setIsConfirm(true);
            setConfirmType('DELETE');
          }}
          disabled={model?.STATUS === ScaleStatus.Finish}
          style={[
            styles.btnContainer,
            {
              backgroundColor:
                model?.STATUS === ScaleStatus.Finish
                  ? Colors.DISABLED
                  : Colors.DANGER,
            },
          ]}>
          <Icon style={styles.icon} name="closecircle" type="AntDesign" />
          <TextCustom style={styles.label}>Xoá</TextCustom>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsConfirm(true);
            setConfirmType('POST');
          }}
          disabled={model?.STATUS === ScaleStatus.Finish}
          style={[
            styles.btnContainer,
            {
              backgroundColor:
                model?.STATUS === ScaleStatus.Finish
                  ? Colors.DISABLED
                  : Colors.SUCCESS,
            },
          ]}>
          <Icon style={styles.icon} name="lock1" type="AntDesign" />
          <TextCustom style={styles.label}>Chốt đơn</TextCustom>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate(ScreenType.ScaleNoteDown.List)}
          style={[styles.btnContainer, {backgroundColor: Colors.GRAY_LIGHT}]}>
          <Icon style={styles.icon} name="verticleleft" type="AntDesign" />
          <TextCustom style={styles.label}>Danh sách</TextCustom>
        </Pressable>
      </View>
      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => {
          setConfirmType(undefined);
          setIsConfirm(false);
        }}
        onAccept={() => {
          setIsConfirm(false);
          if (confirmType === 'DELETE') {
            dispatch(
              ScaleNoteDownActions.deleteHeader(
                model?.SCALEID ?? '--',
                model?.UNITID,
              ),
            );
          } else if (model) {
            dispatch(ScaleNoteDownActions.postHeader(model));
          }
        }}
      />
    </SafeView>
  );
};

export default ScaleNoteDownSummaryScreen;
const styles = StyleSheet.create({
  container: {flex: 10},
  footer: {
    height: scaleFactor(50),
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  label: {
    marginLeft: 10,
    color: Colors.WHITE,
  },
  icon: {
    color: Colors.WHITE,
  },
});
