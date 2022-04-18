import {
  GroupType,
  IDailySaleGroup,
  IDailySaleMonitoring,
  MonitoringType,
} from '~/apis/types.monitoring';
import {
  IFetchDailySale,
  IFetchDailySaleSuccess,
  IGroupBy,
  IGroupBySuccess,
  IHandleViewResults,
  ISetDataGroupByFile,
  Types,
} from './monitoring.types';

const MonitoringActions = {
  fetchDailySale: (
    type: MonitoringType,
    fromDate: string,
    toDate: string,
    unitIds?: string[],
    deptIds?: number[],
    customerCodes?: string[],
    productCodes?: string[],
    locationIds?: string[],
    month?: number,
    year?: number,
    officeIds?: number[],
    productTypes?: string[],
  ): IFetchDailySale => ({
    type: Types.FETCH_DAILY_SALE,
    payload: {
      type,
      fromDate,
      toDate,
      locationIds,
      productCodes,
      deptIds,
      unitIds,
      customerCodes,
      year,
      month,
      officeIds,
      productTypes,
    },
  }),
  fetchDailySaleSuccess: (
    data: IDailySaleMonitoring[],
  ): IFetchDailySaleSuccess => ({
    type: Types.FETCH_DAILY_SALE_SUCCESS,
    payload: {data},
  }),
  groupByField: (
    groupByField: string,
    data: IDailySaleMonitoring[],
  ): IGroupBy => ({
    type: Types.GROUP_BY,
    payload: {data, groupByField},
  }),
  groupByFieldSuccess: (groupData: IDailySaleGroup[]): IGroupBySuccess => ({
    type: Types.GROUP_BY_SUCCESS,
    payload: {groupData},
  }),
  setDataGroupByField: (
    dataGroupBy: IDailySaleMonitoring[],
  ): ISetDataGroupByFile => ({
    type: Types.SET_DATA_GROUP_BY_FIELD,
    payload: {dataGroupBy},
  }),
  setViewerByReportType: (
    reportType: MonitoringType,
    accountType?: 'MAIN' | 'SUB' | 'MAIN_AND_SUB',
  ): IHandleViewResults => ({
    type: Types.HANDLE_VIEW_RESULTS,
    payload: {type: reportType, accountType},
  }),
};

export default MonitoringActions;
