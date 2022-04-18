import {useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CnDnStatus,
  ICndnDetailDtoItem,
  ICndnDetailModel,
  IMasterResponseCommon,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {Button, Dropdown, Input} from '~/components/commons';
import {Container, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';

const CndnAddProduct = () => {
  const route = useRoute();
  const itemInitial: ICndnDetailModel = route.params.item;
  const dispatch = useDispatch();
  const {userParams} = useSelector((state: RootState) => state.global);
  const {productsDropdownData, productsUnit} = useSelector(
    (state: RootState) => state.master,
  );

  React.useEffect(() => {
    dispatch(MasterActions.getProductByUnit(userParams.unitId!));
  }, [dispatch, userParams.unitId]);
  return (
    <>
      <Formik
        initialValues={itemInitial}
        onSubmit={(values) => {
          const nav: INavigateScreen = {
            isNavigate: true,
            screen: ScreenType.Cndn.PRODUCTS,
          };
          dispatch(CndnActions.createDetail(values, nav));
        }}>
        {({values, setFieldValue, handleSubmit}) => (
          <Container isIncludeScrollView>
            <View
              style={{
                backgroundColor: Colors.WHITE,
                marginTop: 20,
                paddingHorizontal: 20,
                elevation: 5,
                paddingVertical: 30,
                borderRadius: 10,
                marginBottom: 20,
              }}>
              <Row>
                <Dropdown
                  label="Hàng hóa"
                  name="PROD_ID"
                  data={productsDropdownData}
                  selectedValue={values.PROD_ID}
                  searchPlaceholder="Nhập mã/ tên hàng hóa."
                  onSelect={(item) => {
                    const product: IMasterResponseCommon = productsUnit.find(
                      (p) => p.ID === item.value,
                    );
                    setFieldValue('PROD_NAME', product.Name);
                    setFieldValue('PROD_UOM', product.Name2);
                  }}
                />
              </Row>
              <Row>
                <Input
                  label="Đơn vị tính"
                  value={values.PROD_UOM}
                  name="PROD_UOM"
                  readonly
                />
              </Row>
              <Row>
                <Input
                  label="Số lượng"
                  value={`${values.PROD_QTY}`}
                  name="PROD_QTY"
                  isNumber
                />
              </Row>
              <Row>
                <Input
                  label="Đơn giá"
                  value={numberFormat(values.PROD_PRICE)}
                  name="PROD_PRICE"
                  isNumber
                />
              </Row>
              <Row>
                <Input
                  label="Thành tiền"
                  value={numberFormat(values.PROD_QTY * values.PROD_PRICE)}
                  name="PROD_AMOUNT"
                  isNumber
                  readonly
                />
              </Row>
              <Row>
                <Input label="Diễn giải" value={values.NOTES} name="NOTES" />
              </Row>
              <Row>
                <Button
                  iconLeft={{type: 'AntDesign', name: 'save'}}
                  title="Lưu Hàng Hóa"
                  color={Colors.WHITE}
                  radius={20}
                  onPress={handleSubmit}
                />
              </Row>
            </View>
          </Container>
        )}
      </Formik>
    </>
  );
};

export default CndnAddProduct;
