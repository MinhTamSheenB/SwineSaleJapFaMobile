import {
  ICustomerBalance,
  ICustomerInfo,
  ILocation,
  IMasterMenu,
  IMasterResponseCommon,
  IPrice,
  IPriceModel,
  IProductStockDTO,
  IUnit,
} from '~/apis/types.service';
import {DropdownItemType} from '~/commons/types';
import {AccessTokenObject} from '~/components/microsoftLogin/types';
import {
  IAppStart,
  ICheckPassCodeIsValid,
  ICheckPassCodeStatus,
  IFetchCustomerSuccess,
  IFetchDepartmentSuccess,
  IFetchingCustomer,
  IFetchingDepartment,
  IFetchingLocationByUnits,
  IFetchingOffice,
  IFetchingProductByUnit,
  IFetchLocationByUnitsSuccess,
  IFetchOfficeSuccess,
  IFetchProductsByUnitSuccess,
  IGetAllProducts,
  IGetAllProductsSuccess,
  IGetCustomerBalance,
  IGetCustomerBalanceSuccess,
  IGetLocationByUser,
  IGetLocationByUserSuccess,
  IGetMenuByUser,
  IGetMenuByUserSuccess,
  IGetSaleLocation,
  IGetSaleLocationSuccess,
  IGetSaleUnits,
  IGetSaleUnitsSuccess,
  IGetSwinePrice,
  IGetSwinePriceSuccess,
  IGetUnitOfCustomer,
  IGetUnitOfCustomerSuccess,
  ILoginSuccess,
  ISetupPasscode,
  IUpdateCustomerDropdownData,
  IUpdateLocationDropdownData,
  Types,
} from './master.types';

