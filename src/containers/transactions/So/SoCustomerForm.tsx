import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import {Dropdown, DateRow, Input, Button} from '~/components/commons';
import {Row, Column, Container} from '~/components/sections';
import {Card} from '~/components/cards';
import {AppStrings, Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import {
  convertMmDdYyyyToDate,
  convertStringToDate,
  convertTimeStringToDate,
} from '~/helpers/DatetimeHelpers';
import SoAction from '~/redux/so/so.actions';
import {SoCustomerFormValidate} from '~/validates/SoValidate';

const SoCustomerForm = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const {customers, saleLocations} = useSelector(
    (state: RootState) => state.master,
  );
  const {soModel, isSubmitSuccess, currentScreen, trucks, receiverNames} =
    useSelector((state: RootState) => state.so);

  const [custId, setCustId] = useState<string>(soModel.CUSTID);

  React.useEffect(() => {
    if (isSubmitSuccess && currentScreen === ScreenType.SO.CREATE_CUSTOMER) {
      navigate.navigate(ScreenType.SO.CREATE_RECEPT);
    }
  }, [currentScreen, dispatch, isSubmitSuccess, navigate]);

  React.useEffect(() => {
    dispatch(SoAction.getTruckNo(custId));
    dispatch(SoAction.getReceiverName(custId));
  }, [custId, dispatch]);
  return (
    <Formik
      initialValues={soModel}
      validationSchema={SoCustomerFormValidate}
      onSubmit={(values) => {
        const obj = {...soModel, ...values};
        console.log({obj});
        dispatch(SoAction.createSoHeader(obj, ScreenType.SO.CREATE_CUSTOMER));
      }}>
      {({values, handleSubmit, setFieldValue}) => {
        return (
          <Container isIncludeScrollView>
            <Card>
              <Row>
                <Column>
                  <Dropdown
                    name="CUSTID"
                    label={AppStrings.SO.CustomerName}
                    data={customers}
                    selectedValue={values.CUSTID}
                    titles={['Mã KH', 'Tên Khách Hàng']}
                    accessors={['value', 'label']}
                    onSelect={({value}) => {
                      setCustId(value.toString());
                    }}
                    searchPlaceholder="Nhập mã hoặc tên khách hàng"
                  />
                </Column>
              </Row>
              <Row>
                <Column mobile={1}>
                  <DateRow
                    label={AppStrings.SO.DeliveryDate}
                    date={convertStringToDate(values.DELIVERYDATE ?? '')}
                    type="date"
                    name="DELIVERYDATE"
                  />
                </Column>
                <Column mobile={1}>
                  <Input
                    label={AppStrings.SO.DeliveryAddress}
                    value={values.PLACEDELIVERY ?? ''}
                    name="PLACEDELIVERY"
                  />
                </Column>
              </Row>
              <Row>
                <Column mobile={1}>
                  <Dropdown
                    selectedValue={values.TRUCK_NO}
                    name="TRUCK_NO"
                    data={trucks}
                    label={AppStrings.SO.TruckNumber}
                    searchPlaceholder="Nhập số xe"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <DateRow
                    type="time"
                    label={AppStrings.SO.TimeToReceive}
                    date={convertTimeStringToDate(values.RECEIVEHOUR)}
                    name="RECEIVEHOUR"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Dropdown
                    selectedValue={values.RECEIVERNAME}
                    name="RECEIVERNAME"
                    data={receiverNames}
                    label={AppStrings.SO.Recipient}
                    searchPlaceholder="Nhập tên người nhận"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Input
                    label={AppStrings.SO.RecipientsPhoneNumber}
                    value={values.RECEIVERPHONE ?? ''}
                    name="RECEIVERPHONE"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Dropdown
                    name="LOCATIONID"
                    label={AppStrings.SO.FarmExport}
                    data={saleLocations}
                    selectedValue={`${values.UNITID}${values.LOCATIONID}`}
                    searchPlaceholder="Nhập tên trại"
                    onSelect={(item) => {
                      const location = saleLocations.find(
                        (p) => p.value === item.value,
                      );
                      if (location) {
                        setFieldValue('LOCATIONID', location.LOCATIONID);
                        setFieldValue('UNITID', location.UNITID);
                      }
                    }}
                  />
                </Column>
              </Row>
            </Card>
            <Row>
              <Column style={{justifyContent: 'center'}}>
                <Button
                  title="Lưu Thông Tin Và Tiếp Tục"
                  radius={10}
                  iconRight={{type: 'AntDesign', name: 'right'}}
                  color={Colors.WHITE}
                  onPress={handleSubmit}
                />
              </Column>
            </Row>
          </Container>
        );
      }}
    </Formik>
  );
};

export default SoCustomerForm;
