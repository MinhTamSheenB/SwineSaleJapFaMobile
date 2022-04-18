import {IState, ScaleNoteDownActionType, Types} from './scale.note.down.types';

const initialState: IState = {
  data: [],
  scaleNoteData: [],
  model: undefined,
};

export default function ScaleReducer(
  state = initialState,
  action: ScaleNoteDownActionType,
): IState {
  switch (action.type) {
    case Types.SCALE_SEARCH_SUCCESS: {
      const {data} = action.payload;
      return {...state, data};
    }
    case Types.GET_LIST_SCALE_NOTE_SUCCESS: {
      const {data} = action.payload;
      return {...state, scaleNoteData: data};
    }
    case Types.SET_CURRENT_MODEL: {
      const {model} = action.payload;
      return {...state, model};
    }
    case Types.DELETE_HEADER_SUCCESS: {
      const {scaleId} = action.payload;
      const {data} = state;
      const index = data.findIndex((p) => p.SCALEID === scaleId);
      if (index > -1) data.splice(index, 1);
      return {...state, data};
    }
    default:
      return {...state};
  }
}
