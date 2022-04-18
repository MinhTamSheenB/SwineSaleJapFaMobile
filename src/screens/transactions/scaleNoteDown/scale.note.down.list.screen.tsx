/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  IScaleNoteDownItemDTO,
  IScaleNoteDownModel,
} from '~/apis/types.scale.note.down';
import {ScaleStatus} from '~/apis/types.service';
import {
  CircleButton,
  DateRowWithoutFormik,
  FlatListCommon,
  ModalCommon,
  SafeView,
  TagButton,
} from '~/components/commons';
import {Column, Container, Header, Row} from '~/components/sections';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';
import {ScaleNoteDownItem} from '~/containers/transactions/SaleNoteDown';
import {
  convertStringToDate,
  formatDateToDdMmYyyy,
} from '~/helpers/DatetimeHelpers';
import ScreenType from '~/navigations/screen.constant';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import ScaleNoteDownActions from '~/redux/scaleNoteDown/scale.note.down.actions';

export interface IProps {}

const ScaleNoteDownListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {data} = useSelector((state: RootState) => state.scaleNoteDown);

  const [fromDate, setFromDate] = useState<string>(() => FROM_DATE);
  const [toDate, setToDate] = useState<string>(() => TO_DATE);
  const [isOpenFilterModal, setOpenFilterModal] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<
    ScaleStatus | undefined
  >();

  const handleGetListOfScaleNoteDown = useCallback(() => {
    dispatch(
      ScaleNoteDownActions.search(fromDate, toDate, undefined, selectedStatus),
    );
  }, [dispatch, fromDate, selectedStatus, toDate]);

  useEffect(() => {
    handleGetListOfScaleNoteDown();
  }, [handleGetListOfScaleNoteDown]);

  useEffect(() => {
    dispatch(MasterActions.getAllProducts());
  }, [dispatch]);

  return (
    <>
      <SafeView>
        <Header
          title="Điều chỉnh giao hàng"
          isMenu
          onMenuPress={() => setOpenFilterModal(true)}
        />
        <Container style={styles.container}>
          <Row>
            <TagButton
              text="Tất cả"
              isActive={selectedStatus === undefined}
              onPress={() => setSelectedStatus(undefined)}
            />
            <TagButton
              text="Chưa ghi sổ"
              isActive={selectedStatus === ScaleStatus.New}
              onPress={() => setSelectedStatus(ScaleStatus.New)}
            />
            <TagButton
              text="Đã ghi sổ"
              isActive={selectedStatus === ScaleStatus.Finish}
              onPress={() => setSelectedStatus(ScaleStatus.Finish)}
            />
          </Row>
          <FlatListCommon
            onRefresh={() => handleGetListOfScaleNoteDown()}
            isShowVertical={false}
            data={data}
            renderItem={({item}: {item: IScaleNoteDownItemDTO}) => {
              return (
                <ScaleNoteDownItem
                  isLock={item.STATUS === ScaleStatus.Finish}
                  scaleDate={formatDateToDdMmYyyy(item.SCALEDATE)}
                  average={item.AVGWIGHT}
                  weight={item.NETGROSS}
                  customerName={item.CUSTNAME}
                  doNo={item.DONO}
                  locationName={item.LOCATIONNAME ?? ''}
                  productName={item.NAME_VN ?? ''}
                  scaleNo={item.ROOTSCALEID ?? '---'}
                  replaceScaleNo={item.SCALEID}
                  qty={item.TOTALQTY}
                  onSelect={() => {
                    const model: IScaleNoteDownModel = {...item};
                    dispatch(ScaleNoteDownActions.setLocalModel(model));
                    setTimeout(() => {
                      navigation.navigate(
                        item.STATUS === ScaleStatus.Finish
                          ? ScreenType.ScaleNoteDown.SUMMARY
                          : ScreenType.ScaleNoteDown.EDIT,
                      );
                    }, 200);
                  }}
                />
              );
            }}
          />
        </Container>
        <CircleButton
          onPress={() => navigation.navigate(ScreenType.ScaleNoteDown.DO_LIST)}
        />
      </SafeView>

      <ModalCommon
        title="Chọn thời gian"
        isVisible={isOpenFilterModal}
        onClose={() => setOpenFilterModal(false)}>
        <Row>
          <Column>
            <DateRowWithoutFormik
              label="Từ ngày"
              date={convertStringToDate(fromDate)}
              type="date"
              onDateChange={(date) => {
                setFromDate(date);
              }}
            />
          </Column>
          <Column>
            <DateRowWithoutFormik
              label="Đến ngày"
              date={convertStringToDate(toDate)}
              type="date"
              onDateChange={(date) => {
                setToDate(date);
              }}
            />
          </Column>
        </Row>
      </ModalCommon>
    </>
  );
};

export default ScaleNoteDownListScreen;
const styles = StyleSheet.create({
  container: {},
});
