import {IScaleDetailDTO} from '~/apis/types.service';
import {Types, ISearch, ISearchSuccess} from './scale.types';

const ScaleActions = {
  search: (
    fromDate: string,
    toDate: string,
    doCode?: string,
    scaleCode?: string,
  ): ISearch => ({
    type: Types.SCALE_SEARCH,
    payload: {fromDate, toDate, doCode, scaleCode},
  }),
  searchSuccess: (
    data: IScaleDetailDTO[],
    doNos: string[],
  ): ISearchSuccess => ({
    type: Types.SCALE_SEARCH_SUCCESS,
    payload: {data, doNos},
  }),
};

export default ScaleActions;
