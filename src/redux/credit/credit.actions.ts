import {CreditStatus, ICreditDTO, ICreditModel} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {
  ICreate,
  ICreateSuccess,
  Types,
  ISearching,
  ISearchSuccess,
  IDoAnotherAction,
  CreditType,
  IDoAnotherActionSuccess,
  IGetDetailById,
  IGetDetailSuccess,
  ISetSelectedCreditId,
} from './credit.types';

const CreditActions = {
  search: (
    fromDate?: string,
    toDate?: string,
    custId?: string,
    status?: CreditStatus,
    creditCode?: string,
  ): ISearching => ({
    type: Types.SEARCH,
    payload: {fromDate, toDate, custId, status, creditCode},
  }),
  searchSuccess: (data: ICreditDTO[]): ISearchSuccess => ({
    type: Types.SEARCH_SUCCESS,
    payload: {data},
  }),
  create: (model: ICreditModel, nav?: INavigateScreen): ICreate => ({
    type: Types.CREATE_UPDATE,
    payload: {model, nav},
  }),
  createSuccess: (): ICreateSuccess => ({
    type: Types.CREATE_UPDATE_SUCCESS,
    payload: {},
  }),
  doAnotherAction: (
    creditId: number,
    type: CreditType,
    message: string,
    isAlert = false,
    nav?: INavigateScreen,
  ): IDoAnotherAction => ({
    type: Types.DO_ANOTHER_ACTION,
    payload: {creditId, type, message, isAlert, nav},
  }),
  doAnotherActionSuccess: (
    type: CreditType,
    creditId: number,
    status: CreditStatus,
  ): IDoAnotherActionSuccess => ({
    type: Types.DO_ANOTHER_ACTION_SUCCESS,
    payload: {type, creditId, status},
  }),
  getDetail: (id: number): IGetDetailById => ({
    type: Types.GET_DETAIL_BY_CREDIT_ID,
    payload: {id},
  }),
  getDetailSuccess: (dto: ICreditDTO): IGetDetailSuccess => ({
    type: Types.GET_DETAIL_SUCCESS,
    payload: {dto},
  }),
  setSelectedId: (creditId: number): ISetSelectedCreditId => ({
    type: Types.SET_SELECTED_CREDIT_ID,
    payload: {id: creditId},
  }),
};

export default CreditActions;
