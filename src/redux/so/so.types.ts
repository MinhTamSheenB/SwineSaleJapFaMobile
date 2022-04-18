import {
  ISoDetail,
  ISoDetailDeleteModel,
  ISoDetailModel,
  ISoFilterModel,
  ISoHeaderCommon,
  ISoHeaderModel,
  ISuccess,
} from '~/apis/types.service';
import {DropdownItemType} from '~/commons/types';

export interface ISoState {
  data: ISoDetail[];
  objFilter: ISoFilterModel | null;
  soModel: ISoHeaderModel;
  soDetail: ISoDetail | null;
  details: ISoDetailModel[];
  detailModel: ISoDetailModel;
  moneyDetail: number;
  isSubmitSuccess: boolean;
  currentScreen: string;
  trucks: DropdownItemType[];
  receiverNames: DropdownItemType[];
  PIT: number;
}

// action types

export enum Types {
  SO_FETCHING_LIST_DATA = 'SO_FETCHING_LIST_DATA',
  SO_FETCH_LIST_DATA_SUCCESS = 'SO_FETCH_LIST_DATA_SUCCESS',
  SO_FETCH_LIST_DATA_FAIL = 'SO_FETCH_LIST_DATA_FAIL',

  SO_UPDATE_CONDITION_FILTER = 'SO_UPDATE_CONDITION_FILTER',

  SO_DELETING_HEADER = 'SO_DELETING_HEADER',
  SO_DELETE_HEADER_SUCCESS = 'SO_DELETE_HEADER_SUCCESS',

  SO_UPDATE_HEADER = 'SO_UPDATE_HEADER', // update lại sate trong reducer.
  SO_CREATE_NEW_HEADER = 'SO_CREATE_NEW_HEADER',
  SO_CREATE_NEW_HEADER_SUCCESS = 'SO_CREATE_NEW_HEADER_SUCCESS',

  SO_CHANGE_IS_SUBMIT_STATUS = 'SO_CHANGE_IS_SUBMIT_STATUS',

  SO_UPDATING_HEADER_INFORMATION = 'SO_UPDATING_HEADER_INFORMATION',
  SO_UPDATE_HEADER_INFORMATION_SUCCESS = 'SO_UPDATE_HEADER_INFORMATION_SUCCESS',
  SO_GET_DETAILS_BY_CODE = 'SO_GET_DETAILS_BY_CODE',
  SO_GET_DETAILS_BY_CODE_SUCCESS = 'SO_GET_DETAILS_BY_CODE_SUCCESS',
  SO_GET_INFORMATION_AND_DETAILS_BY_CODE = 'SO_GET_INFORMATION_AND_DETAILS_BY_CODE',
  SO_GET_INFORMATION_AND_DETAILS_BY_CODE_SUCCESS = 'SO_GET_INFORMATION_AND_DETAILS_BY_CODE_SUCCESS',

  // Detail
  SO_SELECTED_DETAIL_LOCAL = 'SO_SELECTED_DETAIL_LOCAL',
  SO_DELETE_DETAIL = 'SO_DELETE_DETAIL',
  SO_DELETE_DETAIL_SUCCESS = 'SO_DELETE_DETAIL_SUCCESS',
  SO_CREATE_DETAIL = 'SO_CREATE_DETAIL',
  SO_CREATE_DETAIL_SUCCESS = 'SO_CREATE_DETAIL_SUCCESS',

  // POST TO DO
  SO_POST_TO_DO = 'SO_POST_TO_DO',
  SO_POST_TO_DO_SUCCESS = 'SO_POST_TO_DO_SUCCESS',
  SO_REVERT_DO_TO_SO = 'SO_REVERT_DO_TO_SO',
  SO_REVERT_DO_TO_SO_SUCCESS = 'SO_REVERT_DO_TO_SO_SUCCESS',

  SO_GET_TRUCK_NO = 'SO_GET_TRUCK_NO',
  SO_GET_TRUCK_NO_SUCCESS = 'SO_GET_TRUCK_NO_SUCCESS',

  SO_GET_RECEIVER_NAME = 'SO_GET_RECEIVER_NAME',
  SO_GET_RECEIVER_NAME_SUCCESS = 'SO_GET_RECEIVER_NAME_SUCCESS',

  SO_DETAIL_CALCULATE_AMT = 'SO_DETAIL_CALCULATE_AMT',
  SO_DETAIL_CALCULATE_AMT_SUCCESS = 'SO_DETAIL_CALCULATE_AMT_SUCCESS',
  SO_DETAIL_RESET_MONEY_DETAIL = 'SO_DETAIL_RESET_MONEY_DETAIL',

  SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL = 'SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL',
  SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL_SUCCESS = 'SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL_SUCCESS',

  SO_GET_PIT = 'SO_GET_PIT_VALUE',
  SO_GET_PIT_SUCCESS = 'SO_GET_PIT_VALUE_SUCCESS',
}

// interface return
export interface IFetchingRequest {
  type: Types.SO_FETCHING_LIST_DATA;
  payload: ISoFilterModel;
}

export interface IFetchDataSuccess {
  type: Types.SO_FETCH_LIST_DATA_SUCCESS;
  payload: ISoDetail[];
}

