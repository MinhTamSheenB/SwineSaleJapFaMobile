import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Header, Container, ConfirmModal, Row} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {SoWizard, SoProduct} from '~/containers/transactions/So';
import {
  FlatListCommon,
  CircleButton,
  Button,
  SafeView,
} from '~/components/commons';
import ScreenType from '~/navigations/screen.constant';
import SoAction from '~/redux/so/so.actions';
import {RootState} from '~/redux/reducers';
import {ISoDetailDeleteModel, ISoDetailModel} from '~/apis/types.service';

const SoCreateProductsScreen = (): JSX.Element => {
  const dispatch = useDispatch();

  const useNavigate = useNavigation();
  const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<number>();

  // Selector
  const {userParams} = useSelector((state: RootState) => state.global);
  const {details, soModel} = useSelector((state: RootState) => state.so);

  React.useEffect(() => {
    dispatch(SoAction.getDetailsByCode(soModel.SONO));
  }, [dispatch, soModel.SONO]);

  const handleDeleteDetail = (): void => {
    const detail = details.find((p) => p.SODTID === detailId);
    const detailObject: ISoDetailDeleteModel = {
      ...userParams,
      sodtID: detail?.SODTID!,
      soNo: detail?.SONO!,
    };
    dispatch(SoAction.deleteSoDetail(detailObject));
    setIsShowConfirm(false);
  };

  const handleSelectDetail = (): void => {
    const model: ISoDetailModel = {
      UPDATEDBY: userParams.userId,
      SODTID: 0,
      UNITID: soModel.UNITID,
      REGIONID: userParams.regionId?.toString(),
      OFFICEID: userParams.officeId!,
      DEPTID: userParams.deptId!,
      SONO: soModel.SONO,
      PRODUCTID: '',
      QTY: 0,
      BW_AVG: 0,
      PRICEGROUP: '',
      PRICE1: 0,
      PRICE2: 0,
      BW_TOTAL: 0,
      AMOUNT: 0,
      REDUCEPRICE1: 0,
      REDUCEPRICE2: 0,
    };
    dispatch(SoAction.selectedSoDetail(model));
    useNavigate.navigate(ScreenType.SO.ADD_PRODUCT);
  };

  return (
    <SafeView>
      <Header
        disableThreeDot
        title={AppStrings.SO.CustomersOrderForm}
        isMenu={false}
      />
      <Container isIncludeScrollView={false}>
        <SoWizard currentStep={2} />
        <FlatListCommon
          data={details}
          isSeparator
          isShowVertical={false}
          renderItem={({item}): JSX.Element => (
            <SoProduct
              detail={item}
              onDelete={(id) => {
                setIsShowConfirm(true);
                setDetailId(id);
              }}
            />
          )}
          contentContainerStyle={{paddingBottom: 10}}
          footer={
            <Row style={{justifyContent: 'center'}}>
              <Button
                title="Tiếp Tục"
                color={Colors.WHITE}
                radius={20}
                onPress={() => useNavigate.navigate(ScreenType.SO.DISCOUNT)}
              />
            </Row>
          }
        />
      </Container>
      <CircleButton onPress={handleSelectDetail} />
      <ConfirmModal
        isVisible={isShowConfirm}
        onClose={() => setIsShowConfirm(false)}
        onAccept={() => handleDeleteDetail()}
      />
    </SafeView>
  );
};

export default SoCreateProductsScreen;
