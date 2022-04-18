/* eslint-disable @typescript-eslint/no-use-before-define */
import {useRoute} from '@react-navigation/core';
import {Formik} from 'formik';
import React, {isValidElement, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DiscountStatus} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {
  DateRow,
  Dropdown,
  Icon,
  Input,
  SafeView,
  TextCustom,
} from '~/components/commons';
import {ConfirmModal, Container, Header, Row} from '~/components/sections';
import {AppStrings, Colors, Sizes} from '~/configs';
import {convertStringToDate} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import DiscountActions from '~/redux/discount/discount.actions';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import {DiscountFormValidate} from '~/validates/DiscountValidate';

type UserActionType = 'DELETE' | 'POST_RETURN';

const DiscountDetailScreen = () => {
  const dispatch = useDispatch();
  const router = useRoute();
  const {params} = router;

  const {model} = useSelector((state: RootState) => state.discount);
  const [custId, setCustId] = useState<string | undefined>(model?.CUSTID);
  const {discountTypeDropdownData, unitsSale, customers} = useSelector(
    (state: RootState) => state.master,
  );
  const [isConfirmModal, setConfirmModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<UserActionType | undefined>();

  const handleDeletePostReturnPost = () => {
    setConfirmModal(false);
    const discountNo = `${model?.DISCOUNTID}`.padStart(8, '0');
    const discountId = model?.DISCOUNTID ?? 0;
    if (actionType === 'POST_RETURN') {
      if (model != null) {
        if (model?.STATUS === DiscountStatus.New) {
          dispatch(
            DiscountActions.post(discountId, discountNo, true, undefined),
          );
        } else {
          dispatch(
            DiscountActions.returnPost(discountId, discountNo, true, undefined),
          );
        }
      }
    } else if (actionType === 'DELETE') {
      const nav: INavigateScreen = {
        isNavigate: true,
        screen: ScreenType.Discount.LIST,
      };
      dispatch(DiscountActions.deleteHeader(discountId, discountNo, true, nav));
    }
  };

  useEffect(() => {
    dispatch(MasterActions.getCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(MasterActions.getSaleUnits(custId));
  }, [dispatch, custId]);

  return (
    <SafeView>
      <Header
        title={AppStrings.Discount.DetailTitle}
        isMenu={false}
        noShadow
        disableThreeDot
      />
      <Formik
        initialValues={model!}
        validationSchema={DiscountFormValidate}
        onSubmit={(values) => {
          dispatch(DiscountActions.createOrUpdate(values, true));
        }}>
        {({values, handleSubmit, setFieldValue}) => (
          <>
            <Container
              isIncludeScrollView
              style={{
                marginHorizontal: 20,
                flex: 1,
                elevation: 3,
              }}>
              <Row>
                <Input
                  name="DISCOUNTID"
                  value={`${values.DISCOUNTID}`.padStart(8, '0')}
                  label="Mã Chiết Khấu"
                  readonly
                />
              </Row>
              <Row>
                <DateRow
                  label="Ngày Chiết Khấu"
                  type="date"
                  name="TDATE"
                  date={convertStringToDate(values.TDATE ?? '')}
                />
              </Row>
              <Row>
                <Dropdown
                  label="Khách hàng"
                  name="CUSTID"
                  selectedValue={values.CUSTID}
                  data={customers}
                  searchPlaceholder={AppStrings.Discount.seachCustomer}
                  onSelect={(item) => {
                    setCustId(`${item.value}`);
                    setFieldValue('CUSTNAME', item.label);
                    const customer = customers.find(
                      (p) => p.CUSTOMERID === item.value,
                    );
                    if (customer) {
                      setFieldValue('CUSTADDRESS', customer.ADDRESS);
                    }
                  }}
                />
              </Row>
              <Row>
                <Input name="NOTES" label="Chú thích" value={values.NOTES} />
              </Row>
              <Row>
                <Input
                  name="AMOUNT"
                  label="Số tiền"
                  isNumber
                  value={numberFormat(values.AMOUNT)}
                />
              </Row>
              <Row>
                <Dropdown
                  label="Loại Chiết Khấu"
                  name="DISCOUNTTYPE"
                  selectedValue={values.DISCOUNTTYPE}
                  data={discountTypeDropdownData}
                  modalTitle={AppStrings.Discount.discountTypeModalTitle}
                />
              </Row>
              <Row>
                <Dropdown
                  label="Đơn Vị"
                  name="UNITID"
                  selectedValue={values.UNITID}
                  data={unitsSale}
                  modalTitle={AppStrings.Discount.unitModalTitle}
                />
              </Row>
            </Container>

            <View style={styles.viewAction}>
              {params && params.isApproval && (
                <TouchableOpacity
                  disabled={!values.DISCOUNTID}
                  onPress={() => {
                    setConfirmModal(true);
                    setActionType('POST_RETURN');
                  }}>
                  <View style={styles.btnContainer}>
                    <Icon
                      name={
                        model?.STATUS === DiscountStatus.New ? 'lock' : 'unlock'
                      }
                      type="FontAwesome"
                      color={
                        values.DISCOUNTID ? Colors.DANGER : Colors.DISABLED
                      }
                      style={styles.btnIcon}
                    />
                    <TextCustom
                      style={{
                        ...styles.btnText,
                        color: values.DISCOUNTID
                          ? Colors.ORIGIN
                          : Colors.DISABLED,
                      }}>
                      {model?.STATUS === DiscountStatus.New
                        ? 'Ghi sổ'
                        : 'Hủy ghi sổ'}
                    </TextCustom>
                  </View>
                </TouchableOpacity>
              )}
              {!params ||
                (!params.isApproval && (
                  <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.btnContainer}>
                      <Icon
                        name="save"
                        type="FontAwesome"
                        color={Colors.SUCCESS}
                        style={styles.btnIcon}
                      />
                      <TextCustom
                        style={[styles.btnText, {color: Colors.SUCCESS}]}>
                        Lưu Chiết Khấu
                      </TextCustom>
                    </View>
                  </TouchableOpacity>
                ))}
              {!params ||
                (!params.isApproval && (
                  <TouchableOpacity
                    disabled={!values.DISCOUNTID}
                    onPress={() => {
                      setActionType('DELETE');
                      setConfirmModal(true);
                    }}>
                    <View style={styles.btnContainer}>
                      <Icon
                        name="close"
                        type="FontAwesome"
                        color={
                          values.DISCOUNTID ? Colors.DANGER : Colors.DISABLED
                        }
                        style={styles.btnIcon}
                      />
                      <TextCustom
                        style={{
                          ...styles.btnText,
                          color: values.DISCOUNTID
                            ? Colors.DANGER
                            : Colors.DISABLED,
                        }}>
                        Xóa
                      </TextCustom>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </>
        )}
      </Formik>
      <ConfirmModal
        isVisible={isConfirmModal}
        onAccept={() => handleDeletePostReturnPost()}
        onClose={() => setConfirmModal(false)}
      />
    </SafeView>
  );
};

export default DiscountDetailScreen;
const styles = StyleSheet.create({
  viewAction: {
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-around',
    elevation: 10,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  btnIcon: {fontSize: Sizes.Icon, marginRight: 5},
  btnText: {color: Colors.GRAY, fontSize: Sizes.Content},
});
