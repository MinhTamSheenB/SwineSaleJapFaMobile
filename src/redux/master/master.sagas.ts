/* eslint-disable no-empty-pattern */
import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import {
  getCustomers,
  getDepartmentByUser,
  getLocations,
  getOfficesByUser,
  getPriceByCustAndProduct,
  getProductsByUnit,
  getUnitsCustomer,
  getLocationsByUserId,
  getMenuFromMasterDb,
  loginMasterDb,
  checkUserHasSetupPasscode,
  setupPasscode,
  checkPasscodeIsValid,
  getSaleLocations,
  getSaleCustomerBalance,
  getSaleUnits,
  getSaleProductForStock,
} from '~/apis/master.service';
import {
  IAuthResponse,
  ICustomerBalance,
  ICustomerInfo,
  ILocation,
  IMasterLoginDTO,
  IMasterMenu,
  IMasterResponseCommon,
  IPasscodeAuth,
  IPrice,
  IPriceSwine,
  IProductStockDTO,
  IProductStockModel,
  IUnit,
} from '~/apis/types.service';
import {DropdownItemType, INavigateScreen, IUserParams} from '~/commons/types';
import {
  getAccessToken,
  getUserInfoAsyncStorage,
  storeAccessToken,
  storeUserInfoAsyncStorage,
} from '~/helpers/AsyncStorageHelpers';
import CryptoJsHelpers from '~/helpers/CryptoJSHelpers';
import {getCurrentDate, getValueOfDate} from '~/helpers/DatetimeHelpers';
import {storePassCode} from '~/helpers/KeychainHelpers';
import {
  convertStringToNumber,
  convertToLocalObject,
  isInvalidString,
  isValidString,
  removeUnicode,
} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '../global/global.actions';
import {getUserParams, onSagaNavigate, safe} from '../saga.helpers';
import MasterActions from './master.actions';
import {
  IAppStart,
  ICheckPassCodeIsValid,
  ICheckPassCodeStatus,
  IFetchingDepartment,
  IFetchingLocationByUnits,
  IFetchingOffice,
  IFetchingProductByUnit,
  IGetAllProducts,
  IGetCustomerBalance,
  IGetLocationByUser,
  IGetMenuByUser,
  IGetSaleLocation,
  IGetSaleUnits,
  IGetSwinePrice,
  IGetUnitOfCustomer,
  ILoginSuccess,
  ISetupPasscode,
  Types,
} from './master.types';
/** ================== WORKER ==================== */

function* handleAppStart({payload}: IAppStart) {
  // eslint-disable-next-line no-empty-pattern
  const {} = payload;
  const userParams: IUserParams | undefined = yield getUserInfoAsyncStorage();
  const accessToken = yield getAccessToken();
  if (
    isInvalidString(accessToken) ||
    !userParams ||
    isInvalidString(userParams.userId)
  ) {
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Main.Login,
    };
    onSagaNavigate(nav);
  } else {
    yield put(GlobalActions.updateUserParams(userParams));
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Main.PassCode,
    };
    onSagaNavigate(nav);
    // yield put(MasterActions.checkSetupPassCodeStatus());
  }
}

function* loginSuccess({payload}: ILoginSuccess) {
  const {tokenObj, accessToken} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const fullName = `${tokenObj.given_name} ${tokenObj.family_name}`;
  const userId = tokenObj.unique_name?.replace('@japfa.com', '') || '';
  yield storeUserInfoAsyncStorage(tokenObj.unique_name ?? '', fullName);
  yield storeAccessToken(`Bearer ${accessToken}`);
  yield put(
    GlobalActions.updateUserParams({
      ...userParams,
      userId,
      fullName,
      email: tokenObj.unique_name,
    }),
  );
  // yield put(MasterActions.checkSetupPassCodeStatus());
  yield put(MasterActions.getMenuByUser());
}

function* handleCheckSetupPassCodeStatus({payload}: ICheckPassCodeStatus) {
  // eslint-disable-next-line no-empty-pattern
  const {} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const accessToken = yield getAccessToken();
  const model: IPasscodeAuth = {appType: 'SWINE_SALE'};
  const result: IAuthResponse = yield call(
    checkUserHasSetupPasscode,
    accessToken,
    model,
  );
  if (!result.result) {
    // navigate qua setup passCode.
    onSagaNavigate({isNavigate: true, screen: ScreenType.Main.SetUpPassCode});
  } else {
    yield storePassCode(userParams.userId, result.message!);
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Main.PassCode,
    };
    onSagaNavigate(nav);
  }
}

