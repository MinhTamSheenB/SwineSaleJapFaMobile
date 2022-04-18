import {IInvoiceHeaderDetail, InvoiceStatus} from '~/apis/types.service';
import {IInvoiceState, InvoiceActionType, Types} from './invoice.types';

const initialState: IInvoiceState = {
  currentInvNo: '',
  data: [],
  items: [],
  headerDetail: null,
};

export default function invoiceReducer(
  state = initialState,
  action: InvoiceActionType,
): IInvoiceState {
  switch (action.type) {
    case Types.INVOICE_GET_INVOICE_DETAIL_BY_CODE_SUCCESS: {
      const {items, detail} = action.payload;
      return {...state, headerDetail: detail, items};
    }
    case Types.INVOICE_SEARCH_DATA_SUCCESS: {
      const {details} = action.payload;
      return {...state, data: details.reverse()};
    }
    case Types.INVOICE_SET_CURRENT_INV_CODE: {
      const {invNo} = action.payload;
      return {...state, currentInvNo: invNo};
    }
    case Types.INVOICE_PUBLISH_BY_INVNO_SUCCESS: {
      const {invNo} = action.payload;
      const headerDetail: IInvoiceHeaderDetail = {...state.headerDetail};
      headerDetail.STATUS = InvoiceStatus.Published;
      return {...state, headerDetail};
    }
    case Types.INVOICE_DELETE_BY_CODE_SUCCESS: {
      const {invNo} = action.payload;
      const index = state.data.findIndex((p) => p.INVNO === invNo);
      if (index < 0) return state;
      const data: IInvoiceHeaderDetail[] = [...state.data];
      data.splice(index, 1);
      return {...state, data};
    }
    case Types.INVOICE_CANCEL_SUCCESS: {
      const {invNo} = action.payload;
      const data = [...state.data];
      const index = data.findIndex(
        (p) => p.INVNO === invNo && p.STATUS !== InvoiceStatus.Canceled,
      );
      if (index > -1) data.splice(index, 1);
      return {...state, data};
    }
    default: {
      return state;
    }
  }
}
