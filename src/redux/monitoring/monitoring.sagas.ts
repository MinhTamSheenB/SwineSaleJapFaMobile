import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {
  getGroupByMonitoring,
  getMonitoringType,
  getUserParams,
  onSagaNavigate,
  safe,
} from '../saga.helpers';
import {
  cndnReport,
  creditReport,
  dailyBalance,
  discountReport,
  fetchDailySale,
  monthlyBalance,
} from '~/apis/monitoring.services';
import {IGroupType, IUserParams} from '~/commons/types';
import {IFetchDailySale, IGroupBy, Types} from './monitoring.types';
import MonitoringActions from './monitoring.actions';
import {
  IDailySaleGroup,
  IDailySaleMonitoring,
  MonitoringType,
} from '~/apis/types.monitoring';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '../global/global.actions';

// WORKER
function* workerFetchDailySale({payload}: IFetchDailySale) {
  const {
    type,
    fromDate,
    toDate,
    customerCodes,
    unitIds,
    deptIds,
    productCodes,
    locationIds,
    month,
    year,
    officeIds,
    productTypes,
  } = payload;
  const userParams: IUserParams = yield select(getUserParams);

  yield put(MonitoringActions.setViewerByReportType(type, 'MAIN_AND_SUB'));

  let response: IDailySaleMonitoring[] = [];
  const regionId = userParams.regionId ?? '';

  switch (type) {
    case 'DAILY_SALE': {
      response = yield call(
        fetchDailySale,
        fromDate,
        toDate,
        regionId,
        officeIds ?? [],
        productTypes ?? [],
      );
      break;
    }
    case 'CUSTOMER_MONTHLY_BALANCE': {
      response = yield call(
        monthlyBalance,
        regionId,
        month ?? 0,
        year ?? 0,
        unitIds ?? [],
        customerCodes ?? [],
        officeIds ?? [],
      );
      break;
    }
    case 'CUSTOMER_DAILY_BALANCE': {
      response = yield call(dailyBalance, regionId, fromDate, toDate);
      break;
    }
    case 'DISCOUNT_MONITORING': {
      response = yield call(
        discountReport,
        regionId,
        fromDate,
        toDate,
        officeIds ?? [],
      );
      break;
    }
    case 'CNDN_MONITORING': {
      response = yield call(
        cndnReport,
        regionId,
        fromDate,
        toDate,
        officeIds ?? [],
      );
      break;
    }
    case 'CREDIT_MONITORING': {
      response = yield call(
        creditReport,
        regionId,
        fromDate,
        toDate,
        officeIds ?? [],
      );
      break;
    }
    default:
      break;
  }

  if (userParams && userParams.deptId !== 99) {
    // eslint-disable-next-line prettier/prettier
    response = response.filter((p) => p.UNITID !== '00005' && p.UNITID !== '00006');
  }

  if (customerCodes && customerCodes.length > 0)
    response = response.filter((p) => customerCodes.indexOf(p.CUSTID) > -1);
  if (unitIds && unitIds.length > 0)
    response = response.filter((p) => unitIds.indexOf(p.UNITID) > -1);
  if (deptIds && deptIds.length > 0)
    response = response.filter((p) => deptIds.indexOf(p.DEPTID) > -1);
  if (productCodes && productCodes.length > 0)
    response = response.filter((p) => productCodes.indexOf(p.PRODUCTID) > -1);
  if (locationIds && locationIds.length > 0)
    response = response.filter((p) => locationIds.indexOf(p.FARMID) > -1);
  // if (officeIds && officeIds.length > 0)
  //   response = response.filter((p) => officeIds.indexOf(p.OFFICEID) > -1);

  if (response.length < 1) {
    yield put(
      GlobalActions.openErrorInfoModal(
        'Không tìm thấy dữ liệu với điều kiện tìm kiếm',
        'WARNING',
      ),
    );
  } else {
    yield put(MonitoringActions.groupByField('', response));
    yield put(MonitoringActions.fetchDailySaleSuccess(response));

    yield onSagaNavigate({
      screen: ScreenType.Monitoring.Results,
      isNavigate: true,
    });
  }
}

