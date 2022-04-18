import React from 'react';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Container, Row, Column} from '~/components/sections';
import {Card} from '~/components/cards';
import {Dropdown, DateRow, Input, Button} from '~/components/commons';
import {AppStrings, Colors} from '~/configs';
import {INavigateScreen} from '~/commons/types';
import AppString from '~/configs/strings';
import {
  convertStringToDate,
  convertTimeStringToDate,
} from '~/helpers/DatetimeHelpers';
import {RootState} from '~/redux/reducers';
import MasterActions from '~/redux/master/master.actions';
import ScreenType from '~/navigations/screen.constant';
import {DoInformationFormValidate} from '~/validates/InternalTransferValidate';
import DoActions from '~/redux/do/do.actions';

const DoOrderInformation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const {isInternalTransfer} = useSelector((state: RootState) => state.global);

  const {headerModel, trucks, receiverNames} = useSelector(
    (state: RootState) => state.dos,
  );
  const {saleLocations, customers} = useSelector(
    (state: RootState) => state.master,
  );

  React.useEffect(() => {
    dispatch(MasterActions.getCustomers());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(DoActions.getTruckNo());
    dispatch(DoActions.getReceiverName());
  }, [dispatch]);

  return (
    <Formik
      initialValues={headerModel}
      onSubmit={(values) => {
        if (!isInternalTransfer) {
          navigate.navigate(ScreenType.DO.RECEPT);
        } else {
          const nav: INavigateScreen = {
            isNavigate: true,
            screen: ScreenType.DO.RECEPT,
          };
          dispatch(DoActions.createUpdateDoHeaderModel(values, nav));
        }
      }}
      validationSchema={
        isInternalTransfer ? DoInformationFormValidate : undefined
      }>
      {({values, handleSubmit, setFieldValue}) => {
        return (
          <Container isIncludeScrollView>
            <Card>
              <Row>
                <Column>
                  <Dropdown
                    name="LOCATIONID"
                    label={AppStrings.DO.farm}
                    selectedValue={`${values.UNITID}${values.LOCATIONID}`}
                    data={saleLocations}
                    disabled={!isInternalTransfer}
                    searchPlaceholder="Nhập tên trại cần tìm"
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
              <Row>
                <Column>
                  <Dropdown
                    label={AppStrings.DO.customerName}
                    name="CUSTID"
                    selectedValue={
                      isInternalTransfer
                        ? `${values.UNITIDTO}${values.CUSTID}`
                        : values.CUSTID
                    }
                    data={isInternalTransfer ? saleLocations : customers}
                    disabled={!isInternalTransfer}
                    searchPlaceholder="Nhập tên, mã khách hàng"
                    onSelect={(item) => {
                      const location = saleLocations.find(
                        (p) => p.value === item.value,
                      );
                      if (location) {
                        setFieldValue('CUSTID', location.LOCATIONID);
                        setFieldValue('UNITIDTO', location.UNITID);
                      }
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <DateRow
                    label={AppString.DO.deliveryDate}
                    date={convertStringToDate(values.DODATE)}
                    name="SODATE"
                    type="date"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Input
                    label={AppStrings.DO.deliveryAddress}
                    value={values.PLACEDELIVERY ?? ''}
                    name="PLACEDELIVERY"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Dropdown
                    selectedValue={values.TRUCK_NO}
                    name="TRUCK_NO"
                    data={trucks}
                    label={AppStrings.DO.truckNo}
                    searchPlaceholder="Nhập số xe"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <DateRow
                    type="time"
                    label={AppStrings.DO.deliveryTime}
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
                    label={AppStrings.DO.receiverName}
                    searchPlaceholder="Nhập số xe"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Input
                    label={AppStrings.DO.receiverPhone}
                    value={`${values.RECEIVERPHONE}`}
                    name="RECEIVERPHONE"
                    isNumber
                  />
                </Column>
              </Row>

              <Row>
                <Column>
                  <Input
                    label={AppStrings.DO.saleMan}
                    value={values.SALEMAN ?? ''}
                    name="SALEMAN"
                  />
                </Column>
                <Column>
                  <Input
                    label={AppStrings.DO.supervisor}
                    value={values.SALESPV ?? ''}
                    name="SALESPV"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Input
                    label={AppStrings.DO.note}
                    name="REMARKS"
                    value={values.REMARKS}
                  />
                </Column>
              </Row>
              <Row>
                <Button
                  onPress={handleSubmit}
                  title={AppStrings.DO.submitTitle}
                  color={Colors.WHITE}
                  radius={20}
                  iconRight={{
                    name: 'arrowright',
                    type: 'AntDesign',
                  }}
                />
              </Row>
            </Card>
          </Container>
        );
      }}
    </Formik>
  );
};

export default DoOrderInformation;
