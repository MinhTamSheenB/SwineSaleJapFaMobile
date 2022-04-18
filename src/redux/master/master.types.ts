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

export interface IMasterState {
  userOfficeS: IMasterResponseCommon[];
  userDepartmentS: IMasterResponseCommon[];
  customers: ICustomerInfo[];
  locations: ILocation[];
  saleLocations: ILocation[];
  productsUnit: IMasterResponseCommon[];
  productsDropdownData: DropdownItemType[];
  customerDropdownData: DropdownItemType[];
  locationsDropdownData: DropdownItemType[];
  prices: IPrice[];
  customerBalances: ICustomerBalance[];
  discountTypeDropdownData: DropdownItemType[];
  unitsOfCustomer: IUnit[];
  unitsCustomerDropdownData: DropdownItemType[];
  locationsOfUser: ILocation[];
  userMenus: IMasterMenu[];
  userMenuIds: number[];
  unitsSale: IUnit[];

  products: IProductStockDTO[];
}

export interface IDepartmentParams {
  userId: string;
  officeID: number;
}

export enum Types {
  MASTER_FETCHING_CUSTOMERS = 'MASTER_FETCHING_CUSTOMERS',
  MASTER_FETCH_CUSTOMERS_SUCCESS = 'MASTER_FETCH_CUSTOMERS_SUCCESS',
  MASTER_UPDATE_CUSTOMER_DROPDOWN_DATA = 'MASTER_UPDATE_CUSTOMER_DROPDOWN_DATA',

  MASTER_FETCHING_LOCAL_BY_UNITIDS = 'MASTER_FETCHING_LOCAL_BY_UNITIDS',
  MASTER_FETCH_LOCATION_BY_UNIT_SUCCESS = 'MASTER_FETCH_LOCATION_BY_UNIT_SUCCESS',
  MASTER_UPDATE_LOCATION_DROPDOWN_DATA = 'MASTER_UPDATE_LOCATION_DROPDOWN_DATA',

  MASTER_GET_SALE_LOCATION = 'MASTER_GET_SALE_LOCATION',
  MASTER_GET_SALE_LOCATION_SUCCESS = 'MASTER_GET_SALE_LOCATION_SUCCESS',

  MASTER_FETCHING_OFFICE_BY_USER = 'MASTER_FETCHING_OFFICE_BY_USER',
  MASTER_FETCH_OFFICE_BY_USER_SUCCESS = 'MASTER_FETCH_OFFICE_BY_USER_SUCCESS',
  MASTER_FETCHING_DEPARTMENT_BY_USER = 'MASTER_FETCHING_DEPARTMENT_BY_USER',
  MASTER_FETCH_DEPARTMENT_BY_USER_SUCCESS = 'MASTER_FETCH_DEPARTMENT_BY_USER_SUCCESS',

  MASTER_FETCHING_PRODUCTS_BY_UNIT = 'MASTER_FETCHING_PRODUCTS_BY_UNIT',
  MASTER_FETCH_PRODUCTS_BY_UNIT_SUCCESS = 'MASTER_FETCH_PRODUCTS_BY_UNIT_SUCCESS',

  MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT = 'MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT',
  MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT_SUCCESS = 'MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT_SUCCESS',

  MASTER_GET_CUSTOMER_BALANCES = 'MASTER_GET_CUSTOMER_BALANCES',
  MASTER_GET_CUSTOMER_BALANCES_SUCCESS = 'MASTER_GET_CUSTOMER_BALANCES_SUCCESS',

  MASTER_GET_UNITS_OF_CUSTOMER = 'MASTER_GET_UNITS_OF_CUSTOMER',
  MASTER_GET_UNITS_OF_CUSTOMER_SUCCESS = 'MASTER_GET_UNITS_OF_CUSTOMER_SUCCESS',

  MASTER_GET_LOCATIONS_BY_USER = 'MASTER_GET_LOCATIONS_BY_USER',
  MASTER_GET_LOCATIONS_BY_USER_SUCCESS = 'MASTER_GET_LOCATIONS_BY_USER_SUCCESS',

  MASTER_GET_MENU_BY_USER = 'MASTER_GET_MENU_BY_USER',
  MASTER_GET_MENU_BY_USER_SUCCESS = 'MASTER_GET_MENU_BY_USER_SUCCESS',

  MASTER_APP_START = 'MASTER_APP_START',
  MASTER_LOGIN_SUCCESS = 'MASTER_LOGIN_SUCCESS',

  MASTER_SETUP_PASSCODE = 'MASTER_SETUP_PASSCODE',
  MASTER_SETUP_PASSCODE_SUCCESS = 'MASTER_SETUP_PASSCODE_SUCCESS',

  MASTER_CHECK_SETUP_PASSCODE_STATUS = 'MASTER_CHECK_SETUP_PASSCODE_STATUS',
  MASTER_CHECK_POSCODE_IS_VALID = 'MASTER_CHECK_POSCODE_IS_VALID',

  MASTER_GET_SALE_UNITS = 'MASTER_GET_SALE_UNITS',
  MASTER_GET_SALE_UNITS_SUCCESS = 'MASTER_GET_SALE_UNITS_SUCCESS',

  MASTER_GET_ALL_PRODUCTS = 'MASTER/GET_ALL_PRODUCT',
  MASTER_GET_ALL_PRODUCTS_SUCCESS = 'MASTER/GET_ALL_PRODUCT_SUCCESS',
}

export interface IAppStart {
  type: Types.MASTER_APP_START;
  payload: {};
}

export interface IFetchingCustomer {
  type: Types.MASTER_FETCHING_CUSTOMERS;
}

