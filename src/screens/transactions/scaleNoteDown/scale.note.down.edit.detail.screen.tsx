/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  IScaleNoteDownDetailDTO,
  IScaleNoteDownDetailModel,
} from '~/apis/types.scale.note.down';
import {Button, Dropdown, Input, SafeView} from '~/components/commons';
import {
  Column,
  ConfirmModal,
  Container,
  Header,
  Row,
} from '~/components/sections';
import {Colors} from '~/configs';
import {ScaleNoteDownProduct} from '~/containers/transactions/SaleNoteDown';
import {doubleFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import ScaleNoteDownActions from '~/redux/scaleNoteDown/scale.note.down.actions';

const ScaleNoteDownEditDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {products} = useSelector((state: RootState) => state.master);
  const {model} = useSelector((state: RootState) => state.scaleNoteDown);
  const [detailModel, setDetailModel] = useState<IScaleNoteDownDetailModel>({
    ...model,
    AUTOID: 0,
  });
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] =
    useState<IScaleNoteDownDetailDTO>();

  return (
    <SafeView>
      <Header title="(3) Chi tiết điều chỉnh" isMenu={false} disableThreeDot />
      <Container style={styles.container} isIncludeScrollView>
        <Formik
          enableReinitialize
          // validationSchema={WGoodsItemValidate}
          initialValues={detailModel}
          onSubmit={(value) => {
            dispatch(ScaleNoteDownActions.createUpdateDetail(value));
          }}>
          {({values, handleSubmit}) => {
            return (
              <View style={styles.form}>
                <Row>
                  <Column>
                    <Dropdown
                      data={products}
                      label="Sản phẩm"
                      selectedValue={values.PRODUCTCODE}
                      name="PRODUCTCODE"
                      searchPlaceholder="Nhập tên, mã sản phẩm."
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Số lượng"
                      isNumber
                      value={`${values.TOTALQTY}`}
                      name="TOTALQTY"
                    />
                  </Column>
                  <Column>
                    <Input
                      label="Trọng lượng sản phẩm"
                      isNumber
                      value={doubleFormat(values.NETGROSS, '')}
                      name="NETGROSS"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Trọng lượng bình quân"
                      name="AVGWIGHT"
                      isNumber
                      readonly
                      value={doubleFormat(detailModel.AVGWIGHT, '')}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Input
                      label="Ghi chú"
                      name={detailModel.REMAKS ?? 'REMAKS'}
                      value={values.REMAKS}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column mobile={2}>
                    <Button
                      title={isEdit ? 'Lưu chỉnh sửa' : 'Tạo mới'}
                      iconLeft={{
                        type: 'AntDesign',
                        name: isEdit ? 'save' : 'pluscircleo',
                      }}
                      color={Colors.WHITE}
                      radius={5}
                      bgColor={isEdit ? Colors.SUCCESS : Colors.ORIGIN}
                      onPress={handleSubmit}
                    />
                  </Column>
                  <Column>
                    <Button
                      title="Huỷ"
                      iconLeft={{type: 'AntDesign', name: 'closecircleo'}}
                      color={Colors.BORDER_DARK}
                      bgColor={Colors.DISABLED}
                      radius={5}
                      onPress={() => {
                        setIsEdit(false);
                        setDetailModel({...model, AUTOID: 0});
                      }}
                    />
                  </Column>
                </Row>
              </View>
            );
          }}
        </Formik>
        <View>
          {model &&
            model.SCALEDOWNDETAILS &&
            model?.SCALEDOWNDETAILS.map((dt, index) => (
              <ScaleNoteDownProduct
                key={dt.AUTOID ?? index}
                id={dt.AUTOID ?? index}
                qty={dt.TOTALQTY ?? 0}
                avg={dt.SAVED_AVGWIGHT ?? 0}
                weight={dt.NETGROSS ?? 0}
                productName={dt.NAME_VN ?? '---'}
                onSelect={() => {
                  setIsEdit(true);
                  setDetailModel({...dt});
                }}
                onDelete={() => {
                  setIsEdit(false);
                  setIsConfirm(true);
                  setSelectedDetail(dt);
                }}
              />
            ))}
        </View>
      </Container>

      <ConfirmModal
        isVisible={isConfirm}
        onAccept={() => {
          if (selectedDetail) {
            setIsConfirm(false);
            dispatch(ScaleNoteDownActions.deleteDetail(selectedDetail));
          }
        }}
        onClose={() => setIsConfirm(false)}
      />

      <View style={styles.footer}>
        <Row style={{marginVertical: 0, marginTop: 5}}>
          <Column>
            <Button
              title="Tiếp tục"
              color={Colors.WHITE}
              iconRight={{type: 'AntDesign', name: 'arrowright'}}
              bgColor={Colors.GRAY}
              onPress={() =>
                navigation.navigate(ScreenType.ScaleNoteDown.SUMMARY)
              }
            />
          </Column>
        </Row>
      </View>
    </SafeView>
  );
};

export default ScaleNoteDownEditDetailScreen;
const styles = StyleSheet.create({
  container: {flex: 10},
  form: {
    backgroundColor: Colors.WHITE,
    marginVertical: 20,
  },
  footer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderTopWidth: 0.5,
    borderTopColor: '#f3f3f3',
  },
});
