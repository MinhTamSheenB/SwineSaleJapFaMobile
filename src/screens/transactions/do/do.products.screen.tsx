import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Header, Container, ConfirmModal} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {DoWizard, DoProduct} from '~/containers/transactions/Do';
import {
  FlatListCommon,
  CircleButton,
  Button,
  SafeView,
} from '~/components/commons';
import DoActions from '~/redux/do/do.actions';
import {RootState} from '~/redux/reducers';
import {IDoItemDetailModel} from '~/apis/types.service';
import ScreenType from '~/navigations/screen.constant';
import {MenuPermission} from '~/commons';

const DoProductsScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const {isInternalTransfer, userParams, drawerId} = useSelector(
    (state: RootState) => state.global,
  );
  const {items, headerModel} = useSelector((state: RootState) => state.dos);
  const [isVisibleConfirm, setVisibleConfirm] = React.useState<boolean>(false);
  const [doDetailSelected, setDoDetailSelected] =
    React.useState<IDoItemDetailModel | null>();

  React.useEffect(() => {
    const loadDoRel = drawerId === MenuPermission.DO_RELEASE_MENU_ID;
    dispatch(DoActions.getProductsDoNo(headerModel.DONO, loadDoRel));
  }, [dispatch, drawerId, headerModel.DONO]);

  const handleDeleteItem = (): void => {
    setVisibleConfirm(false);
    if (doDetailSelected)
      dispatch(DoActions.deleteDetail(doDetailSelected?.DODTID, true));
  };

  const handleCreateInitialProduct = () => {
    const localItem: IDoItemDetailModel = {
      DONO: headerModel.DONO,
      DODTID: 0,
      PLUSAMOUNT1: 0,
      PLUSAMOUNT2: 0,
      SUBAMOUNT1: 0,
      SUBAMOUNT2: 0,
      ROWSTATUS: 0,
      UPDATEDBY: userParams.userId,
      UNITID: headerModel.UNITID,
      REGIONID: headerModel.REGIONID,
      OFFICEID: headerModel.OFFICEID,
      DEPTID: headerModel.DEPTID,
    };
    dispatch(DoActions.setLocalItemModel(localItem));
    navigate.navigate(ScreenType.DO.ADD_PRODUCT);
  };

  return (
    <SafeView>
      <Header title={AppStrings.DO.DeliveryTitle} isMenu={false} disableThreeDot />
      <Container>
        <DoWizard currentStep={2} />
        <FlatListCommon
          isShowVertical={false}
          data={items}
          renderItem={({item}) => (
            <DoProduct
              item={item}
              onDelete={() => {
                setDoDetailSelected(item);
                setVisibleConfirm(true);
              }}
              onSelect={() => {
                dispatch(DoActions.setLocalItemModel(item));
                navigate.navigate(ScreenType.DO.ADD_PRODUCT);
              }}
            />
          )}
          footer={
            <Button
              title="Tổng Hợp Thông Tin Đơn Hàng"
              radius={50}
              color={Colors.WHITE}
              iconRight={{
                name: 'right',
                type: 'AntDesign',
              }}
              onPress={() => navigate.navigate(ScreenType.DO.SUMMARY)}
            />
          }
          contentContainerStyle={{paddingBottom: 10}}
        />
      </Container>
      {isInternalTransfer && (
        <CircleButton onPress={handleCreateInitialProduct} />
      )}
      <ConfirmModal
        isVisible={isVisibleConfirm}
        onClose={() => setVisibleConfirm(false)}
        onAccept={handleDeleteItem}
      />
    </SafeView>
  );
};

export default DoProductsScreen;