function* handleSetupPassCode({payload}: ISetupPasscode) {
  const {passCode} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  // Gọi api lưu lại passcode user.r
  const accessToken = yield getAccessToken();
  const passcodeEncrypt = CryptoJsHelpers.encryptASE(passCode);
  const model: IPasscodeAuth = {
    appType: 'SWINE_SALE',
    passcode: passcodeEncrypt,
  };
  yield call(setupPasscode, accessToken, model);
  // Lưu lại keychain
  yield storePassCode(userParams.userId, passcodeEncrypt);
  yield put(GlobalActions.openErrorInfoModal('Thiết lập mã PIN thành công.'));
  yield delay(1000);
  yield put(GlobalActions.closeErrorInfoModal());
  onSagaNavigate({isNavigate: true, screen: ScreenType.Main.PassCode});
}

function* checkPassCodeIsValid({payload}: ICheckPassCodeIsValid) {
  const {passCode} = payload;
  const passcodeEncrypt = CryptoJsHelpers.encryptASE(passCode);
  const accessToken = yield getAccessToken();
  const model: IPasscodeAuth = {
    appType: 'SWINE_SALE',
    passcode: passcodeEncrypt,
  };
  const response: IAuthResponse = yield call(
    checkPasscodeIsValid,
    accessToken,
    model,
  );
  if (response.result) {
    yield put(MasterActions.getMenuByUser());
  } else {
    yield put(
      GlobalActions.openErrorInfoModal(
        'Mã PIN không đúng. Vui lòng thử lại.',
        'ERROR',
      ),
    );
  }
}

function* handleGetCustomers() {
  const userParams: IUserParams = yield select(getUserParams);
  const response: ICustomerInfo[] = yield call(
    getCustomers,
    userParams.regionId!,
    userParams.userId,
  );
  const customers = convertToLocalObject<ICustomerInfo>(
    response,
    'CUSTNAME',
    'CUSTOMERID',
    ['CUSTOMERID', 'CUSTNAME'],
  );
  const customerDropdown: DropdownItemType[] = response.map((item) => {
    const dropdownItem: DropdownItemType = {
      label: item.CUSTNAME,
      value: item.CUSTOMERID,
      keySearch:
        `${item.CUSTOMERID} ${item.NOSIGNCUSTNAME}`.toLocaleLowerCase(),
    };
    return dropdownItem;
  });
  yield put(MasterActions.getCustomersSuccess(customers));
  yield put(MasterActions.updateCustomerDropdownData(customerDropdown));
}

function* handleGetLocationByUnitIds({payload}: IFetchingLocationByUnits) {
  const response: ILocation[] = yield call(getLocations, payload);

  const dropdownData: DropdownItemType[] = response.map((item) => {
    const dropdownItem: DropdownItemType = {
      label: `${item.LOCATIONNAME} ${item.UNITNAME}`,
      value: item.LOCATIONID ?? '',
      keySearch: `${removeUnicode(item.LOCATIONNAME)} ${item.LOCATIONID}`,
      unitId: item.UNITID,
    };
    return dropdownItem;
  });

  yield put(MasterActions.getLocationByUnitsSuccess(response));
  yield put(MasterActions.updateLocationDropdownData(dropdownData));
}

function* getOffices({payload}: IFetchingOffice) {
  const userParams: IUserParams = yield select(getUserParams);
  const offices: IMasterResponseCommon[] = yield call(
    getOfficesByUser,
    userParams.userId,
  );

  const officesConvert = convertToLocalObject<IMasterResponseCommon>(
    offices,
    ['Name'],
    ['ID'],
    ['ID', 'Name'],
  );

  yield put(MasterActions.getOfficesSuccess(officesConvert));
  if (offices.length > 1) {
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Main.Office,
    };
    onSagaNavigate(nav);
  } else {
    const office: IMasterResponseCommon = offices[0];
    const officeId = convertStringToNumber(office.ID);
    yield put(MasterActions.getDepartments(userParams.userId, officeId));

    userParams.officeId = officeId;
    userParams.regionId = office.RegionID ?? '';
    yield put(GlobalActions.updateUserParams(userParams));
    onSagaNavigate({isNavigate: true, screen: ScreenType.Main.Home});
  }
}

function* getDepartments({payload}: IFetchingDepartment) {
  const {userId, officeID} = payload;
  const response: IMasterResponseCommon[] = yield call(
    getDepartmentByUser,
    userId,
    officeID,
  );
  const departments = convertToLocalObject<IMasterResponseCommon>(
    response,
    ['Name'],
    ['IDNumber'],
  );
  yield put(MasterActions.getDepartmentsSuccess(departments));
  if (departments.length > 0) {
    const userParams: IUserParams = yield select(getUserParams);
    const item: IMasterResponseCommon = departments[0];
    const deptIdNumber = item.IDNumber;
    yield put(
      GlobalActions.updateUserParams({...userParams, deptId: deptIdNumber}),
    );
  }
}

