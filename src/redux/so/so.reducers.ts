import {
  ISoDetail,
  ISoDetailModel,
  ISoHeaderModel,
  OrderStatus,
} from '~/apis/types.service';
import {ISoState, SoActionType, Types} from './so.types';

const headerModel: ISoHeaderModel = {
  REGIONID: '',
  OFFICEID: 0,
  UNITID: '',
  SONO: '',
  LOCATIONID: '',
  CUSTID: '',
  DEPTID: 0,
  PIT_FLAG: false,
  P_USAGEDIS: 0,
  PIT: 0,
  S_USAGEDIS: 0,
  SUM_ACTAMOUNT: 0,
  TOTAL_MUST_COLLECT: 0,
};
const detailModel: ISoDetailModel = {SODTID: 0, UNITID: '', UPDATEDBY: ''};

const initialState: ISoState = {
  data: [],
  soModel: headerModel,
  detailModel,
  soDetail: null,
  objFilter: null,
  details: [],
  moneyDetail: 0,
  isSubmitSuccess: false,
  currentScreen: '',
  receiverNames: [],
  trucks: [],
  PIT: 0,
};

export default function SoReducer(
  state = initialState,
  action: SoActionType,
): ISoState {
  switch (action.type) {
    case Types.SO_CHANGE_IS_SUBMIT_STATUS: {
      const {isResult, screen} = action.payload;
      const strScreen = screen ?? state.currentScreen;
      return {...state, isSubmitSuccess: isResult, currentScreen: strScreen};
    }
    case Types.SO_FETCH_LIST_DATA_SUCCESS: {
      const {payload} = action;
      return {...state, data: payload.reverse()};
    }
    case Types.SO_UPDATE_CONDITION_FILTER: {
      const {payload} = action;
      return {...state, objFilter: payload};
    }
    case Types.SO_DELETE_HEADER_SUCCESS: {
      const {code} = action.payload;
      const tempData = [...state.data];
      const index: number = tempData.findIndex((p) => p.SONO === code);
      if (index > -1) tempData.splice(index, 1);
      return {...state, data: tempData};
    }
    case Types.SO_UPDATE_HEADER: {
      return {...state, soModel: action.payload!, isSubmitSuccess: false};
    }
    case Types.SO_CREATE_NEW_HEADER_SUCCESS: {
      const {header, screen} = action.payload;
      return {
        ...state,
        soModel: header,
        currentScreen: screen,
        isSubmitSuccess: true,
      };
    }
    case Types.SO_GET_DETAILS_BY_CODE_SUCCESS: {
      return {...state, details: action.payload};
    }
    case Types.SO_DELETE_DETAIL_SUCCESS: {
      const soDetailId = action.payload;
      const arr = [...state.details];
      const index = arr.findIndex((p) => p.SODTID === soDetailId);
      if (index > -1) arr.splice(index, 1);
      return {...state, details: arr};
    }
    case Types.SO_SELECTED_DETAIL_LOCAL: {
      return {...state, detailModel: action.payload, isSubmitSuccess: false};
    }
    case Types.SO_GET_INFORMATION_AND_DETAILS_BY_CODE_SUCCESS: {
      return {...state, soDetail: action.payload};
    }
    case Types.SO_POST_TO_DO_SUCCESS: {
      const soNo = action.payload;
      const index = state.data.findIndex((p) => p.SONO === soNo);
      const data: ISoDetail[] = [...state.data];
      const model: ISoHeaderModel = {
        ...state.soModel,
        STATUS: OrderStatus.Posted,
      };
      if (index > -1) data.splice(index, 1);
      return {...state, data, soModel: model};
    }
    case Types.SO_REVERT_DO_TO_SO_SUCCESS: {
      const soNo = action.payload;
      const soModel: ISoHeaderModel = {
        ...state.soModel,
        STATUS: OrderStatus.New,
      };
      const index = state.data.findIndex((p) => p.SONO === soNo);
      const data = [...state.data];
      if (index > -1) {
        data.splice(index, 1);
      }
      return {...state, soModel, data};
    }
    case Types.SO_GET_TRUCK_NO_SUCCESS: {
      const {data} = action.payload;
      return {...state, trucks: data};
    }
    case Types.SO_GET_RECEIVER_NAME_SUCCESS: {
      const {data} = action.payload;
      return {...state, receiverNames: data};
    }
    case Types.SO_DETAIL_RESET_MONEY_DETAIL: {
      const {} = action.payload;
      return {...state, moneyDetail: 0};
    }
    case Types.SO_DETAIL_CALCULATE_AMT_SUCCESS: {
      const {money} = action.payload;
      return {...state, moneyDetail: money};
    }
    case Types.SO_GET_HEADER_AND_UPDATE_LOCAL_MODEL_SUCCESS: {
      const {detail} = action.payload;
      const {soModel} = state;
      soModel.TOTALAMT = detail.TOTALAMT;
      soModel.TOTALAMTAFTERVAT = detail.TOTALAMTAFTERVAT;
      return {...state, soModel};
    }
    case Types.SO_GET_PIT_SUCCESS: {
      const {pit} = action.payload;
      return {...state, PIT: pit};
    }
    default:
      return state;
  }
}
