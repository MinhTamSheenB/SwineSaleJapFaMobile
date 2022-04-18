/* eslint-disable @typescript-eslint/no-use-before-define */
import {Formik, FormikProps} from 'formik';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {MonitoringType} from '~/apis/types.monitoring';
import {ISearchCommon} from '~/apis/types.service';
import {Button, DateRow, Dropdown} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {
  FROM_DATE,
  GetMonthDropdown,
  GetYearDropdown,
  TO_DATE,
} from '~/configs/initializeVariable';
import {
  convertStringToDate,
  monthOfDate,
  yearOfDate,
} from '~/helpers/DatetimeHelpers';
import MasterActions from '~/redux/master/master.actions';
import MonitoringActions from '~/redux/monitoring/monitoring.actions';
import {RootState} from '~/redux/reducers';

export interface IMonitoringFilterModel {
  fromDate: string;
  toDate: string;
  unitIds: string[];
  deptIds: number[];
  customerCodes: string[];
  productCodes: string[];
  locationIds: string[];
  officeIds: string[];
  month: number;
  year: number;
  productTypes: string[];
}

const CUSTOMER_BALANCE_MONTHLY = 203;
const CUSTOMER_BALANCE_DAILY = 214;
const DISCOUNT_REPORT = 137;
const CNDN_REPORT = 136;
const DAILY_SALE = 142;
const CREDIT_REPORT = 179;

