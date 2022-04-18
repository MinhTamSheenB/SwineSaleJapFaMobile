import {
  GroupType,
  IDailySaleGroup,
  IDailySaleMonitoring,
  MonitoringType,
} from '~/apis/types.monitoring';
import {IGroupType} from '~/commons/types';

export const dailySale = {
  groupBys: [
    {key: '', name: 'Mặc định'},
    {key: 'UNITGRP', name: 'Đơn vị'},
    {key: 'DEPTGRP', name: 'Bộ phận'},
    {key: 'CUSTGRP', name: 'Khách hàng/ Trại nhận'},
    {key: 'FARMGRP', name: 'Trại xuất'},
    {key: 'FLOCKGRP', name: 'Đàn xuất'},
    {key: 'FLOCKGRP_REV', name: 'Đàn nhận'},
    {key: 'PRODTYPENAME', name: 'Loại sản phẩm'},
  ],
};

export interface IState {
  dataDailySale: IDailySaleMonitoring[];
  dataGroupBy: IDailySaleMonitoring[];
  groupFieldData: IDailySaleGroup[];
  groupBys: IGroupType[];
  viewer: {fields: string[]; titles: string[]};
  monitoringType: MonitoringType;
}

export enum Types {
  FETCH_DAILY_SALE = 'MONITORING/FETCH_DAILY_SALE',
  FETCH_DAILY_SALE_SUCCESS = 'MONITORING/FETCH_DAILY_SALE_SUCCESS',

  GROUP_BY = 'MONITORING/GROUP_BY',
  GROUP_BY_SUCCESS = 'MONITORING/GROUP_BY_SUCCESS',

  SET_DATA_GROUP_BY_FIELD = 'MONITORING/SET_DATA_GROUP_BY_FIELD',

  HANDLE_VIEW_RESULTS = 'MONITORING/HANDLE_VIEW_RESULTS',
}

export interface IFetchDailySale {
  type: Types.FETCH_DAILY_SALE;
  payload: {
    type: MonitoringType;
    fromDate: string;
    toDate: string;
    deptIds?: number[];
    unitIds?: string[];
    customerCodes?: string[];
    productCodes?: string[];
    locationIds?: string[];
    month?: number;
    year?: number;
    officeIds?: number[];
    productTypes?: string[];
  };
}

export interface IFetchDailySaleSuccess {
  type: Types.FETCH_DAILY_SALE_SUCCESS;
  payload: {data: IDailySaleMonitoring[]};
}

export interface IGroupBy {
  type: Types.GROUP_BY;
  payload: {
    groupByField: string;
    data: IDailySaleMonitoring[];
  };
}

export interface IGroupBySuccess {
  type: Types.GROUP_BY_SUCCESS;
  payload: {groupData: IDailySaleGroup[]};
}

export interface ISetDataGroupByFile {
  type: Types.SET_DATA_GROUP_BY_FIELD;
  payload: {dataGroupBy: IDailySaleMonitoring[]};
}

export interface IHandleViewResults {
  type: Types.HANDLE_VIEW_RESULTS;
  payload: {
    type: MonitoringType;
    accountType?: 'MAIN' | 'SUB' | 'MAIN_AND_SUB';
  };
}

export type MonitoringActionType =
  | IFetchDailySaleSuccess
  | IGroupBySuccess
  | ISetDataGroupByFile
  | IHandleViewResults;
