import {Formik} from 'formik';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CreditStatus, ICreditModel} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {Button, DateRow, Dropdown, Input, SafeView} from '~/components/commons';
import {Column, Container, Header, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {
  convertStringToDate,
  getCurrentDateToString,
} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import CreditActions from '~/redux/credit/credit.actions';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';

const CreditCreateScreen = () => {
  const dispatch = useDispatch();
  const {customerDropdownData} = useSelector(
    (state: RootState) => state.master,
  );
  const {userParams} = useSelector((state: RootState) => state.global);
  const {selectedId, detail} = useSelector((state: RootState) => state.credit);

  const [model, setModel] = useState<ICreditModel>(() => {
    return {
      REGIONID: userParams.regionId,
      OFFICEID: userParams.officeId,
      UNITID: userParams.unitId,
      DEPTID: userParams.deptId,
      STATUS: CreditStatus.New,
    };
  });

  React.useEffect(() => {
    dispatch(MasterActions.getCustomers());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(CreditActions.getDetail(selectedId));
  }, [dispatch, selectedId]);

  React.useEffect(() => {
    if (detail) {
      setModel({...detail});
    }
  }, [detail]);

  return (
    <SafeView>
      <Header title="Xin Nợ" isMenu={false} noShadow disableThreeDot />
      <Formik
        initialValues={model}
        enableReinitialize
        onSubmit={(values) => {
          const nav: INavigateScreen = {
            screen: ScreenType.Credit.DETAIL,
            isNavigate: true,
          };
          dispatch(CreditActions.create(values, nav));
        }}>
        {({values, handleSubmit}) => (
          <Container
            isIncludeScrollView
            style={{
              backgroundColor: Colors.WHITE,
              marginHorizontal: 10,
              marginVertical: 10,
              flex: undefined,
              paddingBottom: 20,
            }}>
            <Row>
              <Column>
                <Input name="DOCNO" value={values.SONO} label="Mã Đơn hàng" />
              </Column>
              <Column>
                <DateRow
                  label="Ngày chứng từ"
                  name="DUEDATE"
                  date={convertStringToDate(values.DUEDATE ?? '')}
                  type="date"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Dropdown
                  data={customerDropdownData}
                  label="Khách hàng"
                  name="CUSTID"
                  selectedValue={values.CUSTID}
                  searchPlaceholder="Tên khách hàng"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  name="CURRENTBALANCE"
                  label="Sô dư hiện tại"
                  placeholder="0.0 VNĐ"
                  value={numberFormat(values.CURRENTBALANCE)}
                  isNumber
                />
              </Column>
              <Column>
                <Input
                  name="SOAMOUNT_GROSS"
                  value={numberFormat(values.SOAMOUNT_GROSS)}
                  label="Tổng tiền đơn hàng"
                  isNumber
                  placeholder="0.0 VNĐ"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  name="SOAMOUNT_NET"
                  value={numberFormat(values.SOAMOUNT_NET)}
                  label="Tổng tiền sau chiết khấu"
                  isNumber
                  placeholder="0.0 VNĐ"
                />
              </Column>
              <Column>
                <Input
                  name="REQUESTAMOUNT"
                  label="Số tiền xin nợ"
                  isNumber
                  value={numberFormat(values.REQUESTAMOUNT)}
                  placeholder="0.0 VNĐ"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <DateRow
                  label="Ngày hẹn trả"
                  name="REFUNDDATE"
                  date={convertStringToDate(
                    values.REFUNDDATE ?? getCurrentDateToString(),
                  )}
                  type="date"
                />
              </Column>
            </Row>

            <Row>
              <Column>
                <Input
                  name="PAYMENTAMOUNT"
                  value={numberFormat(values.PAYMENTAMOUNT)}
                  label="Số tiền đã trả"
                  isNumber
                  placeholder="0.0 VNĐ"
                />
              </Column>
              <Column>
                <Input
                  name="REMAINAMOUNT"
                  value={numberFormat(values.REMAINAMOUNT)}
                  label="Số tiền nợ còn lại"
                  isNumber
                  placeholder="0.0 VNĐ"
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Input
                  name="REMARKS"
                  value={values.REMARKS}
                  label="Ghi chú khác"
                />
              </Column>
            </Row>

            <Row>
              <Column>
                <Input name="REFDOC" value={values.REFDOC} label="Memmo" />
              </Column>
            </Row>
            <Button
              title="Lưu Xin Nợ"
              color={Colors.WHITE}
              onPress={handleSubmit}
            />
          </Container>
        )}
      </Formik>
    </SafeView>
  );
};
export default CreditCreateScreen;