function* getProducts({payload: unitID}: IFetchingProductByUnit) {
  const userPrams: IUserParams = yield select(getUserParams);
  const response: IMasterResponseCommon[] = yield call(
    getProductsByUnit,
    userPrams.regionId!,
    unitID,
  );
  const products: IMasterResponseCommon[] = convertToLocalObject(
    response,
    'Name',
    'ID',
  );
  yield put(MasterActions.getProductsByUnitSuccess(products));
}

function* handleGetSwinePrice({payload}: IGetSwinePrice) {
  const response: IPriceSwine = yield call(getPriceByCustAndProduct, payload);
  const prices: IPrice[] =
    response.Status.code === 200 ? response.priceLogs : [];
  yield put(MasterActions.getSwinePriceSuccess(prices));
}

function* handleGetCustomerBalance({payload}: IGetCustomerBalance) {
  const {unitId, custId} = payload;
  const currentDate = getCurrentDate();
  const year = Number.parseInt(getValueOfDate(currentDate, 'YEAR'), 10);
  const month = Number.parseInt(getValueOfDate(currentDate, 'MONTH'), 10);
  const userParams: IUserParams = yield select(getUserParams);
  const balances: ICustomerBalance[] = yield call(
    getSaleCustomerBalance,
    userParams.regionId ?? '0',
    custId,
    unitId,
    month,
    year,
  );
  yield put(MasterActions.getCustomerBalanceSuccess(balances));
}

function* handleGetUnitCustomer({payload}: IGetUnitOfCustomer) {
  const {custId, units} = payload;
  const unitData: IUnit[] = yield call(getUnitsCustomer, custId, units);

  const unitsLocal = convertToLocalObject<IUnit>(
    unitData,
    ['UNITWITHNAME'],
    ['UNITID'],
  );
  yield put(MasterActions.getUnitCustomerSuccess(unitsLocal, []));
}

function* getLocationsByUser({payload}: IGetLocationByUser) {
  const {} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const locations: ILocation[] = yield call(
    getLocationsByUserId,
    userParams.regionId!,
    userParams.userId,
  );
  const newLocations = convertToLocalObject<ILocation>(
    locations,
    ['UNITNAME', 'LOCATIONNAME'],
    ['UNITID', 'LOCATIONID'],
    ['UNITNAME', 'UNITID', 'LOCATIONNAME'],
  );
  yield put(MasterActions.getLocationByUserSuccess(newLocations));
}

function* getMenuUser({payload}: IGetMenuByUser) {
  const {} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  let email = userParams && userParams.email ? userParams.email : '';
  if (isInvalidString(email) && isValidString(userParams.userId)) {
    email = `${userParams.userId}@japfa.com`;
  }

  if (isInvalidString(email)) throw new Error('Không tìm thấy email user.');

  try {
    const userDto: IMasterLoginDTO = yield call(loginMasterDb, email);
    const menus: IMasterMenu[] = yield call(
      getMenuFromMasterDb,
      userDto.userID ?? 0,
      userDto.accessToken,
    );

    const menuIds: number[] = [];
    menus.forEach((menu) => {
      menu.menulv2.forEach((subMenu) => {
        menuIds.push(subMenu.common.idNum);
      });
    });

    yield put(MasterActions.getMenuByUserSuccess(menus, menuIds));
  } catch {
    throw new Error(
      'Tài khoản của bạn chưa được cấp quyền truy câp. Vui lòng liên hệ IT để được hướng dẫn.',
    );
  }
  // Trường hợp user được phân quyền (có menu) thì không quăng lỗi
  yield put(MasterActions.getOffices(userParams.unitId!));
}

function* handleGetSaleLocation({payload}: IGetSaleLocation) {
  const {} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const response: ILocation[] = yield call(
    getSaleLocations,
    userParams.regionId!,
    userParams.userId,
    userParams.unitId,
  );
  const locations = convertToLocalObject<ILocation>(
    response,
    ['UNITID', 'LOCATIONID', 'LOCATIONNAME'],
    ['UNITID', 'LOCATIONID'],
    ['UNITID', 'LOCATIONID', 'LOCATIONNAME'],
  );
  yield put(MasterActions.getSaleLocationSuccess(locations));
}

