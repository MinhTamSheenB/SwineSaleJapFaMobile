import {
  ISoFilterModel,
  ISoDetail,
  ISoHeaderCommon,
  ISuccess,
  ISoHeaderModel,
  ISoDetailModel,
  ISoDetailDeleteModel,
} from '~/apis/types.service';
import {DropdownItemType} from '~/commons/types';
import {
  IFetchingRequest,
  IFetchDataSuccess,
  Types,
  IUpdateConditionFilter,
  IDeletingSoHeader,
  IDeleteSoHeaderSuccess,
  ISoUpdateHeader,
  ISoCreateNewHeader,
  ISoCreateNewHeaderSuccess,
  ISoChangeSubmitStatus,
  ISoGetDetailsByCode,
  ISoGetDetailsByCodeSuccess,
  ISoDeleteDetail,
  ISoDeleteDetailSuccess,
  ICreateSoDetail,
  ISelectedDetailModelLocal,
  IGetSoInformationAndDetails,
  IGetSoInformationAndDetailsSuccess,
  ISoPostToDo,
  ISoPostToDoSuccess,
  IRevertSo,
  IRevertSoSuccess,
  IGetTruckNoSuccess,
  IGetTruckNo,
  IGetReceiverNameSuccess,
  IGetReceiverName,
  ISoCalculateDetail,
  ISoCalculateDetailSuccess,
  ISoResetMoneyDetail,
  IGetHeaderInfoAndUpdateLocalModel,
  IGetHeaderInfoAndUpdateLocalModelSuccess,
  IGetPIT,
  IGetPITSuccess,
} from './so.types';

