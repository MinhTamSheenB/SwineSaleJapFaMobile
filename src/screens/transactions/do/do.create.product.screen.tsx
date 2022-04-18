import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import {IMasterResponseCommon} from '~/apis/types.service';
import {Button, Dropdown, Input, SafeView} from '~/components/commons';
import {Container, Header, Row} from '~/components/sections';
import {Colors} from '~/configs';
import DoActions from '~/redux/do/do.actions';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import {formatDouble} from '~/helpers/UtilitiesHelper';

type FieldType = 'PRODUCTID' | '';

const DoCreateProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {userParams, isInternalTransfer} = useSelector(
    (state: RootState) => state.global,
  );
  const {itemModel} = useSelector((state: RootState) => state.dos);
  const {productsDropdownData, productsUnit} = useSelector(
    (state: RootState) => state.master,
  );

  React.useEffect(() => {
    dispatch(MasterActions.getProductByUnit(userParams.unitId!));
  }, [dispatch, userParams.unitId]);

  const calculatorBw = (bwTotal: number, qty: number): number => {
    if (!bwTotal || !qty || qty < 1) return 0;
    return bwTotal / qty;
  };

  return (
    <SafeView>
      <Header title="Thêm Hàng Hóa" isMenu={false} noShadow />
      <Formik
        initialValues={itemModel}
        onSubmit={(values) => {
          if (isInternalTransfer) {
            dispatch(DoActions.createUpdateProductItem(values, true));
          } else {
            navigate.goBack();
          }
        }}>
        {({handleSubmit, values, setFieldValue}) => (
          <Container bgColor={Colors.WHITE} isIncludeScrollView>
            <View style={{marginHorizontal: 20}}>
              <Row>
                <Dropdown
                  label="Hàng Hóa"
                  name="PRODUCTID"
                  data={productsDropdownData}
                  selectedValue={values.PRODUCTID}
                  searchPlaceholder="Nhập tên, mã sản phẩm"
                  disabled={!isInternalTransfer}
                  onSelect={(item) => {
                    const product: IMasterResponseCommon | undefined =
                      productsUnit.find((p) => p.ID === item.value);
                    if (product) {
                      setFieldValue('PRODUCTNAME', product.Name);
                      setFieldValue('MEASURE', product.Name2);
                    }
                  }}
                />
              </Row>
              <Row>
                <Input
                  label="Đơn Vị Tính"
                  value={values.MEASURE}
                  name="MEASURE"
                  readonly
                />
              </Row>
              <Row>
                <Input
                  label="Số Lượng"
                  value={values.QTY?.toString() ?? '0'}
                  name="QTY"
                  isNumber
                  onValueChange={(valNum) => {
                    const value = calculatorBw(
                      valNum ?? 0,
                      values.BW_TOTAL ?? 0,
                    );
                    setFieldValue('BW_AVG', value);
                  }}
                />
              </Row>
              <Row>
                <Input
                  label="Tổng Trọng Lượng"
                  value={values.BW_TOTAL?.toString() ?? '0'}
                  name="BW_TOTAL"
                  isNumber
                  onValueChange={(valNum) => {
                    const value = calculatorBw(valNum ?? 0, values.QTY ?? 0);
                    setFieldValue('BW_AVG', value);
                  }}
                />
              </Row>
              <Row>
                <Input
                  label="Trọng Lượng Bình Quân"
                  value={`${formatDouble(values.BW_AVG)}`}
                  name="BW_AVG"
                  isNumber
                  readonly
                />
              </Row>
              <Row>
                <Input label="Ghi Chú" value={values.REMARKS} name="REMARKS" />
              </Row>
              <Row>
                <Button
                  title="Lưu Thông Tin"
                  radius={20}
                  color={Colors.WHITE}
                  onPress={handleSubmit}
                />
              </Row>
            </View>
          </Container>
        )}
      </Formik>
    </SafeView>
  );
};

export default DoCreateProductScreen;