const Filter = () => {
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<IMonitoringFilterModel>>(null);

  const {
    userDepartmentS,
    unitsSale,
    customers,
    saleLocations,
    productsUnit,
    userOfficeS,
  } = useSelector((state: RootState) => state.master);
  const {drawerId} = useSelector((state: RootState) => state.global);

  const productTypes: ISearchCommon[] = [
    {label: 'Sp chính', value: '01', keySearch: 'san pham chinh'},
    {label: 'Sp phụ', value: '02', keySearch: 'san pham phu'},
  ];

  const [model] = useState<IMonitoringFilterModel>(() => {
    return {
      customerCodes: [],
      unitIds: [],
      deptIds: [],
      productCodes: [],
      fromDate: FROM_DATE,
      toDate: TO_DATE,
      locationIds: [],
      officeIds: [],
      productTypes: [],
      month: monthOfDate(new Date()) + 1,
      year: yearOfDate(new Date()),
    };
  });

  useEffect(() => {
    formikRef.current?.resetForm();
  }, [drawerId]);

  const handleLoadControl = useCallback(() => {
    dispatch(MasterActions.getSaleUnits());
    dispatch(MasterActions.getCustomers());
    dispatch(MasterActions.getSaleLocation());
    dispatch(MasterActions.getProductByUnit());
  }, [dispatch]);

  useEffect(() => {
    handleLoadControl();
  }, [handleLoadControl]);

  const getReportType = (): MonitoringType => {
    if (drawerId === DAILY_SALE) return 'DAILY_SALE';
    if (drawerId === CUSTOMER_BALANCE_MONTHLY)
      return 'CUSTOMER_MONTHLY_BALANCE';
    if (drawerId === CUSTOMER_BALANCE_DAILY) return 'CUSTOMER_DAILY_BALANCE';
    if (drawerId === DISCOUNT_REPORT) return 'DISCOUNT_MONITORING';
    if (drawerId === CNDN_REPORT) return 'CNDN_MONITORING';
    if (drawerId === CREDIT_REPORT) return 'CREDIT_MONITORING';

    return 'DAILY_SALE';
  };

  return (
    <View style={styles.container}>
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={model}
        onSubmit={(value) => {
          const reportType: MonitoringType = getReportType();
          const deptIds: number[] = value.deptIds.map((i) => Number(i));
          const officeIds: number[] = value.officeIds.map((officeId) =>
            Number(officeId),
          );
          dispatch(
            MonitoringActions.fetchDailySale(
              reportType,
              value.fromDate,
              value.toDate,
              value.unitIds,
              deptIds,
              value.customerCodes,
              value.productCodes,
              value.locationIds,
              value.month,
              value.year,
              officeIds,
            ),
          );
        }}>
        {({values, handleSubmit}) => {
          return (
            <View
              style={{
                marginHorizontal: 10,
                backgroundColor: Colors.WHITE,
                marginTop: 10,
              }}>
              {drawerId !== CUSTOMER_BALANCE_MONTHLY && (
                <Row>
                  <Column>
                    <DateRow
                      label="Từ ngày"
                      date={convertStringToDate(values.fromDate)}
                      name="fromDate"
                      type="date"
                    />
                  </Column>
                  <Column>
                    <DateRow
                      label="Đến ngày"
                      date={convertStringToDate(values.toDate)}
                      name="toDate"
                      type="date"
                    />
                  </Column>
                </Row>
              )}
              {drawerId === CUSTOMER_BALANCE_MONTHLY && (
                <Row>
                  <Column>
                    <Dropdown
                      data={GetMonthDropdown(true)}
                      name="month"
                      label="Tháng"
                      selectedValue={values.month}
                      searchPlaceholder="Nhập tháng cần tìm."
                    />
                  </Column>
                  <Column>
                    <Dropdown
                      data={GetYearDropdown()}
                      name="year"
                      label="Năm"
                      selectedValue={values.year}
                      searchPlaceholder="Nhập năm cần tìm"
                    />
                  </Column>
                </Row>
              )}
              {drawerId !== CUSTOMER_BALANCE_MONTHLY &&
                drawerId !== CUSTOMER_BALANCE_DAILY && (
                  <>
                    <Row>
                      <Column>
                        <Dropdown
                          label="Nhánh"
                          name="officeIds"
                          data={userOfficeS}
                          selectedValue={values.officeIds}
                          isMultiple
                          searchPlaceholder="Nhập tên nhánh cần tìm"
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Dropdown
                          data={userDepartmentS}
                          name="deptIds"
                          label="Bộ phận"
                          selectedValue={values.deptIds}
                          searchPlaceholder="Nhập tên phòng ban"
                          isMultiple
                        />
                      </Column>
                    </Row>
                  </>
                )}
              <Row>
                <Column>
                  <Dropdown
                    data={unitsSale}
                    name="unitIds"
                    label="Đơn vị"
                    selectedValue={values.unitIds}
                    searchPlaceholder="Nhập tên đơn vị"
                    isMultiple
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Dropdown
                    data={customers}
                    name="customerCodes"
                    label="Khách hàng"
                    selectedValue={values.customerCodes}
                    searchPlaceholder="Nhập tên khách hàng."
                    isMultiple
                  />
                </Column>
              </Row>

              {drawerId === DAILY_SALE && (
                <>
                  <Row>
                    <Column>
                      <Dropdown
                        data={saleLocations}
                        name="locationIds"
                        label="Trại"
                        selectedValue={values.locationIds}
                        searchPlaceholder="Nhập tên trại để tìm kiếm"
                        isMultiple
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Dropdown
                        data={productsUnit}
                        name="productCodes"
                        label="Sản phẩm"
                        selectedValue={values.productCodes}
                        searchPlaceholder="Nhập tên/ mã sản phẩm"
                        isMultiple
                      />
                    </Column>
                  </Row>

                  <Row>
                    <Column>
                      <Dropdown
                        data={productTypes}
                        name="productTypes"
                        label="Loại sản phẩm"
                        selectedValue={values.productTypes}
                        searchPlaceholder="Nhập loại sản phẩm"
                        isMultiple
                      />
                    </Column>
                  </Row>
                </>
              )}

              <Row>
                <Column style={{justifyContent: 'center'}}>
                  <Button
                    iconLeft={{type: 'AntDesign', name: 'filter'}}
                    title="Tải dữ liệu"
                    color={Colors.WHITE}
                    radius={20}
                    onPress={handleSubmit}
                  />
                </Column>
              </Row>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

export default Filter;
const styles = StyleSheet.create({
  container: {},
});
