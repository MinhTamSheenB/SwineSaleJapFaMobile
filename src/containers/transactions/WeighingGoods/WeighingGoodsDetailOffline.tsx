/* eslint-disable @typescript-eslint/no-use-before-define */
import {Formik, useFormikContext} from 'formik';
import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  IWeighingGoodsDetailDTO,
  IWeighingGoodsItemModel,
} from '~/apis/types.service';
import icons from '~/assets/icons';
import {DropdownItemType} from '~/commons/types';
import {
  Button,
  Dropdown,
  Input,
  TextCustom,
  CheckBox,
  Icon,
} from '~/components/commons';
import {Column, ConfirmModal, Container, Row} from '~/components/sections';
import {Colors} from '~/configs';
import Color from '~/configs/colors';
import useBluetooth, {SCALE_CHARACTER} from '~/helpers/useBluetooth';
import {
  convertStringToNumber,
  doubleFormat,
  isInvalidString,
  moreThanZero,
  numberFormat,
  removeUnicode,
  scaleFactor,
} from '~/helpers/UtilitiesHelper';
import GlobalActions from '~/redux/global/global.actions';
import {RootState} from '~/redux/reducers';
import SettingActions from '~/redux/settings/setting.actions';
import wGoodsActions from '~/redux/weighingGoods/weighing.goods.actions';
import {WGoodsItemValidate} from '~/validates/WeighingGoodsValidate';
import WeighingGoodsItems from './WeighingGoodsItems';

