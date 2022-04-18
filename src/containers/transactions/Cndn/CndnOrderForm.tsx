import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ICndnHeaderModel} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {Button, DateRow, Input} from '~/components/commons';
import {Container, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {convertMmDdYyyyToDate} from '~/helpers/DatetimeHelpers';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import {RootState} from '~/redux/reducers';

const CndnOrderForm = () => {
  const dispatch = useDispatch();
  const {model} = useSelector((state: RootState) => state.cndn);
  console.log({CNDNDATE: model.CNDNDATE});
  return (
    <>
      <Formik
        initialValues={model}
        onSubmit={(values) => {
          const temp: ICndnHeaderModel = {
            ...model,
            CNDNDATE: values.CNDNDATE,
            CREATEDDATE: values.CREATEDDATE,
          };
          const nav: INavigateScreen = {
            isNavigate: true,
            screen: ScreenType.Cndn.PRODUCTS,
          };
          dispatch(CndnActions.createUpdate(temp, nav));
        }}>
        {({values, handleSubmit}) => (
          <Container style={{width: '100%'}}>
            <View
              style={{
                backgroundColor: Colors.WHITE,
                marginTop: 20,
                paddingHorizontal: 20,
                elevation: 2,
                paddingVertical: 30,
                borderRadius: 20,
                marginBottom: 20,
              }}>
              <Row>
                <DateRow
                  type="date"
                  label="Ngày hạch toán"
                  date={convertMmDdYyyyToDate(values.CNDNDATE)}
                  name="CNDNDATE"
                />
              </Row>
              <Row>
                <DateRow
                  type="date"
                  label="Ngày hạch toán"
                  date={convertMmDdYyyyToDate(values.CREATEDDATE)}
                  name="CREATEDDATE"
                />
              </Row>
              <Row>
                <Input
                  label="Số Chứng Từ"
                  name="CNDNNO"
                  value={values.CNDNNO}
                />
              </Row>
            </View>

            <Button
              title="Lưu Và Tiếp Tục"
              color={Colors.WHITE}
              radius={20}
              onPress={handleSubmit}
            />
          </Container>
        )}
      </Formik>
    </>
  );
};

export default CndnOrderForm;