export interface IFetchCustomerSuccess {
  type: Types.MASTER_FETCH_CUSTOMERS_SUCCESS;
  payload: ICustomerInfo[];
}

export interface IUpdateCustomerDropdownData {
  type: Types.MASTER_UPDATE_CUSTOMER_DROPDOWN_DATA;
  payload: DropdownItemType[];
}

export interface IFetchingLocationByUnits {
  type: Types.MASTER_FETCHING_LOCAL_BY_UNITIDS;
  payload: string[];
}

export interface IUpdateLocationDropdownData {
  type: Types.MASTER_UPDATE_LOCATION_DROPDOWN_DATA;
  payload: DropdownItemType[];
}

export interface IFetchLocationByUnitsSuccess {
  type: Types.MASTER_FETCH_LOCATION_BY_UNIT_SUCCESS;
  payload: ILocation[];
}

export interface IFetchingOffice {
  type: Types.MASTER_FETCHING_OFFICE_BY_USER;
  payload: string;
}

export interface IFetchOfficeSuccess {
  type: Types.MASTER_FETCH_OFFICE_BY_USER_SUCCESS;
  payload: IMasterResponseCommon[];
}

export interface IFetchingDepartment {
  type: Types.MASTER_FETCHING_DEPARTMENT_BY_USER;
  payload: IDepartmentParams;
}

export interface IFetchDepartmentSuccess {
  type: Types.MASTER_FETCH_DEPARTMENT_BY_USER_SUCCESS;
  payload: IMasterResponseCommon[];
}

export interface IFetchingProductByUnit {
  type: Types.MASTER_FETCHING_PRODUCTS_BY_UNIT;
  payload?: string;
}

export interface IFetchProductsByUnitSuccess {
  type: Types.MASTER_FETCH_PRODUCTS_BY_UNIT_SUCCESS;
  payload: IMasterResponseCommon[];
}

export interface IGetSwinePrice {
  type: Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT;
  payload: IPriceModel;
}

export interface IGetSwinePriceSuccess {
  type: Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT_SUCCESS;
  payload: IPrice[];
}

export interface IGetCustomerBalance {
  type: Types.MASTER_GET_CUSTOMER_BALANCES;
  payload: {custId: string; unitId: string};
}

export interface IGetCustomerBalanceSuccess {
  type: Types.MASTER_GET_CUSTOMER_BALANCES_SUCCESS;
  payload: ICustomerBalance[];
}

export interface IGetUnitOfCustomer {
  type: Types.MASTER_GET_UNITS_OF_CUSTOMER;
  payload: {custId: string; units: string[]};
}

export interface IGetUnitOfCustomerSuccess {
  type: Types.MASTER_GET_UNITS_OF_CUSTOMER_SUCCESS;
  payload: {units: IUnit[]; unitsDropdownData: DropdownItemType[]};
}

export interface IGetLocationByUser {
  type: Types.MASTER_GET_LOCATIONS_BY_USER;
  payload: {};
}

export interface IGetLocationByUserSuccess {
  type: Types.MASTER_GET_LOCATIONS_BY_USER_SUCCESS;
  payload: {locations: ILocation[]};
}

export interface IGetMenuByUser {
  type: Types.MASTER_GET_MENU_BY_USER;
  payload: {};
}

export interface IGetMenuByUserSuccess {
  type: Types.MASTER_GET_MENU_BY_USER_SUCCESS;
  payload: {menus: IMasterMenu[]; userMenuIds: number[]};
}

export interface ISetupPasscode {
  type: Types.MASTER_SETUP_PASSCODE;
  payload: {passCode: string};
}

export interface ILoginSuccess {
  type: Types.MASTER_LOGIN_SUCCESS;
  payload: {
    tokenObj: AccessTokenObject;
    accessToken: string;
  };
}

export interface ICheckPassCodeStatus {
  type: Types.MASTER_CHECK_SETUP_PASSCODE_STATUS;
  payload: {};
}

export interface ICheckPassCodeIsValid {
  type: Types.MASTER_CHECK_POSCODE_IS_VALID;
  payload: {passCode: string};
}

export interface IGetSaleLocation {
  type: Types.MASTER_GET_SALE_LOCATION;
  payload: {};
}

export interface IGetSaleLocationSuccess {
  type: Types.MASTER_GET_SALE_LOCATION_SUCCESS;
  payload: {locations: ILocation[]};
}

export interface IGetSaleUnits {
  type: Types.MASTER_GET_SALE_UNITS;
  payload: {custId?: string};
}

export interface IGetSaleUnitsSuccess {
  type: Types.MASTER_GET_SALE_UNITS_SUCCESS;
  payload: {units: IUnit[]};
}

export interface IGetAllProducts {
  type: Types.MASTER_GET_ALL_PRODUCTS;
  payload: {};
}

export interface IGetAllProductsSuccess {
  type: Types.MASTER_GET_ALL_PRODUCTS_SUCCESS;
  payload: {products: IProductStockDTO[]};
}

export type MasterActionsType =
  | IFetchCustomerSuccess
  | IFetchingLocationByUnits
  | IFetchLocationByUnitsSuccess
  | IFetchOfficeSuccess
  | IFetchDepartmentSuccess
  | IFetchProductsByUnitSuccess
  | IGetSwinePriceSuccess
  | IGetCustomerBalanceSuccess
  | IUpdateCustomerDropdownData
  | IUpdateLocationDropdownData
  | IGetUnitOfCustomerSuccess
  | IGetLocationByUserSuccess
  | IGetMenuByUserSuccess
  | IGetSaleLocationSuccess
  | IGetSaleUnitsSuccess
  | IGetAllProductsSuccess;
