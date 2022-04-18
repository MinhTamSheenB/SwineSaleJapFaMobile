import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {
  postDoToInvoice,
  search,
  deleteInvoice,
  downloadInvoicePdf,
  publishInvoice,
  cancelInvoice,
} from '~/apis/invoice.service';
import {
  IDoHeaderCommon,
  IInvoiceFilterModel,
  IInvoiceHeaderDetail,
  IInvoiceModelCommon,
  IInvoicePublicDTO,
  IInvoicePublishModel,
} from '~/apis/types.service';
import {IUserParams} from '~/commons/types';
import {AppStrings} from '~/configs';
import {IoHelper} from '~/helpers';
import {getCurrentDateToString} from '~/helpers/DatetimeHelpers';
import {isIos, removeUnicode} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import DoActions from '../do/do.actions';
import GlobalActions from '../global/global.actions';
import {getUserParams, safe, onSagaNavigate} from '../saga.helpers';
import InvoiceActions from './invoice.actions';
import {
  ICancelInvoice,
  IDeleteInvoice,
  IGetHeaderDetailByNo,
  IPostDoToInvoice,
  IPublishInvoiceByNo,
  ISearch,
  IViewInvoicePdf,
  Types,
} from './invoice.types';

// WORKER
function* handlePostDoToInvoice({payload}: IPostDoToInvoice) {
  const {doNo, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const doModel: IDoHeaderCommon = {
    ...userParams,
    doNo,
  };
  const invNo: string = yield call(postDoToInvoice, doModel);
  if (invNo) {
    yield put(DoActions.postDoToInvoiceSuccess(doNo));
    yield put(InvoiceActions.setInvoiceCode(invNo));
    onSagaNavigate(nav);
  }
}

function* handleGetInvoiceByCode({payload}: IGetHeaderDetailByNo) {
  const {inNo} = payload;
  const filterModel: IInvoiceFilterModel = {loadInvDetail: true, invCode: inNo};
  const results: IInvoiceHeaderDetail[] = yield call(search, filterModel);
  const item: IInvoiceHeaderDetail | undefined = results.find(
    (p) => p.INVNO === inNo,
  );
  if (item) {
    yield put(InvoiceActions.getDetailSuccess(item, item.INVOICEDETAILS));
  }
}

function* handleSearchData({payload}: ISearch) {
  const {model} = payload;
  const response: IInvoiceHeaderDetail[] = yield call(search, model);
  const data: IInvoiceHeaderDetail[] = response.map((p) => ({
    ...p,
    keySearch: `${p.INVNO} ${removeUnicode(p.CUSTNAME)} ${
      p.CUSTNO
    }`.toLowerCase(),
  }));
  if (response) yield put(InvoiceActions.searchSuccess(data));
}

function* handleDeleteInvoice({payload}: IDeleteInvoice) {
  const {invNo, isAlert, nav} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IInvoiceModelCommon = {
    ...userParams,
    invNo,
  };
  const isResult: boolean = yield call(deleteInvoice, model);
  if (isResult) {
    yield put(InvoiceActions.deleteInvoiceSuccess(invNo));
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(AppStrings.Invoice.DeleteMessage),
      );
    }
    onSagaNavigate(nav);
  }
}

function* handleViewInvoicePdf({payload}: IViewInvoicePdf) {
  const {invNo} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const invoiceDataBase64 = yield call(
    downloadInvoicePdf,
    invNo,
    userParams.userId,
    'test',
  );

  if (invoiceDataBase64) {
    yield put(
      GlobalActions.setDataForPdfViewerScreen(
        invoiceDataBase64,
        'Thông tin hoá đơn',
      ),
    );
    yield delay(500);
    onSagaNavigate({screen: ScreenType.Main.PdfViewer, isNavigate: true});
  }

  // if (isIos()) {
  //   onSagaNavigate({
  //     screen: ScreenType.Main.WebView,
  //     isNavigate: true,
  //     param: {uri: filePath, title: 'vien test'},
  //   });
  // } else {
  //   IoHelper.openFdfFile(filePath);
  // }
}

function* handlePublishInvoice({payload}: IPublishInvoiceByNo) {
  const {invNo, isAlert} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IInvoicePublishModel = {
    username: userParams.userId,
    // eslint-disable-next-line @typescript-eslint/camelcase
    inv_date: getCurrentDateToString(),
    invs: [invNo],
  };
  const dto: IInvoicePublicDTO = yield call(publishInvoice, 'test', model);
  if (dto) {
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(AppStrings.Invoice.PublishSuccess),
      );
    }
    yield put(InvoiceActions.publishInvoiceSuccess(invNo));
  }
}

function* handleCancelInvoice({payload}: ICancelInvoice) {
  const {reason, isAlert, nav, invNo} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const model: IInvoiceModelCommon = {...userParams, invNo};
  const isResult: boolean = yield call(cancelInvoice, model, reason);
  if (isResult) {
    if (isAlert) {
      yield put(
        GlobalActions.openErrorInfoModal(AppStrings.Invoice.CancelSuccess),
      );
    }
    yield put(InvoiceActions.cancelInvoiceSuccess(invNo));
    onSagaNavigate(nav);
  }
}

// WATCHER
function* watchPostDoToInvoice() {
  yield takeLatest(
    Types.INVOICE_POST_DO_TO_INVOICE,
    safe(handlePostDoToInvoice),
  );
}

function* watchGetInvoiceDetailByCode() {
  yield takeEvery(
    Types.INVOICE_GET_INVOICE_DETAIL_BY_CODE,
    safe(handleGetInvoiceByCode),
  );
}

function* watchSearch() {
  yield takeEvery(Types.INVOICE_SEARCH_DATA, safe(handleSearchData));
}

function* watchDeleteInvoice() {
  yield takeLatest(Types.INVOICE_DELETE_BY_CODE, safe(handleDeleteInvoice));
}

function* watchViewInvoicePdf() {
  yield takeEvery(Types.INVOICE_VIEW_PDF_BY_INVNO, safe(handleViewInvoicePdf));
}

function* watchPublishInvoice() {
  yield takeEvery(Types.INVOICE_PUBLISH_BY_INVNO, safe(handlePublishInvoice));
}

function* watchCancelInvoice() {
  yield takeEvery(Types.INVOICE_CANCEL, safe(handleCancelInvoice));
}

export default function* invoiceRootSaga() {
  yield all([
    fork(watchPostDoToInvoice),
    fork(watchGetInvoiceDetailByCode),
    fork(watchSearch),
    fork(watchDeleteInvoice),
    fork(watchViewInvoicePdf),
    fork(watchPublishInvoice),
    fork(watchCancelInvoice),
  ]);
}
