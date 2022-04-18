import {useRoute} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {DiscountStatus, IDiscountItemDTO} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {CircleButton, FlatListCommon, SafeView} from '~/components/commons';
import {
  ConfirmModal,
  Container,
  Header,
  SearchBox,
} from '~/components/sections';
import {AppStrings} from '~/configs';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';
import AppString from '~/configs/strings';
import {DiscountFilter, DiscountItem} from '~/containers/transactions/Discount';
import {ModalFilter} from '~/containers/transactions/So';
import ScreenType from '~/navigations/screen.constant';
import DiscountActions from '~/redux/discount/discount.actions';
import {RootState} from '~/redux/reducers';

const DiscountListScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const isApproval = route.name === ScreenType.Approval.DISCOUNT;

  const {data} = useSelector((state: RootState) => state.discount);

  const [localData, setLocalData] = useState<IDiscountItemDTO[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>(() => FROM_DATE);

  const [toDate, setToDate] = useState<string>(() => TO_DATE);

  const [currentStatus, setCurrentStatus] = useState<DiscountStatus>(
    DiscountStatus.New,
  );
  const [discountSelected, setDiscountSelected] =
    useState<IDiscountItemDTO | null>(null);

  const handleSearch = useCallback(() => {
    setIsVisible(false);
    dispatch(
      DiscountActions.search(
        fromDate,
        toDate,
        undefined,
        currentStatus,
        undefined,
      ),
    );
  }, [currentStatus, dispatch, fromDate, toDate]);

  const handleDeleteDiscount = () => {
    setIsConfirmModal(false);
    if (discountSelected) {
      dispatch(
        DiscountActions.deleteHeader(
          discountSelected.DISCOUNTID,
          `${discountSelected.DISCOUNTID}`.padStart(8, '0'),
          true,
          undefined,
        ),
      );
    }
  };

  const handleCreateUpdate = (item: IDiscountItemDTO | undefined) => {
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Discount.DETAIL,
      param: {isApproval},
    };
    dispatch(DiscountActions.setModel(-1, item, nav));
  };

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <SafeView>
      <Header
        title={AppStrings.Discount.Title}
        isMenu
        onMenuPress={() => setIsVisible(true)}
      />
      <Container>
        <SearchBox
          placeholder={AppStrings.Discount.SearchPlaceHolder}
          accessor="keySearch"
          dataSource={data}
          onSearch={(dataSearch) => setLocalData(dataSearch ?? [])}
        />
        <DiscountFilter
          currentValue={currentStatus}
          onChange={(status) => setCurrentStatus(status)}
        />
        <FlatListCommon
          isShowVertical={false}
          data={localData}
          renderItem={({item}) => (
            <DiscountItem
              item={item}
              onPress={() => handleCreateUpdate(item)}
              onLongPress={() => {
                setIsConfirmModal(true);
                setDiscountSelected(item);
              }}
            />
          )}
        />
      </Container>

      <ModalFilter
        title={AppString.Discount.ModalFilterTitle}
        fromDate={fromDate}
        toDate={toDate}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onDateChange={(strDate, type) => {
          if (type === 'fromDate') setFromDate(strDate);
          else setToDate(strDate);
        }}
        onFilter={() => handleSearch()}
      />
      {!isApproval && (
        <CircleButton onPress={() => handleCreateUpdate(undefined)} />
      )}
      <ConfirmModal
        isVisible={isConfirmModal}
        onClose={() => setIsConfirmModal(false)}
        onAccept={() => handleDeleteDiscount()}
      />
    </SafeView>
  );
};

export default DiscountListScreen;
