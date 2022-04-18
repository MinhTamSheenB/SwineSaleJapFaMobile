import {
  IScaleDOItem,
  IScaleNoteDownDetailDTO,
  IScaleNoteDownDetailModel,
  IScaleNoteDownItemDTO,
  IScaleNoteDownModel,
} from '~/apis/types.scale.note.down';
import {
  Types,
  ISearch,
  ISearchSuccess,
  IGetListScaleNote,
  IGetListScaleNoteSuccess,
  ISetCurrentModel,
  ICreateUpdateHeader,
  ICreateUpdateDetail,
  IGetItemByScaleNo,
  IDeleteDetail,
  IDeleteHeader,
  IPostHeader,
  IDeleteHeaderSuccess,
} from './scale.note.down.types';

const ScaleNoteDownActions = {
  search: (
    fromDate: string,
    toDate: string,
    scaleCode?: string,
    status?: number,
  ): ISearch => ({
    type: Types.SCALE_SEARCH,
    payload: {fromDate, toDate, scaleCode, status},
  }),
  searchSuccess: (data: IScaleNoteDownItemDTO[]): ISearchSuccess => ({
    type: Types.SCALE_SEARCH_SUCCESS,
    payload: {data},
  }),
  getScaleNoteList: (fromDate: string, toDate: string): IGetListScaleNote => ({
    type: Types.GET_LIST_SCALE_NOTE,
    payload: {fromDate, toDate},
  }),
  getScaleNoteListSuccess: (
    data: IScaleDOItem[],
  ): IGetListScaleNoteSuccess => ({
    type: Types.GET_LIST_SCALE_NOTE_SUCCESS,
    payload: {data},
  }),
  setLocalModel: (model: IScaleNoteDownModel): ISetCurrentModel => ({
    type: Types.SET_CURRENT_MODEL,
    payload: {model},
  }),
  createUpdateHeader: (
    model: IScaleNoteDownModel,
    isNavigate: boolean,
  ): ICreateUpdateHeader => ({
    type: Types.CREATE_UPDATE,
    payload: {model, isNavigate},
  }),
  createUpdateDetail: (
    model: IScaleNoteDownDetailModel,
  ): ICreateUpdateDetail => ({
    type: Types.CREATE_UPDATE_DETAIL,
    payload: {model},
  }),
  getItemByScaleNo: (scaleNo: string): IGetItemByScaleNo => ({
    type: Types.GET_ITEM_BY_SCALE_NO,
    payload: {scaleNo},
  }),
  deleteDetail: (detail: IScaleNoteDownDetailDTO): IDeleteDetail => ({
    type: Types.DELETE_DETAIL,
    payload: {detail},
  }),
  deleteHeader: (scaleId: string, unitId?: string): IDeleteHeader => ({
    type: Types.DELETE_HEADER,
    payload: {scaleId, unitId},
  }),
  deleteHeaderSuccess: (scaleId: string): IDeleteHeaderSuccess => ({
    type: Types.DELETE_HEADER_SUCCESS,
    payload: {scaleId},
  }),
  postHeader: (model: IScaleNoteDownModel): IPostHeader => ({
    type: Types.POST_HEADER,
    payload: {model},
  }),
};

export default ScaleNoteDownActions;
