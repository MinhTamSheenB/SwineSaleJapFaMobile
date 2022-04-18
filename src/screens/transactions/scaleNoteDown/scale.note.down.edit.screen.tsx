import {useNavigation} from '@react-navigation/core';
import {Formik} from 'formik';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  Accordion,
  Button,
  DateRow,
  Input,
  SafeView,
} from '~/components/commons';
import {Column, Container, Header, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {ScaleNoteDownDoInfo} from '~/containers/transactions/SaleNoteDown';
import {convertStringToDate} from '~/helpers/DatetimeHelpers';
import {RootState} from '~/redux/reducers';
import ScaleNoteDownActions from '~/redux/scaleNoteDown/scale.note.down.actions';

const ScaleNoteDownEditScreen = () => {
  const dispatch = useDispatch();
  const {model} = useSelector((state: RootState) => state.scaleNoteDown);

  return (
    <SafeView>
      <Header isMenu={false} title="(2) Điều chỉnh phiếu cân" disableThreeDot />
      <Container isIncludeScrollView>
        <ScaleNoteDownDoInfo
          doNo={model?.DONO ?? '----'}
          custName={model?.CUSTNAME}
          farmAddress={model?.LOCATIONADDRESS}
          from={model?.LOCATIONNAME}
          receiverName={model?.RECEIVERNAME}
        />
        <Accordion title="Thông tin phiếu cân" isOpen>
          {model && (
            <Formik
              enableReinitialize
              // validationSchema={WGoodsItemValidate}
              initialValues={model}
              onSubmit={(value) => {
                dispatch(ScaleNoteDownActions.createUpdateHeader(value, true));
              }}>
              {({values, handleSubmit, setFieldValue}) => {
                return (
                  <View>
                    <Row>
                      <Column>
                        <Input
                          value={values.NAME_VN}
                          name="NAME_VN"
                          label="Sản phẩm:"
                          readonly
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Input
                          value={values.ROOTSCALEID}
                          name="ROOTSCALEID"
                          label="Mã cân gốc:"
                          readonly
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Input
                          value={values.WEIGHMAN}
                          name="WEIGHMAN"
                          label="Nhân viên cân:"
                        />
                      </Column>
                      <Column>
                        <DateRow
                          date={convertStringToDate(values.SCALEDATE ?? '')}
                          type="date"
                          name="SCALEDATE"
                          label="Ngày cân:"
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Input
                          value={values.TRUCKNO}
                          name="TRUCKNO"
                          label="Nhân viên cân:"
                        />
                      </Column>
                      <Column>
                        <Input
                          value={`${values.TOTALQTY}`}
                          name="TOTALQTY"
                          label="Tổng số con:"
                          readonly
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Input
                          value={values.FLOCKCODE}
                          name="FLOCKCODE"
                          label="Mã đàn trại xuất:"
                        />
                      </Column>
                      <Column>
                        <Input
                          value={values.FLOCKNAME}
                          name="FLOCKNAME"
                          label="Mã đàn trại nhận:"
                          readonly
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Input
                          multiline
                          value={values.REMAKS}
                          name="REMAKS"
                          label="Lý do điều chỉnh"
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Button
                          title="Lưu điều chỉnh"
                          color={Colors.WHITE}
                          iconLeft={{name: 'save', type: 'AntDesign'}}
                          onPress={handleSubmit}
                        />
                      </Column>
                    </Row>
                  </View>
                );
              }}
            </Formik>
          )}
        </Accordion>
      </Container>
    </SafeView>
  );
};

export default ScaleNoteDownEditScreen;
const styles = StyleSheet.create({
  container: {},
});
