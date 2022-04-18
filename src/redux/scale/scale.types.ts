import {IScaleDetailDTO} from '~/apis/types.service';

export interface IState {
  data: IScaleDetailDTO[];
  doNos: string[];
}

export enum Types {
  SCALE_SEARCH = 'SCALE_SEARCH',
  SCALE_SEARCH_SUCCESS = 'SCALE_SEARCH_SUCCESS',
}

export interface ISearch {
  type: Types.SCALE_SEARCH;
  payload: {
    fromDate: string;
    toDate: string;
    doCode?: string;
    scaleCode?: string;
  };
}

export interface ISearchSuccess {
  type: Types.SCALE_SEARCH_SUCCESS;
  payload: {data: IScaleDetailDTO[]; doNos: string[]};
}

export type ScaleActionType = ISearchSuccess;