const MasterActions = {
  getCustomers: (): IFetchingCustomer => {
    return {type: Types.MASTER_FETCHING_CUSTOMERS};
  },
  getCustomersSuccess: (customers: ICustomerInfo[]): IFetchCustomerSuccess => {
    return {type: Types.MASTER_FETCH_CUSTOMERS_SUCCESS, payload: customers};
  },
  updateCustomerDropdownData: (
    data: DropdownItemType[],
  ): IUpdateCustomerDropdownData => ({
    type: Types.MASTER_UPDATE_CUSTOMER_DROPDOWN_DATA,
    payload: data,
  }),
  getLocationByUnits: (unitIDs: string[]): IFetchingLocationByUnits => {
    return {
      type: Types.MASTER_FETCHING_LOCAL_BY_UNITIDS,
      payload: unitIDs,
    };
  },
  updateLocationDropdownData: (
    data: DropdownItemType[],
  ): IUpdateLocationDropdownData => ({
    type: Types.MASTER_UPDATE_LOCATION_DROPDOWN_DATA,
    payload: data,
  }),
  getLocationByUnitsSuccess: (
    locations: ILocation[],
  ): IFetchLocationByUnitsSuccess => {
    return {
      type: Types.MASTER_FETCH_LOCATION_BY_UNIT_SUCCESS,
      payload: locations,
    };
  },
  getOffices: (userId: string): IFetchingOffice => {
    return {type: Types.MASTER_FETCHING_OFFICE_BY_USER, payload: userId};
  },
  getOfficesSuccess: (
    offices: IMasterResponseCommon[],
  ): IFetchOfficeSuccess => {
    return {type: Types.MASTER_FETCH_OFFICE_BY_USER_SUCCESS, payload: offices};
  },
  getDepartments: (userId: string, officeID: number): IFetchingDepartment => {
    return {
      type: Types.MASTER_FETCHING_DEPARTMENT_BY_USER,
      payload: {officeID, userId},
    };
  },
  getDepartmentsSuccess: (
    departments: IMasterResponseCommon[],
  ): IFetchDepartmentSuccess => {
    return {
      type: Types.MASTER_FETCH_DEPARTMENT_BY_USER_SUCCESS,
      payload: departments,
    };
  },
  getProductByUnit: (unitId?: string): IFetchingProductByUnit => {
    return {type: Types.MASTER_FETCHING_PRODUCTS_BY_UNIT, payload: unitId};
  },
  getProductsByUnitSuccess: (
    products: IMasterResponseCommon[],
  ): IFetchProductsByUnitSuccess => {
    return {
      type: Types.MASTER_FETCH_PRODUCTS_BY_UNIT_SUCCESS,
      payload: products,
    };
  },
  getSwinePrice: (price: IPriceModel): IGetSwinePrice => {
    return {
      type: Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT,
      payload: price,
    };
  },
  getSwinePriceSuccess: (prices: IPrice[]): IGetSwinePriceSuccess => {
    return {
      type: Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT_SUCCESS,
      payload: prices,
    };
  },
  getCustomerBalance: (custId: string, unitId: string): IGetCustomerBalance => {
    return {
      type: Types.MASTER_GET_CUSTOMER_BALANCES,
      payload: {custId, unitId},
    };
  },
  getCustomerBalanceSuccess: (
    balances: ICustomerBalance[],
  ): IGetCustomerBalanceSuccess => ({
    type: Types.MASTER_GET_CUSTOMER_BALANCES_SUCCESS,
    payload: balances,
  }),
  getUnitOfCustomer: (custId: string, units: string[]): IGetUnitOfCustomer => ({
    type: Types.MASTER_GET_UNITS_OF_CUSTOMER,
    payload: {custId, units},
  }),
  getUnitCustomerSuccess: (
    units: IUnit[],
    unitData: DropdownItemType[],
  ): IGetUnitOfCustomerSuccess => ({
    type: Types.MASTER_GET_UNITS_OF_CUSTOMER_SUCCESS,
    payload: {units, unitsDropdownData: unitData},
  }),
  getLocationsByUser: (): IGetLocationByUser => ({
    type: Types.MASTER_GET_LOCATIONS_BY_USER,
    payload: {},
  }),
  getLocationByUserSuccess: (
    locations: ILocation[],
  ): IGetLocationByUserSuccess => ({
    type: Types.MASTER_GET_LOCATIONS_BY_USER_SUCCESS,
    payload: {locations},
  }),
  getMenuByUser: (): IGetMenuByUser => ({
    type: Types.MASTER_GET_MENU_BY_USER,
    payload: {},
  }),
  getMenuByUserSuccess: (
    menus: IMasterMenu[],
    userMenuIds: number[],
  ): IGetMenuByUserSuccess => ({
    type: Types.MASTER_GET_MENU_BY_USER_SUCCESS,
    payload: {menus, userMenuIds},
  }),
  appStart: (): IAppStart => ({
    type: Types.MASTER_APP_START,
    payload: {},
  }),
  setupPassCode: (passCode: string): ISetupPasscode => ({
    type: Types.MASTER_SETUP_PASSCODE,
    payload: {passCode},
  }),
  loginSuccess: (
    tokenObj: AccessTokenObject,
    accessToken: string,
  ): ILoginSuccess => ({
    type: Types.MASTER_LOGIN_SUCCESS,
    payload: {tokenObj, accessToken},
  }),
  checkSetupPassCodeStatus: (): ICheckPassCodeStatus => ({
    type: Types.MASTER_CHECK_SETUP_PASSCODE_STATUS,
    payload: {},
  }),
  checkPassCodeIsValid: (passCode: string): ICheckPassCodeIsValid => ({
    type: Types.MASTER_CHECK_POSCODE_IS_VALID,
    payload: {passCode},
  }),
  getSaleLocation: (): IGetSaleLocation => ({
    type: Types.MASTER_GET_SALE_LOCATION,
    payload: {},
  }),
  getSaleLocationSuccess: (
    locations: ILocation[],
  ): IGetSaleLocationSuccess => ({
    type: Types.MASTER_GET_SALE_LOCATION_SUCCESS,
    payload: {locations},
  }),
  getSaleUnits: (custId?: string): IGetSaleUnits => ({
    type: Types.MASTER_GET_SALE_UNITS,
    payload: {custId},
  }),
  getSaleUnitsSuccess: (units: IUnit[]): IGetSaleUnitsSuccess => ({
    type: Types.MASTER_GET_SALE_UNITS_SUCCESS,
    payload: {units},
  }),
  getAllProducts: (): IGetAllProducts => ({
    type: Types.MASTER_GET_ALL_PRODUCTS,
    payload: {},
  }),
  getAllProductsSuccess: (
    products: IProductStockDTO[],
  ): IGetAllProductsSuccess => ({
    type: Types.MASTER_GET_ALL_PRODUCTS_SUCCESS,
    payload: {products},
  }),
};

export default MasterActions;
