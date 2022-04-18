import {ScaleActionType, IState, Types} from './scale.types';

const initialState: IState = {
  data: [],
  doNos: [],
};

export default function ScaleReducer(
  state = initialState,
  action: ScaleActionType,
): IState {
  switch (action.type) {
    case Types.SCALE_SEARCH_SUCCESS: {
      const {data, doNos} = action.payload;
      return {...state, data, doNos};
    }
    default:
      return {...state};
  }
}
