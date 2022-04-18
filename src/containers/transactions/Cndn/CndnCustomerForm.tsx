import {Formik} from 'formik';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ICndnHeaderModel, ICustomerInfo} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {Accordion, Button, Dropdown, Input} from '~/components/commons';
import {Container, Row} from '~/components/sections';
import {Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';

const CndnCustomerForm = () => {
  const dispatch = useDispatch();

  const {model} = useSelector((state: RootState) => state.cndn);
  console.log({model: model.CNDNDATE})

  const {unitsSale, unitsOfCustomer, customers} = useSelector(
    (state: RootState) => state.master,
  );

  const [custId, setCustId] = useState<string | undefined>();

  React.useEffect(() => {
    dispatch(MasterActions.getCustomers());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(MasterActions.getSaleUnits(custId));
  }, [custId, dispatch]);

  React.useEffect(() => {
    dispatch(MasterActions.getUnitOfCustomer(custId ?? ' ', []));
  }, [custId, dispatch]);

  const handlePost = (values: ICndnHeaderModel) => {
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Cndn.ORDER,
    };

    dispatch(CndnActions.createUpdate(values, nav));
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <Formik
        initialValues={model}
        onSubmit={(values) => {
          console.log({values: values.CNDNDATE});
          handlePost(values);
        }}>
        {({values, setFieldValue, handleSubmit}) => (
          <Container isIncludeScrollView>
            <Accordion title="Khách Hàng" isOpen>
              <View style={{paddingHorizontal: 20}}>
                <Row>
                  <Dropdown
                    data={customers}
                    name="CUSTNO"
                    label="Khách hàng"
                    selectedValue={values.CUSTNO}
                    searchPlaceholder="Nhập tên/ mã khách hàng."
                    onSelect={(item) => {
                      const customer: ICustomerInfo | undefined =
                        customers.find((p) => p.CUSTOMERID === item.value);
                      if (customer) {
                        setFieldValue('CUSTNAME', item.value);
                        setFieldValue('CUSTADDRESS', customer.ADDRESS);
                        setCustId(item.value.toString());
                      } else {
                        setCustId(undefined);
                      }
                    }}
                  />
                </Row>
                <Row>
                  <Dropdown
                    data={unitsSale}
                    name="UNITID"
                    label="Đơn Vị"
                    selectedValue={values.UNITID}
                    searchPlaceholder="Nhập tên đơn vị"
                  />
                </Row>
                <Row>
                  <Dropdown
                    data={unitsOfCustomer}
                    name="UNITIDTO"
                    label="Đơn vị nhận"
                    selectedValue={values.UNITIDTO}
                    searchPlaceholder="Nhập tên đơn vị"
                  />
                </Row>

                <Row>
                  <Input value={values.NOTES} label="Diễn giải" name="NOTES" />
                </Row>
              </View>
            </Accordion>
            <Button
              title="Tiếp tục"
              radius={20}
              color={Colors.WHITE}
              onPress={handleSubmit}
            />
          </Container>
        )}
      </Formik>
    </View>
  );
};

export default CndnCustomerForm;