const WeighingGoodsDetailOffline = () => {
  const dispatch = useDispatch();

  const {bleDevice, bleManager} = useSelector(
    (state: RootState) => state.setting,
  );
  const {userParams} = useSelector((state: RootState) => state.global);

  const {detailsOffline, productsOffline, wOfflineModel, isPostItemSuccess} =
    useSelector((state: RootState) => state.wGoods);

  const {getBleManager, monitoringValueChange, writeWithOutResponse} =
    useBluetooth();

  const [productData, setProductData] = useState<DropdownItemType[]>([]);
  const [scaleValue, setScaleValue] = useState<string>('0.0');
  const [wGoodsItem, setWGoodsItem] = useState<IWeighingGoodsItemModel>({
    PRODUCTCODE: '',
    AVGBW: 0,
    QTY: 0,
  });

  const [wItemTempt, setWItemTemp] = useState<IWeighingGoodsItemModel>();

  const [confirmTitle, setConfirmTitle] = useState<string>('');
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [modelConfirm, setModelConfirm] = useState<
    IWeighingGoodsItemModel | undefined
  >();

  const [isInputScaleValue, setInputScaleValue] = useState<boolean>(false);

  useEffect(() => {
    if (!bleManager) {
      const ble = getBleManager();
      dispatch(SettingActions.updateBleManager(ble));
    }
  }, [bleManager, dispatch, getBleManager]);

  // useEffect(() => {
  //   if (isPostItemSuccess) {
  //     setWGoodsItem({});
  //     setScaleValue('0.0');
  //   }
  // }, [isPostItemSuccess]);

  /**
   * Listing value return from Bluetooth scale.
   * @param value
   */
  const monitoringCallback = useCallback((value) => {
    setScaleValue(value);
  }, []);

  const monitoring = useCallback(async (): Promise<void> => {
    if (bleDevice && bleManager) {
      await monitoringValueChange(
        bleDevice.deviceId,
        bleDevice.serviceUUID,
        bleDevice.monitoringCharacteristicUUID,
        monitoringCallback,
        bleManager,
      );
    }
  }, [bleDevice, bleManager, monitoringCallback, monitoringValueChange]);

  useEffect(() => {
    monitoring();
  }, [monitoring]);

  useEffect(() => {
    const data = productsOffline.map((item) => {
      const drpItem: DropdownItemType = {
        keySearch: removeUnicode(`${item.PRODUCTID} ${item.NAME_VN}`),
        label: item.NAME_VN,
        value: item.PRODUCTID ?? '',
      };
      return drpItem;
    });
    setProductData(data);
  }, [productsOffline]);

  useEffect(() => {
    if (isPostItemSuccess) {
      if (wItemTempt)
        setWGoodsItem({
          ...wItemTempt,
          QTY: 0,
          AVGBW: 0,
          EARTAG1: '',
          REMARKS: '',
          PRODUCTDOWN: undefined,
          PRODUCTDOWNDESC: '',
        });
      else setWItemTemp({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostItemSuccess]);

  const writeCharacterService = async (): Promise<void> => {
    const GET_VALUE_FROM_BLUETOOTH_SCALE = 'GET_VALUE_FROM_BLUETOOTH_SCALE';
    if (bleDevice) {
      await writeWithOutResponse(
        bleDevice.deviceId,
        bleDevice.serviceUUID!,
        bleDevice.writeCharacteristicUUID!,
        SCALE_CHARACTER.F,
        bleManager!,
      );

      dispatch(GlobalActions.openLoadingModal(GET_VALUE_FROM_BLUETOOTH_SCALE));

      setTimeout(async () => {
        await writeWithOutResponse(
          bleDevice.deviceId,
          bleDevice.serviceUUID!,
          bleDevice.writeCharacteristicUUID!,
          SCALE_CHARACTER.R,
          bleManager!,
        );
        dispatch(
          GlobalActions.closeLoadingModal(GET_VALUE_FROM_BLUETOOTH_SCALE),
        );
      }, 3000);
    }
  };

  const onDeleteItem = (item: IWeighingGoodsDetailDTO) => {
    if (item.ID) {
      dispatch(wGoodsActions.deleteDetailOffline(item.ID, item.SCALEID!, true));
    }
  };

  const checkTotalBwOrTotalQty = (bw: number, qty: number): string => {
    // eslint-disable-next-line prettier/prettier
    const totalBw = detailsOffline.reduce( (pre, current) => pre + (current.AVGBW ?? 0), 0,) + bw;
    // eslint-disable-next-line prettier/prettier
    const totalQty = detailsOffline.reduce((pre, current) => pre + (current.QTY ?? 0), 0) + qty;

    const bwDo = wOfflineModel?.TOTAL_BW_DO ?? 0;
    const qtyDo = wOfflineModel?.TOTAL_QTY_DO ?? 0;

    if (moreThanZero(bwDo) && totalBw > bwDo)
      return 'Tổng trọng lượng lần cân > trọng lượng phiếu xuất kho';

    if (moreThanZero(qtyDo) && totalQty > qtyDo)
      return 'Số lượng heo cân > số lượng heo đặt';
    return '';
  };

  const onAcceptConfirm = () => {
    if (modelConfirm) {
      dispatch(wGoodsActions.updatePostItemStatus(false));
      dispatch(
        wGoodsActions.addDetailOffline(
          modelConfirm?.SCALEID ?? 0,
          modelConfirm,
          true,
        ),
      );
      setModelConfirm(undefined);
      setConfirmTitle('');
      setIsConfirm(false);
    }
  };

  const handleSubmitDetail = async (value: IWeighingGoodsItemModel) => {
    setWItemTemp(value);
    const strValidate = checkTotalBwOrTotalQty(
      value.AVGBW ?? 0,
      value.QTY ?? 0,
    );
    const model: IWeighingGoodsItemModel = {
      ...value,
      GWEIGHT: convertStringToNumber(scaleValue),
      SCALEID: wOfflineModel?.SCALEID,
      CREATEDBY: wOfflineModel?.CREATEDBY
        ? wOfflineModel.CREATEDBY
        : userParams.userId,
      UPDATEDBY: userParams.userId,
      REGIONID: wOfflineModel?.REGIONID,
    };
    if (isInvalidString(strValidate)) {
      dispatch(wGoodsActions.updatePostItemStatus(false));
      return dispatch(
        wGoodsActions.addDetailOffline(
          wOfflineModel?.SCALEID!,
          model,
          false,
          true,
        ),
      );
    }
    setIsConfirm(true);
    setConfirmTitle(strValidate);
    setModelConfirm(model);
  };

  const AutoCalculatorBw = (): React.ReactElement | null => {
    const {values, setFieldValue} = useFormikContext<IWeighingGoodsItemModel>();
    useEffect(() => {
      const qty = values.QTY ?? 0;
      const bw = qty > 0 ? convertStringToNumber(scaleValue) / qty : 0;
      setFieldValue('AVGBW', bw);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFieldValue, values.QTY, scaleValue]);
    return null;
  };

  return (
    <>
      <Container bgColor={Colors.WHITE} isIncludeScrollView>
        <Formik
          enableReinitialize
          validationSchema={WGoodsItemValidate}
          initialValues={wGoodsItem}
          onSubmit={(value) => {
            handleSubmitDetail(value);
          }}>
          {({values, handleSubmit, setFieldValue}) => (
            <>
              <View
                style={{
                  marginTop: 20,
                  borderRadius: 10,
                  paddingBottom: 10,
                  marginBottom: 20,
                }}>
                <Row isSmall>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    {!isInputScaleValue && (
                      <View style={{paddingHorizontal: 20}}>
                        <Text style={styles.total}>
                          {isInvalidString(scaleValue) ? '0.0' : scaleValue}
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            top: 0,
                            right: -50,
                          }}>
                          <TouchableOpacity
                            style={{width: '100%', height: '100%'}}
                            onPress={() => setInputScaleValue(true)}>
                            <Icon
                              name="pencil"
                              type="FontAwesome"
                              color={Colors.GRAY_LIGHT}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    {isInputScaleValue && (
                      <TextInput
                        keyboardType="numeric"
                        value={scaleValue}
                        onChangeText={(text) => {
                          setScaleValue(text);
                        }}
                        style={styles.total}
                        placeholder="0.0"
                        placeholderTextColor={Color.GRAY}
                      />
                    )}
                  </View>
                </Row>
                <Row isSmall>
                  <Column>
                    <Input
                      label="Số lượng (con)"
                      name="QTY"
                      value={numberFormat(values.QTY, '')}
                      isNumber
                    />
                  </Column>
                  <Column style={{marginLeft: 30}}>
                    <Input
                      label="KL bình quân"
                      name="AVGBW"
                      isNumber
                      value={doubleFormat(values.AVGBW, '')}
                      readonly
                    />
                  </Column>
                </Row>
                <Row isSmall>
                  <Column mobile={2}>
                    <Dropdown
                      label="Sản phẩm"
                      data={productData}
                      name="PRODUCTCODE"
                      selectedValue={values.PRODUCTCODE}
                      onSelect={(item) => {
                        setFieldValue('PRODUCTNAME', item.label);
                        const product = productsOffline.find(
                          (p) => p.PRODUCTID === item.value,
                        );
                        if (product) {
                          setFieldValue('MEASURE', product.MEASURECODE);
                        }
                      }}
                      searchPlaceholder="Nhập tên/ mã sản phẩm"
                    />
                  </Column>
                  <Column mobile={0.5} style={{alignItems: 'flex-end'}}>
                    <CheckBox
                      name="PRODUCTDOWN"
                      lable="Hạ phẩm"
                      checked={!!(values.PRODUCTDOWN && values.PRODUCTDOWN > 0)}
                    />
                  </Column>
                </Row>
                {!!(values.PRODUCTDOWN && values.PRODUCTDOWN > 0) && (
                  <Row isSmall>
                    <Column>
                      <Input
                        label="Loại sản phẩm hạ phẩm"
                        name="PRODUCTDOWNDESC"
                        value={values.PRODUCTDOWNDESC}
                      />
                    </Column>
                  </Row>
                )}
                <Row isSmall>
                  <Column>
                    <Input
                      label="Mã đàn trại xuất"
                      placeholder="Nhập mã đàn"
                      name="FLOCKID"
                      value={values.FLOCKID}
                    />
                  </Column>
                  <Column style={{marginLeft: 30}}>
                    <Input
                      label="Chuồng xuất/ đàn nhận"
                      placeholder="Nhập chuồng/ đàn"
                      name="FLOCKNAME"
                      value={values.FLOCKNAME}
                    />
                  </Column>
                </Row>

                <Row>
                  <Column>
                    <Input
                      label="Số thẻ tai"
                      placeholder="Nhập số thẻ tai"
                      name="EARTAG1"
                      value={values.EARTAG1}
                    />
                  </Column>
                </Row>
                <Row isSmall>
                  <Column mobile={2}>
                    <Input
                      label="Ghi chú"
                      name="REMARKS"
                      value={values.REMARKS}
                    />
                  </Column>
                </Row>
                <Row isSmall>
                  {!isInputScaleValue && (
                    <Column>
                      <Pressable
                        style={styles.btnWeigh}
                        onPress={writeCharacterService}>
                        <Image
                          source={icons.weighingMachine}
                          style={{
                            width: scaleFactor(20),
                            height: scaleFactor(20),
                            marginRight: 5,
                          }}
                        />
                        <TextCustom>Cân tổng</TextCustom>
                      </Pressable>
                    </Column>
                  )}
                  <Column mobile={2}>
                    <Button
                      disabled={convertStringToNumber(scaleValue) <= 0}
                      title="Lưu Phiếu Cân"
                      radius={5}
                      color={Colors.WHITE}
                      onPress={handleSubmit}
                    />
                  </Column>
                </Row>
              </View>
              <WeighingGoodsItems
                items={detailsOffline}
                onDeleteItem={(item) => onDeleteItem(item)}
                totalQty={wOfflineModel?.TOTAL_QTY_DO ?? 0}
                totalBw={wOfflineModel?.TOTAL_BW_DO ?? 0}
                onSelectedItem={(item) => {
                  const model: IWeighingGoodsItemModel = {
                    AVGBW: item.AVGBW,
                    CREATEDBY: item.CREATEDBY,
                    EARTAG1: item.EARTAG1,
                    EARTAG2: item.EARTAG2,
                    FLOCKID: item.FLOCKID,
                    FLOCKNAME: item.FLOCKNAME,
                    GWEIGHT: item.GWEIGHT,
                    MEASURE: item.MEASURE,
                    NWEIGHT: item.NWEIGHT,
                    PRODUCTCODE: item.PRODUCTCODE,
                    PRODUCTDOWN: item.PRODUCTDOWN ? 1 : 0,
                    PRODUCTDOWNDESC: item.PRODUCTDOWNDESC,
                    PRODUCTNAME: item.PRODUCTNAME,
                    PWEIGHT: item.PWEIGHT,
                    QTY: item.QTY,
                    REGIONID: wOfflineModel?.REGIONID,
                    REMARKS: item.REMARKS,
                    SCALEID: item.SCALEID,
                    SNITEMID: item.SNITEMID,
                    UPDATEDBY: item.UPDATEDBY,
                    WHID: item.WHID,
                    ID: item.ID,
                  };
                  setScaleValue(`${item.GWEIGHT}`);
                  setWGoodsItem(model);
                }}
              />
              <AutoCalculatorBw />
            </>
          )}
        </Formik>
      </Container>

      <ConfirmModal
        isVisible={isConfirm}
        title={`${confirmTitle}. \n Bạn có chắc muốn thêm ?`}
        onClose={() => setIsConfirm(false)}
        onAccept={() => onAcceptConfirm()}
      />
    </>
  );
};

export default WeighingGoodsDetailOffline;
const styles = StyleSheet.create({
  total: {fontSize: 40, fontWeight: 'bold', color: Colors.GRAY},
  btnWeigh: {
    flexDirection: 'row',
    borderColor: Colors.GRAY,
    borderWidth: 1,
    flex: 1.5,
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 5,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },
});
