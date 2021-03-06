import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik, useFormikContext} from 'formik';
import {Column, ConfirmModal, Row} from '~/components/sections';
import {Dropdown, Input, Button} from '~/components/commons';
import {AppStrings, Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import {DropdownItemType} from '~/commons/types';
import {
  doubleFormat,
  isValidString,
  numberFormat,
  removeUnicode,
} from '~/helpers/UtilitiesHelper';
import {IPriceModel, ISoDetailModel} from '~/apis/types.service';
import {
  formatDate,
  getCurrentDateToString,
  getCurrentTimeToString,
} from '~/helpers/DatetimeHelpers';
import SoAction from '~/redux/so/so.actions';
import {SoDetailValidate} from '~/validates/SoValidate';

const SoAddProductForm = (): JSX.Element => {
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const {userParams} = useSelector((state: RootState) => state.global);
  const {productsUnit, prices} = useSelector(
    (state: RootState) => state.master,
  );
  const {soModel, currentScreen, isSubmitSuccess, detailModel, moneyDetail} =
    useSelector((state: RootState) => state.so);

  // State
  const [priceData, setPriceData] = useState<DropdownItemType[]>([]);
  const [productId, setProductId] = useState<string>(() => {
    return detailModel.PRODUCTID ?? '';
  });
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  React.useEffect(() => {
    const isBool = moneyDetail > 0;
    setIsConfirm(isBool);
  }, [moneyDetail]);

  React.useEffect(() => {
    dispatch(MasterActions.getProductByUnit(userParams.unitId!));
  }, [dispatch, userParams.unitId]);

  React.useEffect(() => {
    if (isValidString(productId)) {
      const priceModel: IPriceModel = {
        customerId: soModel.CUSTID,
        doDate: getCurrentDateToString(),
        doTime: getCurrentTimeToString(true),
        productId,
        unitId: soModel.UNITID,
        groupCode: '',
      };
      dispatch(MasterActions.getSwinePrice(priceModel));
    }
  }, [dispatch, productId, soModel.CUSTID, soModel.SODATE, soModel.UNITID]);

  React.useEffect(() => {
    const data = prices.map((price) => {
      const dropdownItem: DropdownItemType = {
        ...price,
        label: `${price.GRPCODE}  ${price.BWOPERATOR} ${
          price.BW
        } ??p d???ng t???: ${formatDate(price.BEGINDATE, 'date')}`,
        value: price.GRPCODE!,
        keySearch: `${removeUnicode(price.GRPCODE)} ${removeUnicode(
          price.GRPCODE,
        )}`,
        date: `${formatDate(price.BEGINDATE, 'date')}  ${price.BEGINTIME}`,
      };
      return dropdownItem;
    });
    setPriceData(data);
  }, [prices]);

  React.useEffect(() => {
    if (isSubmitSuccess && currentScreen === ScreenType.SO.ADD_PRODUCT) {
      navigate.goBack();
    }
  }, [currentScreen, isSubmitSuccess, navigate]);

  const CalculatorBwAvg = (): React.ReactElement | null => {
    const {values, setFieldValue} = useFormikContext<ISoDetailModel>();
    useEffect(() => {
      const qty = values.QTY ?? 0;
      const bwTotal = values.BW_TOTAL ?? 0;
      let bwAvg = 0;
      if (qty > 0) {
        bwAvg = bwTotal / qty;
      }
      setFieldValue('BW_AVG', bwAvg);
    }, [values.QTY, values.BW_TOTAL, setFieldValue]);

    useEffect(() => {
      const totalAmount = (values.BW_TOTAL ?? 0) * (values.PRICE2 ?? 0);
      setFieldValue('AMOUNT', totalAmount);
    }, [values.PRICE2, values.BW_TOTAL, setFieldValue]);
    return null;
  };

  return (
    <Formik
      initialValues={detailModel}
      validationSchema={SoDetailValidate}
      onSubmit={(values) => {
        dispatch(SoAction.calculateDetail(values));
      }}>
      {({values, handleSubmit, setFieldValue}) => (
        <>
          <Row>
            <Column>
              <Dropdown
                name="PRODUCTID"
                data={productsUnit}
                label={AppStrings.SO.Product}
                searchPlaceholder={AppStrings.SO.ProductFilterPlaceholder}
                selectedValue={values.PRODUCTID ?? ''}
                onSelect={(item) => {
                  const product = productsUnit.find((p) => p.ID === item.value);
                  if (product) {
                    setProductId(item.value.toString());
                    setFieldValue('MEASURE', product.Name2);
                    setFieldValue('PRODUCTNAME', item.label);
                  }
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Input
                label="????n V??? T??nh"
                name="MEASURE"
                value={values?.MEASURE ?? ''}
                readonly
              />
            </Column>
            <Column>
              <Input
                label="S??? L?????ng"
                name="QTY"
                value={values?.QTY?.toString() ?? '0'}
                isNumber
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Input
                label="T???ng TL"
                name="BW_TOTAL"
                value={values?.BW_TOTAL?.toString() ?? '0'}
                isNumber
              />
            </Column>
            <Column>
              <Input
                label="TLBQ"
                value={doubleFormat(values?.BW_AVG, '')}
                isNumber
                readonly
                name="BW_AVG"
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Dropdown
                name="PRICEGROUP"
                label="B???ng Gi??"
                data={priceData}
                searchPlaceholder="Nh???p t??n b???ng gi??"
                selectedValue={values.PRICEGROUP}
                onSelect={(item) => {
                  setFieldValue('PRICE1', item.PRICE1 ?? 0);
                  setFieldValue('PRICE2', item.PRICE2 ?? 0);
                  setFieldValue('REDUCEPRICE1', item.REDUCEPRICE1 ?? 0);
                  setFieldValue('REDUCEPRICE2', item.REDUCEPRICE2 ?? 0);
                  setFieldValue('PRICEGROUPUNIT', item.UNITID);
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Input
                label="????n Gi??/S???n ph???m"
                value={doubleFormat(values?.PRICE1, '')}
                isNumber
                name="PRICE1"
                readonly
              />
            </Column>
            <Column>
              <Input
                label="????n Gi??/??VT"
                value={doubleFormat(values?.PRICE2, '')}
                isNumber
                readonly
                name="PRICE2"
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Input
                label="Gi???m Gi??/S???n ph???m"
                value={doubleFormat(values?.REDUCEPRICE1, '')}
                isNumber
                name="REDUCEPRICE1"
                // readonly
              />
            </Column>
            <Column>
              <Input
                label="Gi???m Gi??/??VT"
                value={doubleFormat(values?.REDUCEPRICE2, '')}
                isNumber
                name="REDUCEPRICE2"
                // readonly
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Input
                label="M?? Gi???m Gi??"
                value={values?.SALEOFF_ID}
                name="SALEOFF_ID"
              />
            </Column>
            <Column>
              <Input
                label="Th??nh Ti???n"
                value={numberFormat(values?.AMOUNT)}
                isNumber
                name="AMOUNT"
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Input label="Ghi Ch??" value={values?.REMARKS} name="REMARKS" />
            </Column>
          </Row>

          <Row>
            <Column>
              <Button
                title="Th??m S???n Ph???m"
                iconLeft={{type: 'Entypo', name: 'save'}}
                color={Colors.WHITE}
                radius={30}
                onPress={handleSubmit}
              />
            </Column>
          </Row>

          <CalculatorBwAvg />
          <ConfirmModal
            onClose={() => dispatch(SoAction.resetMoneyDetail())}
            onAccept={() => {
              const model: ISoDetailModel = {...values, AMOUNT: moneyDetail};
              dispatch(SoAction.createSoDetail(model));
            }}
            isVisible={isConfirm}
            title={`B???n ?????ng ?? th??m v???i s??? ti???n ${doubleFormat(
              moneyDetail,
            )} hay kh??ng?`}
          />
        </>
      )}
    </Formik>
  );
};

export default SoAddProductForm;
