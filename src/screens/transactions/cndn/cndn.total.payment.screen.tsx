import {Formik, useFormikContext} from 'formik';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ICndnHeaderModel} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {Button, CheckBox, Input, SafeView} from '~/components/commons';
import {Column, Container, Header, Row} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {CndnWizard} from '~/containers/transactions/Cndn';
import {doubleFormat, numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import {RootState} from '~/redux/reducers';
import SoAction from '~/redux/so/so.actions';

const CndnTotalPaymentScreen = () => {
  const dispatch = useDispatch();
  const {model} = useSelector((state: RootState) => state.cndn);
  const {PIT} = useSelector((state: RootState) => state.so);

  useEffect(() => {
    dispatch(SoAction.getPit());
  }, [dispatch]);

  const AutoCalculatorValue = (): React.ReactElement | null => {
    const {values, setFieldValue} = useFormikContext<ICndnHeaderModel>();

    useEffect(() => {
      const pitPercent = PIT / 100;
      const TOTALAMT = values.TOTALAMT ?? 0;

      const P_USAGEDIS = values.PIT_FLAG ? TOTALAMT * pitPercent : 0;
      const S_USAGEDIS = TOTALAMT ?? 0 - P_USAGEDIS;

      console.log({pitPercent, TOTALAMT, P_USAGEDIS, S_USAGEDIS});
      setFieldValue('PIT', PIT);
      setFieldValue('P_USAGEDIS', P_USAGEDIS);
      setFieldValue('S_USAGEDIS', S_USAGEDIS);
    }, [setFieldValue, values.PIT_FLAG, values.TOTALAMT]);

    return null;
  };

  return (
    <SafeView>
      <Header title={AppStrings.Cndn.titleCreate} isMenu={false} noShadow />
      <CndnWizard currentStep={2} />
      <Formik
        initialValues={model}
        onSubmit={(values) => {
          const nav: INavigateScreen = {
            screen: ScreenType.Cndn.SUMMARY,
            isNavigate: true,
            param: {cndnNo: model.CNDNNO},
          };
          dispatch(CndnActions.createUpdate(values, nav));
        }}>
        {({values, handleSubmit}) => {
          return (
            <Container>
              <View style={{backgroundColor: Colors.WHITE}}>
                <Row>
                  <Column>
                    <CheckBox
                      name="PIT_FLAG"
                      checked={values.PIT_FLAG}
                      lable={`Trích thuế TNCN (${PIT}%)`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Số tiền trích thuế"
                      name="P_USAGEDIS"
                      value={doubleFormat(values.P_USAGEDIS)}
                      readonly
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      name="TOTALQTY"
                      value={numberFormat(values.TOTALQTY, 'CON')}
                      label="Tổng số lượng:"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      name="TOTALAMT"
                      value={numberFormat(values.TOTALAMT)}
                      label="Tổng tiền:"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      multiline
                      label="Diễn giải"
                      name="NOTES"
                      value={values.NOTES}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Button title="Lưu và tiếp tục" onPress={handleSubmit} />
                  </Column>
                </Row>
              </View>
              <AutoCalculatorValue />
            </Container>
          );
        }}
      </Formik>
    </SafeView>
  );
};

export default CndnTotalPaymentScreen;
