import {
  DiscountStatus,
  IDiscountItemDTO,
  IDiscountModel,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {
  ICreateOrUpdate,
  ICreateOrUpdateSuccess,
  IDeleteHeader,
  IDeleteHeaderSuccess,
  IPost,
  IPostSuccess,
  IReturnPost,
  IReturnPostSuccess,
  ISearch,
  ISearchSuccess,
  ISetModel,
  IUpdateLocalModel,
  Types,
} from './discount.types';

const DiscountActions = {
  search: (
    fromDate?: string,
    toDate?: string,
    custId?: string,
    status?: DiscountStatus,
    disCode?: string,
  ): ISearch => ({
    type: Types.SEARCH,
    payload: {custId, fromDate, toDate, status, disCode},
  }),
  searchSuccess: (data: IDiscountItemDTO[]): ISearchSuccess => ({
    type: Types.SEARCH_SUCCESS,
    payload: {data},
  }),
  deleteHeader: (
    discountId: number,
    discountNo: string,
    isAlert = false,
    nav?: INavigateScreen,
  ): IDeleteHeader => ({
    type: Types.DELETE_HEADER,
    payload: {discountId, discountNo, isAlert, nav},
  }),
  deleteSuccess: (discountId: number): IDeleteHeaderSuccess => ({
    type: Types.DELETE_HEADER_SUCCESS,
    payload: {discountId},
  }),
  post: (
    discountId: number,
    discountNo: string,
    isAlert = false,
    nav?: INavigateScreen,
  ): IPost => ({
    type: Types.POST,
    payload: {discountId, discountNo, isAlert, nav},
  }),
  postSuccess: (discountId: number): IPostSuccess => ({
    type: Types.POST_SUCCESS,
    payload: {discountId},
  }),
  returnPost: (
    discountId: number,
    discountNo: string,
    isAlert = false,
    nav?: INavigateScreen,
  ): IReturnPost => ({
    type: Types.RETURN_POST,
    payload: {discountId, discountNo, isAlert, nav},
  }),
  returnPostSuccess: (discountId: number): IReturnPostSuccess => ({
    type: Types.RETURN_POST_SUCCESS,
    payload: {discountId},
  }),
  createOrUpdate: (
    model: IDiscountModel,
    isAlert = false,
  ): ICreateOrUpdate => ({
    type: Types.CREATE_OR_UPDATE,
    payload: {model, isAlert},
  }),
  createOrUpdateSuccess: (dto: IDiscountItemDTO): ICreateOrUpdateSuccess => ({
    type: Types.CREATE_OR_UPDATE_SUCCESS,
    payload: {dto},
  }),
  setModel: (
    discountId: number,
    dto: IDiscountItemDTO | undefined,
    nav?: INavigateScreen,
  ): ISetModel => ({
    type: Types.SET_MODEL,
    payload: {discountId, dto, nav},
  }),
  updateLocalModel: (model: IDiscountModel): IUpdateLocalModel => ({
    type: Types.UPDATE_LOCAL_MODEL,
    payload: {model},
  }),
};

export default DiscountActions;
