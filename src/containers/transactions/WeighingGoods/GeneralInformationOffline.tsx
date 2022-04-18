import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, DateRow, Input} from '~/components/commons';
import {Column, Container, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {
  convertStringToDate,
  convertTimeStringToDate,
} from '~/helpers/DatetimeHelpers';
import {RootState} from '~/redux/reducers';
import {WGoodHeaderFormValidate} from '~/validates/WeighingGoodsValidate';
import WGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';

const GeneralInformationOffline = () => {
  const dispatch = useDispatch();
  const {wOfflineModel} = useSelector((state: RootState) => state.wGoods);
  return (
    <Formik
      enableReinitialize
      validationSchema={WGoodHeaderFormValidate}
      initialValues={wOfflineModel!}
      onSubmit={(value) => {
        dispatch(WGoodsActions.saveHeaderOffline(value, true));
      }}>
      {({values, handleSubmit, errors}) => (
        <Container
          bgColor={Colors.WHITE}
          style={{paddingTop: 15}}
          isIncludeScrollView>
          <>
            <Row>
              <Column>
                <Input label="Phiếu xuất kho" name="DONO" value={values.DONO} />
              </Column>
              <Column>
                <Input label="Số xe" name="TRUCKNO" value={values.TRUCKNO} />
              </Column>
            </Row>
            <Row>
              <Column>
                <DateRow
                  label="Ngày xuất"
                  name="SCALEDATE"
                  date={convertStringToDate(values.SCALEDATE!)}
                  type="date"
                />
              </Column>
              <Column>
                <Input
                  label="Khách hàng"
                  name="CUSTNAME"
                  value={values.CUSTNAME}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  label="Nhân viên cân"
                  name="WEIGHMAN"
                  value={values.WEIGHMAN ?? ''}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <DateRow
                  label="Giờ vào"
                  date={convertTimeStringToDate(values.DEPARTTIME)}
                  type="time"
                  name="DEPARTTIME"
                />
              </Column>
              <Column>
                <DateRow
                  label="Giờ ra"
                  date={convertTimeStringToDate(values.ARRIVALTIME)}
                  type="time"
                  name="ARRIVALTIME"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  label="KM đi"
                  name="KMSTART"
                  value={`${values.KMSTART}`}
                  isNumber
                />
              </Column>
              <Column>
                <Input
                  label="KM đến"
                  name="KMARRIVED"
                  value={`${values.KMARRIVED}`}
                  isNumber
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  label="Số seal"
                  name="SEALNUMBER"
                  value={values.SEALNUMBER}
                />
              </Column>
              <Column>
                <Input
                  label="Tình trạng seal"
                  name="SEALCONDITION"
                  value={values.SEALCONDITION}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input label="Ghi chú" name="REMAKS" value={values.REMAKS} />
              </Column>
            </Row>
          </>
          <View style={{marginVertical: 10}}>
            <Button
              title="Lưu Thông Tin"
              color={Colors.WHITE}
              radius={10}
              onPress={handleSubmit}
            />
          </View>
        </Container>
      )}
    </Formik>
  );
};

export default GeneralInformationOffline;
