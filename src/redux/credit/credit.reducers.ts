import {IState, CreditActionType, Types} from './credit.types';

const initialState: IState = {
  data: [],
  selectedId: 11,
};

export default function CreditState(
  state = initialState,
  action: CreditActionType,
): IState {
  switch (action.type) {
    case Types.SEARCH_SUCCESS: {
      const {data} = action.payload;
      return {...state, data};
    }
    case Types.CREATE_UPDATE_SUCCESS: {
      return {...state};
    }
    case Types.DO_ANOTHER_ACTION_SUCCESS: {
      const {creditId, type, status} = action.payload;
      const {data, detail} = state;
      const index = data.findIndex((p) => p.CREDIT_ID === creditId);
      if (type === 'DELETE' && index > -1) {
        data.splice(index, 1);
      } else {
        data[index].STATUS = status;
        if (detail) {
          detail.STATUS = status;
        }
      }
      console.log({detail});
      return {...state, data, detail};
    }
    case Types.GET_DETAIL_SUCCESS: {
      const {dto} = action.payload;
      return {...state, detail: dto};
    }
    case Types.SET_SELECTED_CREDIT_ID: {
      const {id} = action.payload;
      return {...state, selectedId: id};
    }
    default: {
      return state;
    }
  }
}