function* handleGetSaleUnit({payload}: IGetSaleUnits) {
  const {custId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const units = yield call(getSaleUnits, userParams.regionId ?? '', custId);
  const unitsLocal = convertToLocalObject<IUnit>(
    units,
    ['UNITWITHNAME'],
    ['UNITID'],
  );
  yield put(MasterActions.getSaleUnitsSuccess(unitsLocal));
}

function* handleGetAllProduct({payload}: IGetAllProducts) {
  const userParams: IUserParams = yield select(getUserParams);
  const iStockModel: IProductStockModel = {
    regionId: userParams.regionId,
  };
  const products = convertToLocalObject<IProductStockDTO>(
    yield call(getSaleProductForStock, iStockModel),
    'NAME_VN',
    'PRODUCTID',
    ['PRODUCTID', 'NAME_VN'],
  );
  yield put(MasterActions.getAllProductsSuccess(products));
}
/** ========== WATCHER ================= */

function* watchMasterSaga() {
  yield takeEvery(Types.MASTER_FETCHING_CUSTOMERS, safe(handleGetCustomers));
}

function* watchGetLocationByUnits() {
  yield takeEvery(
    Types.MASTER_FETCHING_LOCAL_BY_UNITIDS,
    safe(handleGetLocationByUnitIds),
  );
}

function* watchGetOffices() {
  yield takeEvery(Types.MASTER_FETCHING_OFFICE_BY_USER, safe(getOffices));
}

function* watchGetDepartments() {
  yield takeEvery(
    Types.MASTER_FETCHING_DEPARTMENT_BY_USER,
    safe(getDepartments),
  );
}

function* watchGetProductByUnit() {
  yield takeEvery(Types.MASTER_FETCHING_PRODUCTS_BY_UNIT, safe(getProducts));
}

function* watchGetSwinePrice() {
  yield takeEvery(
    Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT,
    safe(handleGetSwinePrice),
  );
}

function* watchGetCustomerBalance() {
  yield takeEvery(
    Types.MASTER_GET_CUSTOMER_BALANCES,
    safe(handleGetCustomerBalance),
  );
}

function* watchGetUnitsCustomer() {
  yield takeEvery(
    Types.MASTER_GET_UNITS_OF_CUSTOMER,
    safe(handleGetUnitCustomer),
  );
}

function* watchGetLocationsByUser() {
  yield takeEvery(Types.MASTER_GET_LOCATIONS_BY_USER, safe(getLocationsByUser));
}

function* watchGetMenuByUser() {
  yield takeEvery(Types.MASTER_GET_MENU_BY_USER, safe(getMenuUser));
}

function* watchAppStart() {
  yield takeEvery(Types.MASTER_APP_START, safe(handleAppStart));
}

function* watchSetupPasscode() {
  yield takeEvery(Types.MASTER_SETUP_PASSCODE, safe(handleSetupPassCode));
}

function* watchLoginSuccess() {
  yield takeEvery(Types.MASTER_LOGIN_SUCCESS, safe(loginSuccess));
}

function* watchCheckSetupPassCodeStatus() {
  yield takeEvery(
    Types.MASTER_CHECK_SETUP_PASSCODE_STATUS,
    safe(handleCheckSetupPassCodeStatus),
  );
}

function* watchCheckPassCodeIsValid() {
  yield takeEvery(
    Types.MASTER_CHECK_POSCODE_IS_VALID,
    safe(checkPassCodeIsValid),
  );
}

function* watchGetSaleLocation() {
  yield takeEvery(Types.MASTER_GET_SALE_LOCATION, safe(handleGetSaleLocation));
}

function* watchGetSaleUnit() {
  yield takeEvery(Types.MASTER_GET_SALE_UNITS, safe(handleGetSaleUnit));
}

function* watchGetAllProduct() {
  yield takeEvery(Types.MASTER_GET_ALL_PRODUCTS, safe(handleGetAllProduct));
}

export default function* masterSaga() {
  yield all([
    fork(watchMasterSaga),
    fork(watchGetLocationByUnits),
    fork(watchGetOffices),
    fork(watchGetDepartments),
    fork(watchGetProductByUnit),
    fork(watchGetSwinePrice),
    fork(watchGetCustomerBalance),
    fork(watchGetUnitsCustomer),
    fork(watchGetLocationsByUser),
    fork(watchGetMenuByUser),
    fork(watchAppStart),
    fork(watchSetupPasscode),
    fork(watchLoginSuccess),
    fork(watchCheckSetupPassCodeStatus),
    fork(watchCheckPassCodeIsValid),
    fork(watchGetSaleLocation),
    fork(watchGetSaleUnit),
    fork(watchGetAllProduct),
  ]);
}
