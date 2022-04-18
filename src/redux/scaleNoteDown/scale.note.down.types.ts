import {
  IScaleDOItem,
  IScaleNoteDownDetailDTO,
  IScaleNoteDownDetailModel,
  IScaleNoteDownItemDTO,
  IScaleNoteDownModel,
} from '~/apis/types.scale.note.down';

export interface IState {
  data: IScaleNoteDownItemDTO[];
  scaleNoteData: IScaleDOItem[];
  model?: IScaleNoteDownModel;
}

export enum Types {
  SCALE_SEARCH = 'SCALE_NOTE_DOWN_SEARCH',
  SCALE_SEARCH_SUCCESS = 'SCALE_NOTE_DOWN_SEARCH_SUCCESS',

  GET_LIST_SCALE_NOTE = 'SCALE_NOTE_DOWN/GET_LIST_SCALE_NOTE',
  GET_LIST_SCALE_NOTE_SUCCESS = 'SCALE_NOTE_DOWN/GET_LIST_SCALE_NOTE_SUCCESS',

  SET_CURRENT_MODEL = 'SCALE_NOTE_DOWN/SET_CURRENT_MODEL',
  CREATE_UPDATE = 'SCALE_NOTE_DOWN/CREATE_UPDATE',
  CREATE_UPDATE_SUCCESS = 'SCALE_NOTE_DOWN/CREATE_UPDATE_SUCCESS',

  CREATE_UPDATE_DETAIL = 'SCALE_NOTE_DOWN/CREATE_UPDATE_DETAIL',

  GET_ITEM_BY_SCALE_NO = 'SCALE_NOTE_DOWN/GET_ITEM_BY_SCALE_NO',
  DELETE_DETAIL = 'SCALE_NOTE_DOWN/DELETE_DETAIL',
  DELETE_HEADER = 'SCALE_NOTE_DOWN/DELETE_HEADER',
  DELETE_HEADER_SUCCESS = 'SCALE_NOTE_DOWN/DELETE_HEADER_SUCCESS',
  POST_HEADER = 'SCALE_NOTE_DOWN/POST_HEADER',
}

export interface ISearch {
  type: Types.SCALE_SEARCH;
  payload: {
    fromDate: string;
    toDate: string;
    status?: number;
    doCode?: string;
    scaleCode?: string;
  };
}

export interface ISearchSuccess {
  type: Types.SCALE_SEARCH_SUCCESS;
  payload: {data: IScaleNoteDownItemDTO[]};
}

export interface IGetListScaleNote {
  type: Types.GET_LIST_SCALE_NOTE;
  payload: {fromDate: string; toDate: string};
}

export interface IGetListScaleNoteSuccess {
  type: Types.GET_LIST_SCALE_NOTE_SUCCESS;
  payload: {data: IScaleDOItem[]};
}

export interface ISetCurrentModel {
  type: Types.SET_CURRENT_MODEL;
  payload: {model: IScaleNoteDownModel};
}

export interface ICreateUpdateHeader {
  type: Types.CREATE_UPDATE;
  payload: {model: IScaleNoteDownModel; isNavigate: boolean};
}

export interface ICreateUpdateHeaderSuccess {
  type: Types.CREATE_UPDATE_SUCCESS;
  payload: {model: IScaleNoteDownModel};
}

export interface ICreateUpdateDetail {
  type: Types.CREATE_UPDATE_DETAIL;
  payload: {model: IScaleNoteDownDetailModel};
}

export interface IGetItemByScaleNo {
  type: Types.GET_ITEM_BY_SCALE_NO;
  payload: {scaleNo: string};
}

export interface IDeleteDetail {
  type: Types.DELETE_DETAIL;
  payload: {detail: IScaleNoteDownDetailDTO};
}

export interface IDeleteHeader {
  type: Types.DELETE_HEADER;
  payload: {scaleId: string; unitId?: string};
}

export interface IDeleteHeaderSuccess {
  type: Types.DELETE_HEADER_SUCCESS;
  payload: {scaleId: string};
}

export interface IPostHeader {
  type: Types.POST_HEADER;
  payload: {model: IScaleNoteDownModel};
}

export type ScaleNoteDownActionType =
  | ISearchSuccess
  | IGetListScaleNoteSuccess
  | ISetCurrentModel
  | IDeleteHeaderSuccess;
