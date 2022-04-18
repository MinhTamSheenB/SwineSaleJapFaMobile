import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import {Card} from '~/components/cards';
import {Container, Row, Column} from '~/components/sections';
import {DateRow, Input, Button} from '~/components/commons';
import {Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import {convertMmDdYyyyToDate, convertStringToDate} from '~/helpers/DatetimeHelpers';
import SoAction from '~/redux/so/so.actions';

const SoReceiptInfoForm = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const {soModel, isSubmitSuccess, currentScreen} = useSelector(
    (state: RootState) => state.so,
  );

  React.useEffect(() => {
    if (isSubmitSuccess && currentScreen === ScreenType.SO.CREATE_RECEPT)
      navigate.navigate(ScreenType.SO.PRODUCT_LIST);
  }, [currentScreen, isSubmitSuccess, navigate]);

  return (
    <Formik
      initialValues={soModel}
      onSubmit={(values) => {
        dispatch(SoAction.createSoHeader(values, ScreenType.SO.CREATE_RECEPT));
      }}>
      {({values, handleSubmit}) => (
        <>
          <Card>
            <Container>
              <Row>
                <Column>
                  <DateRow
                    label="Ngày Hạch Toán"
                    date={convertStringToDate(values.SODATE ?? '')}
                    name="SODATE"
                    type="date"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <DateRow
                    label="Ngày Chứng Từ"
                    date={convertStringToDate(values.SODATE ?? '')}
                    type="date"
                    name="SODATE"
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Input label="Chứng Từ Số" value={values.SONO} name="SONO" />
                </Column>
              </Row>
              <Row>
                <Column>
                  <DateRow
                    label="Ngày Chốt Đơn"
                    date={convertStringToDate(values.SODATE ?? '')}
                    type="date"
                    name="SODATE"
                  />
                </Column>
              </Row>
            </Container>
          </Card>
          <Row style={{justifyContent: 'center'}}>
            <Button
              title="Lưu Chứng Từ"
              radius={10}
              color={Colors.WHITE}
              iconRight={{type: 'AntDesign', name: 'right'}}
              onPress={handleSubmit}
            />
          </Row>
        </>
      )}
    </Formik>
  );
};

export default SoReceiptInfoForm;
