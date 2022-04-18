import {CnDnStatus, ICndnDtoItem, ICndnHeaderModel} from '~/apis/types.service';
import {getCurrentDateToString} from '~/helpers/DatetimeHelpers';
import {IState, CndnActionsType, Types} from './cndn.types';

const getDataNameByStatus = (status: CnDnStatus): string =>
  `data${CnDnStatus[status]}`;

const initialModel: ICndnHeaderModel = {
  STATUS: CnDnStatus.New,
  CNDNNO: '',
  CNDNTYPE: 0,
  CNDN4ACCTYPE: 0,
  CREATEDDATE: getCurrentDateToString(),
  CNDNDATE: getCurrentDateToString(),
};

const initialState: IState = {
  dataApproved: [],
  dataInvoiceIssued: [],
  dataNew: [],
  dataRejected: [],
  info: undefined,
  model: initialModel,
  items: [],
};

export default function CndnReducers(
  state = initialState,
  action: CndnActionsType,
): IState {
  switch (action.type) {
    case Types.SEARCH_SUCCESS: {
      const {data, status} = action.payload;
      if (!status) return {...state};
      const dataName = getDataNameByStatus(status);
      return {...state, [dataName]: data};
    }
    case Types.DELETE_HEADER_SUCCESS: {
      const {cndnNo, status} = action.payload;
      const dataName = getDataNameByStatus(status);
      const data: ICndnDtoItem[] = state[dataName];
      const index = data.findIndex((p) => p.CNDNNO === cndnNo);
      if (index > -1) data.splice(index, 1);
      return {...state, [dataName]: data};
    }
    case Types.GET_CNDN_INFO_BY_NO_SUCCESS: {
      const {dto} = action.payload;
      return {...state, info: dto};
    }
    case Types.APPROVE_SUCCESS:
    case Types.REJECT_SUCCESS:
    case Types.INVOICE_SUCCESS: {
      const {item, cndnNo, oldState} = action.payload;
      let desStatus: CnDnStatus = CnDnStatus.Approved;

      if (action.type === Types.REJECT_SUCCESS) {
        desStatus = CnDnStatus.Rejected;
      } else if (action.type === Types.INVOICE_SUCCESS) {
        desStatus = CnDnStatus.InvoiceIssued;
      }

      const dataDesName: string = getDataNameByStatus(desStatus);
      const dataName = getDataNameByStatus(oldState);

      const newCndnItem: ICndnDtoItem = {...item, STATUS: desStatus};

      const dataSource: ICndnDtoItem[] = state[dataName];
      const dataDestination: ICndnDtoItem[] = state[dataDesName];
      dataDestination.unshift(newCndnItem);
      const index = dataSource.findIndex((p) => p.CNDNNO === cndnNo);
      if (index > -1) dataSource.splice(index, 1);
      return {...state, [dataName]: dataSource, [dataDesName]: dataDestination};
    }
    case Types.UPDATE_LOCAL_HEADER_MODEL: {
      const {model} = action.payload;
      return {...state, model};
    }
    case Types.CLEAR_LOCAL_HEADER_MODEL: {
      return {...state, model: initialModel};
    }
    case Types.GET_CNDN_ITEMS_BY_NO_SUCCESS: {
      const {items} = action.payload;
      return {...state, items};
    }
    default: {
      return {...state};
    }
  }
}