const SoAction = {
  search: (objFilter: ISoFilterModel): IFetchingRequest => {
    return {type: Types.SO_FETCHING_LIST_DATA, payload: objFilter};
  },
  searchSuccess: (data: ISoDetail[]): IFetchDataSuccess => {
    return {
      type: Types.SO_FETCH_LIST_DATA_SUCCESS,
      payload: data,
    };
  },
  updateCondition: (filter: ISoFilterModel): IUpdateConditionFilter => {
    return {
      type: Types.SO_UPDATE_CONDITION_FILTER,
      payload: filter,
    };
  },
  deleteHeader: (so: ISoHeaderCommon): IDeletingSoHeader => {
    return {
      type: Types.SO_DELETING_HEADER,
      payload: so,
    };
  },
  deleteHeaderSuccess: (obj: ISuccess): IDeleteSoHeaderSuccess => {
    return {
      type: Types.SO_DELETE_HEADER_SUCCESS,
      payload: obj,
    };
  },
  createSoHeader: (
    header: ISoHeaderModel,
    screen: string,
  ): ISoCreateNewHeader => {
    return {type: Types.SO_CREATE_NEW_HEADER, payload: {model: header, screen}};
  },
  createSoHeaderSuccess: (
    header: ISoHeaderModel,
    screen: string,
  ): ISoCreateNewHeaderSuccess => {
    return {
      type: Types.SO_CREATE_NEW_HEADER_SUCCESS,
      payload: {header, screen},
    };
  },
  updateHeader: (model: ISoHeaderModel | null): ISoUpdateHeader => {
    return {type: Types.SO_UPDATE_HEADER, payload: model};
  },
  changeSubmitStatus: (
    isValue: boolean,
    screen: string | undefined,
  ): ISoChangeSubmitStatus => {
    return {
      type: Types.SO_CHANGE_IS_SUBMIT_STATUS,
      payload: {isResult: isValue, screen},
    };
  },
  getDetailsByCode: (soCode: string): ISoGetDetailsByCode => {
    return {type: Types.SO_GET_DETAILS_BY_CODE, payload: soCode};
  },
  getDetailsByCodeSuccess: (
    details: ISoDetailModel[],
  ): ISoGetDetailsByCodeSuccess => {
    return {type: Types.SO_GET_DETAILS_BY_CODE_SUCCESS, payload: details};
  },
  deleteSoDetail: (soDetail: ISoDetailDeleteModel): ISoDeleteDetail => {
    return {type: Types.SO_DELETE_DETAIL, payload: soDetail};
  },
  deleteSoDetailSuccess: (soDetailId: number): ISoDeleteDetailSuccess => {
    return {type: Types.SO_DELETE_DETAIL_SUCCESS, payload: soDetailId};
  },
  createSoDetail: (detail: ISoDetailModel): ICreateSoDetail => {
    return {
      type: Types.SO_CREATE_DETAIL,
      payload: detail,
    };
  },
  selectedSoDetail: (detail: ISoDetailModel): ISelectedDetailModelLocal => {
    return {
      type: Types.SO_SELECTED_DETAIL_LOCAL,
      payload: detail,
    };
  },
  getSoInformationAndDetails: (code: string): IGetSoInformationAndDetails => {
    return {
      type: Types.SO_GET_INFORMATION_AND_DETAILS_BY_CODE,
      payload: code,
    };
  },
  getSoInformationAndDetailsSuccess: (
    soDetail: ISoDetail,
  ): IGetSoInformationAndDetailsSuccess => {
    return {
      type: Types.SO_GET_INFORMATION_AND_DETAILS_BY_CODE_SUCCESS,
      payload: soDetail,
    };
  },
  postToDo: (soHeader: ISoHeaderCommon): ISoPostToDo => {
    return {
      type: Types.SO_POST_TO_DO,
      payload: soHeader,
    };
  },
  postToDoSuccess: (soNo: string): ISoPostToDoSuccess => {
    return {
      type: Types.SO_POST_TO_DO_SUCCESS,
      payload: soNo,
    };
  },
  revertToSo: (soCommon: ISoHeaderCommon): IRevertSo => {
    return {type: Types.SO_REVERT_DO_TO_SO, payload: soCommon};
  },
  revertToSoSuccess: (soNo: string): IRevertSoSuccess => {
    return {type: Types.SO_REVERT_DO_TO_SO_SUCCESS, payload: soNo};
  },
  getTruckNo: (custId: string): IGetTruckNo => ({
    type: Types.SO_GET_TRUCK_NO,
    payload: {custId},
  }),
  getTruckNoSuccess: (data: DropdownItemType[]): IGetTruckNoSuccess => ({
    type: Types.SO_GET_TRUCK_NO_SUCCESS,
    payload: {data},
  }),
  getReceiverName: (custId: string): IGetReceiverName => ({
    type: Types.SO_GET_RECEIVER_NAME,
    payload: {custId},
  }),
  getReceiverNameSuccess: (
    data: DropdownItemType[],
  ): IGetReceiverNameSuccess => ({
    type: Types.SO_GET_RECEIVER_NAME_SUCCESS,
    payload: {data},
  }),
  calculateDetail: (detail: ISoDetailModel): ISoCalculateDetail => ({
    type: Types.SO_DETAIL_CALCULATE_AMT,
    payload: {detail},
  }),
  calculateDetailSuccess: (money: number): ISoCalculateDetailSuccess => ({
    type: Types.SO_DETAIL_CALCULATE_AMT_SUCCESS,
    payload: {money},
  }),
  resetMoneyDetail: (): ISoResetMoneyDetail => ({
    type: Types.SO_DETAIL_RESET_MONEY_DETAIL,
    payload: {},
  }),
  getHeaderInfoAndUpdateLocalModel: (
    soCode: string,
  ): IGetHeaderInfoAndUpdateLocalModel => ({
    type: Types.SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL,
    payload: {soCode},
  }),
  getHeaderInfoAndUpdateLocalModelSuccess: (
    detail: ISoDetail,
  ): IGetHeaderInfoAndUpdateLocalModelSuccess => ({
    type: Types.SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL_SUCCESS,
    payload: {detail},
  }),
  getPit: (): IGetPIT => ({
    type: Types.SO_GET_PIT,
  }),
  getPitSuccess: (pit: number): IGetPITSuccess => ({
    type: Types.SO_GET_PIT_SUCCESS,
    payload: {pit},
  }),
};

export default SoAction;