export interface IUpdateConditionFilter {
  type: Types.SO_UPDATE_CONDITION_FILTER;
  payload: ISoFilterModel;
}

export interface IDeletingSoHeader {
  type: Types.SO_DELETING_HEADER;
  payload: ISoHeaderCommon;
}

export interface IDeleteSoHeaderSuccess {
  type: Types.SO_DELETE_HEADER_SUCCESS;
  payload: ISuccess;
}

export interface ISoUpdateHeader {
  type: Types.SO_UPDATE_HEADER;
  payload: ISoHeaderModel | null;
}

export interface ISoCreateNewHeader {
  type: Types.SO_CREATE_NEW_HEADER;
  payload: {model: ISoHeaderModel; screen: string};
}

export interface ISoCreateNewHeaderSuccess {
  type: Types.SO_CREATE_NEW_HEADER_SUCCESS;
  payload: {header: ISoHeaderModel; screen: string};
}

export interface ISoChangeSubmitStatus {
  type: Types.SO_CHANGE_IS_SUBMIT_STATUS;
  payload: {isResult: boolean; screen: string | undefined};
}

export interface ISoGetDetailsByCode {
  type: Types.SO_GET_DETAILS_BY_CODE;
  payload: string;
}

export interface ISoGetDetailsByCodeSuccess {
  type: Types.SO_GET_DETAILS_BY_CODE_SUCCESS;
  payload: ISoDetailModel[];
}

export interface ISoDeleteDetail {
  type: Types.SO_DELETE_DETAIL;
  payload: ISoDetailDeleteModel;
}

export interface ISoDeleteDetailSuccess {
  type: Types.SO_DELETE_DETAIL_SUCCESS;
  payload: number;
}

export interface ICreateSoDetail {
  type: Types.SO_CREATE_DETAIL;
  payload: ISoDetailModel;
}

export interface ISelectedDetailModelLocal {
  type: Types.SO_SELECTED_DETAIL_LOCAL;
  payload: ISoDetailModel;
}

export interface IGetSoInformationAndDetails {
  type: Types.SO_GET_INFORMATION_AND_DETAILS_BY_CODE;
  payload: string;
}

export interface IGetSoInformationAndDetailsSuccess {
  type: Types.SO_GET_INFORMATION_AND_DETAILS_BY_CODE_SUCCESS;
  payload: ISoDetail;
}

export interface ISoPostToDo {
  type: Types.SO_POST_TO_DO;
  payload: ISoHeaderCommon;
}

export interface ISoPostToDoSuccess {
  type: Types.SO_POST_TO_DO_SUCCESS;
  payload: string;
}

export interface IRevertSo {
  type: Types.SO_REVERT_DO_TO_SO;
  payload: ISoHeaderCommon;
}

export interface IRevertSoSuccess {
  type: Types.SO_REVERT_DO_TO_SO_SUCCESS;
  payload: string;
}

export interface IGetTruckNo {
  type: Types.SO_GET_TRUCK_NO;
  payload: {custId?: string};
}

export interface IGetTruckNoSuccess {
  type: Types.SO_GET_TRUCK_NO_SUCCESS;
  payload: {data: DropdownItemType[]};
}

export interface IGetReceiverName {
  type: Types.SO_GET_RECEIVER_NAME;
  payload: {custId?: string};
}

export interface IGetReceiverNameSuccess {
  type: Types.SO_GET_RECEIVER_NAME_SUCCESS;
  payload: {data: DropdownItemType[]};
}

export interface ISoCalculateDetail {
  type: Types.SO_DETAIL_CALCULATE_AMT;
  payload: {detail: ISoDetailModel};
}

export interface ISoCalculateDetailSuccess {
  type: Types.SO_DETAIL_CALCULATE_AMT_SUCCESS;
  payload: {money: number};
}

export interface ISoResetMoneyDetail {
  type: Types.SO_DETAIL_RESET_MONEY_DETAIL;
  payload: {};
}

export interface IGetHeaderInfoAndUpdateLocalModel {
  type: Types.SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL;
  payload: {soCode: string};
}

export interface IGetHeaderInfoAndUpdateLocalModelSuccess {
  type: Types.SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL_SUCCESS;
  payload: {detail: ISoDetail};
}

export interface IGetPIT {
  type: Types.SO_GET_PIT;
}

export interface IGetPITSuccess {
  type: Types.SO_GET_PIT_SUCCESS;
  payload: {pit: number};
}

export type SoActionType =
  | IFetchingRequest
  | IFetchDataSuccess
  | IUpdateConditionFilter
  | IDeleteSoHeaderSuccess
  | ISoUpdateHeader
  | ISoCreateNewHeaderSuccess
  | ISoChangeSubmitStatus
  | ISoGetDetailsByCodeSuccess
  | ISoDeleteDetailSuccess
  | ISelectedDetailModelLocal
  | IGetSoInformationAndDetailsSuccess
  | ISoPostToDoSuccess
  | IRevertSoSuccess
  | IGetTruckNoSuccess
  | IGetReceiverNameSuccess
  | ISoCalculateDetailSuccess
  | ISoResetMoneyDetail
  | IGetHeaderInfoAndUpdateLocalModelSuccess
  | IGetPITSuccess;
