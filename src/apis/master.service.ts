import {
  PRICE_API_URL,
  MASTER_URL,
  AUTH_URL,
  masterConstant,
} from '~/configs/strings';
import {post, get, getWithUrl, postWithUrl} from '~/helpers/HttpHelpers';
import {
  IAuthResponse,
  ICustomerBalance,
  ICustomerInfo,
  ILocation,
  IMasterLoginDTO,
  IMasterMenu,
  IMasterResponseCommon,
  IPasscodeAuth,
  IPriceModel,
  IPriceSwine,
  IProductStockDTO,
  IProductStockModel,
  IUnit,
} from './types.service';

const masterEndPoint = 'master';
const endPoint = 'sale/master';

/** Lấy danh sách office của user */
export const getOfficesByUser = (
  userid: string,
): Promise<IMasterResponseCommon[]> => {
  return get<IMasterResponseCommon[]>(`${masterEndPoint}/office/user`, {
    userid,
  });
};

/** Lấy danh sách phòng ban theo user id */
export const getDepartmentByUser = (
  userid: string,
  officeID: number,
): Promise<IMasterResponseCommon[]> => {
  return get<IMasterResponseCommon[]>(`${masterEndPoint}/department/user`, {
    userid,
    officeID,
  });
};

// Lấy danh sách các Trại/ Kho theo danh sach unitId
export const getLocations = async (unitIDs: string[]): Promise<ILocation[]> => {
  return post<ILocation[]>(`${endPoint}/locationbyunit`, unitIDs);
};

export const getSaleLocations = async (
  regionId: string,
  userId?: string,
  unitId?: string,
  custId?: string,
  locationId?: string,
): Promise<ILocation[]> => {
  return get<ILocation[]>(`${endPoint}/GetSaleLocation`, {
    regionId,
    userId,
    unitId,
    custId,
    locationId,
  });
};

export const getCustomers = async (
  regionId: string,
  userId?: string,
  unitId?: string,
  custId?: string,
  locationId?: string,
): Promise<ICustomerInfo[]> => {
  return get<ICustomerInfo[]>(`${endPoint}/GetSaleCustomer`, {
    regionId,
    unitId,
    custId,
    locationId,
    userId,
  });
};

export const getProductsByUnit = async (
  regionId: string,
  unitID?: string,
): Promise<IMasterResponseCommon[]> => {
  return get<IMasterResponseCommon[]>(`${endPoint}/GetSaleProduct`, {
    regionId,
    unitID,
  });
};

// Lấy giá sản phẩm
export const getPriceByCustAndProduct = async (
  price: IPriceModel,
): Promise<IPriceSwine> => {
  return getWithUrl<IPriceSwine>(
    PRICE_API_URL,
    `prices/pricesWextname/${price.customerId}/${price.productId}`,
    price,
  );
};

/**
 * Lấy số dư tài khoản khách hàng
 * @param CustId Mã khách hàng
 * @param UnitId Unit cần xem
 */
export const getBalanceOfCustomer = async (
  CustId: string,
  UnitId: string,
): Promise<ICustomerBalance[]> => {
  return get<ICustomerBalance[]>(`${endPoint}/customer/view/balance`, {
    CustId,
    UnitId,
  });
};

export const getUnitsCustomer = async (
  custId: string,
  units: string[],
): Promise<IUnit[]> => {
  return post<IUnit[]>(`${endPoint}/unit`, units, {custId});
};

/**
 * Lấy units phần mềm sale.
 * @param model
 * @returns danh sách units theo điều kiện.
 */
export const getSaleUnits = async (
  regionId: string,
  custId?: string,
): Promise<IUnit[]> => {
  return get<IUnit[]>(`${endPoint}/GetSaleUnits`, {regionId, custId});
};

export const getSaleProductForStock = async (
  model: IProductStockModel,
): Promise<IProductStockDTO[]> => {
  return get<IProductStockDTO[]>(`${endPoint}/GetSaleProductForStock`, model);
};

export const getLocationsByUserId = async (
  regionId: string,
  userId: string,
): Promise<ILocation[]> => {
  return get<ILocation[]>(`${endPoint}/GetSaleLocationByUser`, {
    regionId,
    userId,
  });
};

export const loginMasterDb = async (
  email: string,
): Promise<IMasterLoginDTO> => {
  const obj: object = {
    appID: masterConstant.appID,
    email,
    clientID: masterConstant.clientID,
    loginLog: masterConstant.loginLog,
  };
  return postWithUrl<IMasterLoginDTO>(MASTER_URL, 'Apps/login', undefined, obj);
};

// Lấy menu được phân quyền theo user.
export const getMenuFromMasterDb = async (
  userID: number,
  accessToken: string,
): Promise<IMasterMenu[]> => {
  return getWithUrl<IMasterMenu[]>(
    MASTER_URL,
    'Apps/menus',
    {userID, appID: masterConstant.appID},
    accessToken,
  );
};

export const checkUserHasSetupPasscode = async (
  accessToken: string,
  model: IPasscodeAuth,
): Promise<IAuthResponse> => {
  return postWithUrl<IAuthResponse>(
    AUTH_URL,
    'auth/passcode/validate',
    model,
    undefined,
    accessToken,
  );
};

export const setupPasscode = async (
  accessToken: string,
  model: IPasscodeAuth,
): Promise<IAuthResponse> => {
  return postWithUrl<IAuthResponse>(
    AUTH_URL,
    'auth/passcode',
    model,
    undefined,
    accessToken,
  );
};

export const checkPasscodeIsValid = async (
  accessToken: string,
  model: IPasscodeAuth,
): Promise<IAuthResponse> => {
  return postWithUrl<IAuthResponse>(
    AUTH_URL,
    'auth/passcode/check',
    model,
    undefined,
    accessToken,
  );
};

export const getSaleCustomerBalance = async (
  regionId: string,
  custId: string,
  unitId: string,
  month: number,
  year: number,
): Promise<ICustomerBalance[]> => {
  return get<ICustomerBalance[]>(
    `${endPoint}/customer/view/GetSaleCustomerBalance`,
    {regionId, custId, unitId, month, year},
  );
};