/** Helper */

const getTotalFieldByMonitoringType = (type: MonitoringType): string => {
  switch (type) {
    case 'CNDN_MONITORING':
      return 'TOTALAMT';
    case 'DAILY_SALE':
      return 'AMOUNT';
    case 'DISCOUNT_MONITORING':
      return 'AMOUNT';
    case 'CREDIT_MONITORING':
      return 'REQUESTAMOUNT';
    case 'CUSTOMER_MONTHLY_BALANCE':
    case 'CUSTOMER_DAILY_BALANCE':
      return 'ENDBALANCE';
    default:
      return '';
  }
};

const getQtyFieldByMonitoringType = (type: MonitoringType): string => {
  switch (type) {
    case 'CNDN_MONITORING':
      return 'TOTALQTY';
    case 'DAILY_SALE':
      return 'NOOFHEAD';
    case 'CUSTOMER_MONTHLY_BALANCE':
    case 'CUSTOMER_DAILY_BALANCE':
      return 'BEGINBALANCE';
    default:
      return '';
  }
};

const getWeightFieldByMonitoringType = (type: MonitoringType): string => {
  switch (type) {
    case 'CNDN_MONITORING':
      return '';
    case 'DAILY_SALE':
      return 'QTYKG';
    default:
      return '';
  }
};

function* workerGroupByField({payload}: IGroupBy) {
  const {groupByField, data} = payload;

  const groupBys: IGroupType[] = yield select(getGroupByMonitoring);
  const monitoringType: MonitoringType = yield select(getMonitoringType);

  const groupFirst = groupBys.find((p) => p.key === groupByField);
  const totalField = getTotalFieldByMonitoringType(monitoringType);
  const qtyField = getQtyFieldByMonitoringType(monitoringType);
  const weightField = getWeightFieldByMonitoringType(monitoringType);

  if (!groupByField || groupByField === '') {
    yield put(
      MonitoringActions.groupByFieldSuccess([
        {
          id: '',
          name: '',
          total: data.reduce((a, b) => a + b[totalField], 0),
          qty: data.reduce((a, b) => a + b[qtyField], 0),
          weight: data.reduce((a, b) => a + b[weightField], 0),
          data,
          type: groupFirst ? groupFirst.type : undefined,
        },
      ]),
    );
    yield put(MonitoringActions.setDataGroupByField(data));
  } else {
    const groupValues: string[] = [
      ...new Set(data.map((p) => p[groupByField])),
    ];
    const groupsTemp: IDailySaleGroup[] = [];
    groupValues.forEach((gr) => {
      const dataByGroup: IDailySaleMonitoring[] = data.filter(
        (p) => p[groupByField] === gr,
      );
      const group: IDailySaleGroup = {
        id: gr,
        name: gr,
        total: dataByGroup.reduce((a, b) => a + b[totalField], 0),
        qty: dataByGroup.reduce((a, b) => a + b[qtyField], 0),
        weight: dataByGroup.reduce((a, b) => a + b[weightField], 0),
        data: dataByGroup,
        type: groupFirst ? groupFirst.type : undefined,
      };
      groupsTemp.push(group);
    });
    yield put(MonitoringActions.groupByFieldSuccess(groupsTemp));
  }
}

// WATCHER
function* watcherSearchSale() {
  yield takeEvery(Types.FETCH_DAILY_SALE, safe(workerFetchDailySale));
}

function* watcherGroupByField() {
  yield takeEvery(Types.GROUP_BY, safe(workerGroupByField));
}

export default function* monitoringSaga() {
  yield all([fork(watcherSearchSale), fork(watcherGroupByField)]);
}
