/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CreditStatus, ICreditDTO} from '~/apis/types.service';
import {FlatListCommon, TextCustom, SafeView, Icon} from '~/components/commons';
import {
  ConfirmModal,
  Header,
  RowLabelValue,
  SearchBox,
} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import CreditFilter from '~/containers/transactions/Credit/CreditFilter';
import {ModalFilter} from '~/containers/transactions/So';
import {
  convertStringDateToDdMmYyyy,
  getCurrentDateToString,
} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import CreditActions from '~/redux/credit/credit.actions';
import {RootState} from '~/redux/reducers';

const CreditListScreen = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const [isFilterModal, setFilterModal] = React.useState<boolean>(false);
  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const [fromDate, setFromDate] = React.useState<string>(
    getCurrentDateToString(),
  );
  const [toDate, setToDate] = React.useState<string>(getCurrentDateToString());
  const [creditStatus, setCreditStatus] = React.useState<CreditStatus>(
    CreditStatus.New,
  );
  const [creditSelected, setCreditSelected] = React.useState<ICreditDTO>();

  const {data} = useSelector((state: RootState) => state.credit);

  // TODO: Check here

  React.useEffect((): void => {
    dispatch(CreditActions.search(fromDate, toDate, undefined, creditStatus));
  }, [creditStatus, dispatch, fromDate, toDate]);

  const handleOnSelect = (item: ICreditDTO) => {
    dispatch(CreditActions.setSelectedId(item.CREDIT_ID ?? -1));
    if (item.STATUS !== CreditStatus.New) {
      navigate.navigate(ScreenType.Credit.DETAIL);
    } else {
      setTimeout(() => {
        navigate.navigate(ScreenType.Credit.CREATE);
      }, 100);
    }
  };

  return (
    <SafeView>
      <Header
        title="Xin Nợ"
        isMenu
        noShadow
        onMenuPress={() => setFilterModal(true)}
      />
      <View style={{marginHorizontal: 20, marginTop: 0, marginBottom: 5}}>
        <SearchBox placeholder="Mã chứng từ, tên khách hàng" accessor="" />
      </View>
      <CreditFilter
        currentValue={creditStatus}
        onChange={(value) => setCreditStatus(value)}
      />
      <FlatListCommon
        data={data}
        isShowVertical={false}
        renderItem={({item}: {item: ICreditDTO}) => {
          return (
            <Pressable onPress={() => handleOnSelect(item)}>
              <View style={[styles.rowItem]}>
                <View style={styles.headerItem}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon name="cart" type="EvilIcons" color={Colors.GRAY} />
                    <TextCustom bold>{item.SONO ?? ' --- '}</TextCustom>
                  </View>
                  <TextCustom isSmall>
                    {convertStringDateToDdMmYyyy(item.CREATEDDATE, 'date')}
                  </TextCustom>
                </View>
                <RowLabelValue
                  label="Khách hàng:"
                  value={item.CUSTNAME ?? '---'}
                />
                <RowLabelValue
                  label="Địa chỉ:"
                  value={item.CUSTADDRESS ?? '---'}
                />
                <RowLabelValue
                  label="Số tiền xin nợ:"
                  value={numberFormat(item.REQUESTAMOUNT)}
                  valColor={Colors.DANGER}
                />
              </View>
            </Pressable>
          );
        }}
      />
      <ModalFilter
        onClose={() => setFilterModal(false)}
        fromDate={fromDate}
        toDate={toDate}
        isVisible={isFilterModal}
        title="Tùy chỉnh thời gian"
        onDateChange={(strDate, type) => {
          if (type === 'fromDate') setFromDate(strDate);
          else setToDate(strDate);
        }}
        onFilter={() => {
          setFilterModal(false);
        }}
      />
      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => setIsConfirm(false)}
        onAccept={() => {
          setIsConfirm(false);
          dispatch(
            CreditActions.doAnotherAction(
              creditSelected?.CREDIT_ID ?? 0,
              'DELETE',
              true,
              undefined,
            ),
          );
        }}
      />
      {/* <CircleButton
        onPress={() => navigate.navigate(ScreenType.Credit.CREATE)}
      /> */}
    </SafeView>
  );
};
export default CreditListScreen;

const styles = StyleSheet.create({
  rowItem: {
    backgroundColor: Colors.WHITE,
    paddingBottom: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    borderColor: Colors.BORDER_TWO,
    borderWidth: 0.3,
  },
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopColor: Colors.BORDER_DARK,
    borderTopWidth: 0.2,
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  icon: {marginRight: 10, fontSize: Sizes.IconSub, color: Colors.BLACK},
  label: {fontSize: 14, color: Colors.BLACK},
});
