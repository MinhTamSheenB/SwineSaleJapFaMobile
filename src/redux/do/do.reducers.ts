import {
  IDoHeaderModel,
  IDoItem,
  IDoItemDetailModel,
} from '~/apis/types.service';
import {IDoState, DoActionType, Types} from './do.types';

const headerModel: IDoHeaderModel = {};
const itemModel: IDoItemDetailModel = {};

const initialState: IDoState = {
  data: [],
  headerModel,
  headerInfo: null,
  items: [],
  itemModel,
  receiverNames: [],
  trucks: [],
};

export default function DoReducer(
  state = initialState,
  action: DoActionType,
): IDoState {
  switch (action.type) {
    case Types.DO_FETCHING_LIST_DATA_SUCCESS: {
      return {...state, data: action.payload.reverse()};
    }
    case Types.DO_DELETE_HEADER_SUCCESS: {
      const doNo = action.payload;
      const data = [...state.data];
      const index = data.findIndex((p) => p.DONO === doNo);
      if (index > -1) data.splice(index, 1);
      return {...state, data};
    }
    case Types.DO_GET_HEADER_INFO_BY_DO_NO_SUCCESS: {
      return {...state, headerModel: action.payload, items: []};
    }
    case Types.DO_GET_PRODUCTS_BY_DONO_SUCCESS: {
      return {...state, items: action.payload};
    }
    case Types.DO_DELETE_DETAIL_SUCCESS: {
      const doDetailId = action.payload;
      const details = state.items;
      const index = details.findIndex((p) => p.DODTID === doDetailId);
      if (index > -1) details.splice(index, 1);
      return {...state, items: details};
    }
    case Types.DO_SET_LOCAL_ITEM_MODEL: {
      return {...state, itemModel: action.payload};
    }
    case Types.DO_GET_HEADER_INFO_BY_NO_SUCCESS: {
      const headerInfo = action.payload;
      return {...state, headerInfo};
    }
    case Types.DO_UPDATE_HEDER_INFO_MODEL: {
      return {...state, headerModel: action.payload, items: []};
    }
    case Types.DO_POST_DO_TO_INVOICE_SUCCESS: {
      const doNo = action.payload;
      const data: IDoItem[] = [...state.data];
      const index = data.findIndex((item) => item.DONO === doNo);
      if (index > -1) data.splice(index, 1);
      return {...state, data};
    }
    case Types.DO_GET_TRUCK_NO_SUCCESS: {
      const {data} = action.payload;
      return {...state, trucks: data};
    }
    case Types.DO_GET_RECEIVER_NAME_SUCCESS: {
      const {data} = action.payload;
      return {...state, receiverNames: data};
    }
    default:
      return state;
  }
}
