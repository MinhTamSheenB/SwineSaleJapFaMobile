/* eslint-disable dot-notation */
import {post} from '~/helpers/HttpHelpers';
import {IDailySaleMonitoring} from './types.monitoring';

export const fetchDailySale = async (
  fromDate: string,
  toDate: string,
  regionId: string,
  officeIds: number[],
  productsTypes: string[],
): Promise<IDailySaleMonitoring[]> => {
  const body: object = {
    _REGIONS: {
      SEARCHTYPE: 1,
      S_STARTVALUE: regionId,
    },
    _DATE: {
      SEARCHTYPE: 2,
      D_STARTVALUE: fromDate,
      D_ENDVALUE: toDate,
    },
  };

  if (officeIds.length > 0) {
    body['_OFFICES'] = {
      SEARCHTYPE: 3,
      LIST_NUM_VALUE: officeIds,
    };
  }

  if (productsTypes.length > 0) {
    body['_PRODTYPE'] = {
      SEARCHTYPE: 3,
      LIST_STR_VALUE: productsTypes,
    };
  }
  return post<IDailySaleMonitoring[]>(`sale/search`, body);
};

export const monthlyBalance = async (
  regionId: string,
  month: number,
  year: number,
  unitIds: string[],
  customerIds: string[],
  officeIds: number[],
): Promise<IDailySaleMonitoring[]> => {
  const body: object = {};
  if (unitIds.length > 0) {
    body['_UNITS'] = {
      SEARCHTYPE: 3,
      LIST_STR_VALUE: unitIds,
    };
  }
  if (customerIds.length > 0) {
    body['_CUSTOMER'] = {
      SEARCHTYPE: 3,
      LIST_STR_VALUE: customerIds,
    };
  }

  if (officeIds.length > 0) {
    body['_OFFICES'] = {
      SEARCHTYPE: 3,
      LIST_NUM_VALUE: officeIds,
    };
  }

  return post<IDailySaleMonitoring[]>(
    `sale/master/customer/view/advbalance`,
    body,
    {regionId, month, year},
  );
};

export const dailyBalance = async (
  regionId: string,
  fromDate: string,
  toDate: string,
): Promise<IDailySaleMonitoring[]> => {
  return post<IDailySaleMonitoring[]>(
    `sale/master/customer/view/advbalancedetail`,
    {
      _DATE: {
        SEARCHTYPE: 2,
        D_STARTVALUE: fromDate,
        D_ENDVALUE: toDate,
      },
    },
    {regionId},
  );
};

export const discountReport = async (
  regionId: string,
  fromDate: string,
  toDate: string,
  officeIds: number[],
) => {
  const obj = {
    _REGIONS: {
      SEARCHTYPE: 1,
      S_STARTVALUE: regionId,
    },
    _DATE: {
      SEARCHTYPE: 2,
      D_STARTVALUE: fromDate,
      D_ENDVALUE: toDate,
    },
  };
  if (officeIds.length > 0) {
    obj['_OFFICES'] = {
      SEARCHTYPE: 3,
      LIST_NUM_VALUE: officeIds,
    };
  }

  return post<IDailySaleMonitoring[]>(`sale/Discount/advsearch`, obj);
};

export const cndnReport = async (
  regionId: string,
  fromDate: string,
  toDate: string,
  officeIds: number[],
) => {
  const filter = {
    LoginUser: '',
    _REGIONS: {
      SEARCHTYPE: 1,
      S_STARTVALUE: regionId,
    },
    _DATE: {
      SEARCHTYPE: 2,
      D_STARTVALUE: fromDate,
      D_ENDVALUE: toDate,
    },
  };
  if (officeIds.length > 0) {
    filter['_OFFICES'] = {
      SEARCHTYPE: 3,
      LIST_NUM_VALUE: officeIds,
    };
  }
  return post<IDailySaleMonitoring[]>('sale/cndn/advsearch', filter);
};

export const creditReport = async (
  regionId: string,
  fromDate: string,
  toDate: string,
  officeIds: number[],
) => {
  const filter = {
    LoginUser: '',
    _REGIONS: {
      SEARCHTYPE: 1,
      S_STARTVALUE: regionId,
    },
    _DATE: {
      SEARCHTYPE: 2,
      D_STARTVALUE: fromDate,
      D_ENDVALUE: toDate,
    },
  };

  if (officeIds.length > 0) {
    filter['_OFFICES'] = {
      SEARCHTYPE: 3,
      LIST_NUM_VALUE: officeIds,
    };
  }

  return post<IDailySaleMonitoring[]>('sale/credit/advsearch', filter);
};
