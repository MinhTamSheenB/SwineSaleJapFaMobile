import React from 'react';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Header, Container, Row, Column} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {Card} from '~/components/cards';
import {Input, DateRow, Button, SafeView} from '~/components/commons';
import {DoWizard} from '~/containers/transactions/Do';
import {RootState} from '~/redux/reducers';
import {convertStringToDate} from '~/helpers/DatetimeHelpers';

import ScreenType from '~/navigations/screen.constant';
import DoActions from '~/redux/do/do.actions';
import {INavigateScreen} from '~/commons/types';

const DoReceptScreen = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const {headerModel} = useSelector((state: RootState) => state.dos);
  const {isInternalTransfer} = useSelector((state: RootState) => state.global);
  return (
    <SafeView>
      <Header title={AppStrings.DO.DeliveryTitle} isMenu={false} disableThreeDot />
      <DoWizard currentStep={1} />
      <Formik
        enableReinitialize
        initialValues={headerModel}
        onSubmit={(values) => {
          if (!isInternalTransfer) {
            navigate.navigate(ScreenType.DO.PRODUCTS);
          } else {
            const nav: INavigateScreen = {
              screen: ScreenType.DO.PRODUCTS,
              isNavigate: true,
            };
            dispatch(DoActions.createUpdateDoHeaderModel(values, nav));
          }
        }}>
        {({values, handleSubmit}) => (
          <Container>
            <Row>
              <Card>
                <Row>
                  <Column>
                    <DateRow
                      label="Ngày Hạch Toán"
                      name="CREATEDATE"
                      date={
                        values.CREATEDATE
                          ? convertStringToDate(values.CREATEDATE!)
                          : new Date()
                      }
                      type="date"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <DateRow
                      label="Ngày Chứng Từ"
                      date={
                        values.DODATE
                          ? convertStringToDate(values.DODATE!)
                          : new Date()
                      }
                      type="date"
                      name="DODATE"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Chứng Từ Số"
                      value={values.DONO}
                      name="DONO"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <DateRow
                      label="Ngày Chốt Đơn"
                      date={
                        values.DODATE
                          ? convertStringToDate(values.DODATE!)
                          : new Date()
                      }
                      name="DODATE"
                      type="date"
                    />
                  </Column>
                </Row>
              </Card>
            </Row>
            <Row>
              <Button
                radius={20}
                title="Lưu Thông Tin Chứng Từ"
                color={Colors.WHITE}
                iconRight={{
                  type: 'AntDesign',
                  name: 'right',
                }}
                onPress={handleSubmit}
              />
            </Row>
          </Container>
        )}
      </Formik>
    </SafeView>
  );
};

export default DoReceptScreen;
