import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik, useFormikContext} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {Card} from '~/components/cards';
import {Column, Row} from '~/components/sections';
import {Input, Button, CheckBox} from '~/components/commons';
import {Colors} from '~/configs';
import {RootState} from '~/redux/reducers';
import SoAction from '~/redux/so/so.actions';
import ScreenType from '~/navigations/screen.constant';
import {doubleFormat} from '~/helpers/UtilitiesHelper';
import {ISoHeaderModel} from '~/apis/types.service';

const SoDiscountForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {soModel, isSubmitSuccess, currentScreen, PIT, soDetail} = useSelector(
    (state: RootState) => state.so,
  );

  React.useEffect(() => {
    if (isSubmitSuccess && currentScreen === ScreenType.SO.DISCOUNT) {
      navigate.navigate(ScreenType.SO.SUMMARY);
    }
  }, [currentScreen, isSubmitSuccess, navigate]);

  React.useEffect(() => {
    dispatch(SoAction.getPit());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(SoAction.getHeaderInfoAndUpdateLocalModel(soModel.SONO));
  }, [dispatch, soModel.SONO]);

  const AutoCalculatorValue = (): React.ReactElement | null => {
    const {values, setFieldValue} = useFormikContext<ISoHeaderModel>();

    useEffect(() => {
      const pitPercent = PIT / 100;
      const DISCOUNT = values.DISCOUNT ?? 0;
      const TOTALAMT = values.TOTALAMT ?? 0;

      const P_USAGEDIS = values.PIT_FLAG ? DISCOUNT * pitPercent : 0;
      const S_USAGEDIS = TOTALAMT ?? 0 - P_USAGEDIS;

      const TOTALAMTAFTERVAT = TOTALAMT - DISCOUNT;
      const TOTAL_MUST_COLLECT = TOTALAMTAFTERVAT + P_USAGEDIS;

      setFieldValue('P_USAGEDIS', P_USAGEDIS);
      setFieldValue('S_USAGEDIS', S_USAGEDIS);
      setFieldValue('TOTALAMTAFTERVAT', TOTALAMTAFTERVAT);
      setFieldValue('TOTAL_MUST_COLLECT', TOTAL_MUST_COLLECT);
    }, [
      setFieldValue,
      values.DISCOUNT,
      values.PIT_FLAG,
      values.TOTALAMT,
      values.TOTALAMTAFTERVAT,
    ]);

    useEffect(() => {
      let totalAmount = 0;
      if (soDetail && soDetail.SODETAILS) {
        // eslint-disable-next-line prettier/prettier
        totalAmount = soDetail?.SODETAILS?.reduce((temp, current) => temp + (current.AMOUNT ?? 0), 0);
      }
      setFieldValue('SUM_ACTAMOUNT', totalAmount);
    }, [setFieldValue]);
    return null;
  };

  return (
    <Formik
      enableReinitialize
      initialValues={soModel}
      onSubmit={(values) => {
        dispatch(SoAction.createSoHeader(values, ScreenType.SO.DISCOUNT));
      }}>
      {({values, handleSubmit}) => (
        <>
          <Card>
            <Row>
              <Column>
                <Input
                  label="NV B??n H??ng"
                  value={values.SALEMAN}
                  name="SALEMAN"
                />
              </Column>
              <Column>
                <Input
                  label="NV Gi??m S??t"
                  value={values.SALESPV}
                  name="SALESPV"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  isNumber
                  label="T???ng Ti???n Tr?????c Chuy???n Kho???n"
                  value={doubleFormat(values.TOTALAMT, 'VN??')}
                  name="TOTALAMT"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  isNumber
                  label="Chi???t Kh???u"
                  value={doubleFormat(values.DISCOUNT, 'VN??')}
                  name="DISCOUNT"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  label="Di???n Gi???i Chi???t Kh???u"
                  value={values.DISCOUNTNOTE}
                  name="DISCOUNTNOTE"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <CheckBox
                  name="PIT_FLAG"
                  checked={values.PIT_FLAG}
                  lable={`Tr??ch thu??? TNCN (${PIT}%)`}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  label="S??? ti???n tr??ch thu??? (PIT)"
                  value={doubleFormat(values.P_USAGEDIS, 'VN??')}
                  name="P_USAGEDIS"
                  readonly
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  isNumber
                  label="Thu??? (VAT)"
                  value={values.VAT?.toString()}
                  name="VAT"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  isNumber
                  label="Th??nh Ti???n"
                  value={doubleFormat(values.TOTALAMTAFTERVAT, 'VN??')}
                  name="TOTALAMTAFTERVAT"
                />
              </Column>
              <Column>
                <Input
                  isNumber
                  readonly
                  label="Th??nh ti???n tr?????c CK"
                  name="SUM_ACTAMOUNT"
                  value={doubleFormat(values.SUM_ACTAMOUNT, 'VN??')}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  isNumber
                  readonly
                  label="Th??nh ti???n c???n thu"
                  name="TOTAL_MUST_COLLECT"
                  value={doubleFormat(values.TOTAL_MUST_COLLECT, 'VN??')}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input label="Ghi ch??" value={values.REMARKS} name="REMARKS" />
              </Column>
            </Row>
            <Row style={{justifyContent: 'center'}}>
              <Button
                color={Colors.WHITE}
                title="L??u Th??ng Tin"
                onPress={handleSubmit}
              />
            </Row>
          </Card>
          <AutoCalculatorValue />
        </>
      )}
    </Formik>
  );
};

export default SoDiscountForm;
