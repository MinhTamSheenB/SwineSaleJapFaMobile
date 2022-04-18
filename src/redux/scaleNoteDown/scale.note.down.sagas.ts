import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {
  createDetail,
  createHeader,
  deleteDetail,
  deleteHeader,
  postHeader,
  search,
  updateDetail,
  updateHeader,
} from '~/apis/scale.note.down.service';
import {search as searchScaleNote} from '~/apis/scale.service';
import {
  IScaleDOItem,
  IScaleNoteDownItemDTO,
} from '~/apis/types.scale.note.down';
import {
  DeliveryOrderStatus,
  IScaleDetailDTO,
  IScaleFilterModel,
  ScaleStatus,
} from '~/apis/types.service';
import {INavigateScreen, IUserParams} from '~/commons/types';
import {removeUnicode, scale} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '../global/global.actions';
import {getUserParams, onSagaNavigate, safe} from '../saga.helpers';
import ScaleNoteDownActions from './scale.note.down.actions';
import {
  ICreateUpdateDetail,
  ICreateUpdateHeader,
  IDeleteDetail,
  IDeleteHeader,
  IGetItemByScaleNo,
  IGetListScaleNote,
  IPostHeader,
  ISearch,
  Types,
} from './scale.note.down.types';

// WORKER
function* handleSearch({payload}: ISearch) {
  const {fromDate, toDate, status} = payload;
  const userPrams: IUserParams = yield select(getUserParams);
  const results: IScaleNoteDownItemDTO[] = yield call(
    search,
    userPrams.regionId!,
    userPrams.officeId!,
    userPrams.deptId!,
    fromDate,
    toDate,
    status,
    undefined,
    undefined,
    true,
  );
  yield put(ScaleNoteDownActions.searchSuccess(results));
}

function* handleGetListScaleNote({payload}: IGetListScaleNote) {
  const {fromDate, toDate} = payload;
  const userParms: IUserParams = yield select(getUserParams);
  const model: IScaleFilterModel = {
    fromDate,
    toDate,
    status: ScaleStatus.New,
    regionId: userParms.regionId,
    deptId: userParms.deptId,
  };

  const results: IScaleDetailDTO[] = yield call(searchScaleNote, model);
  const dsDo = results.filter((p) => p.DOSTATUS === DeliveryOrderStatus.New);
  const doS = [...new Set(dsDo.map((p) => p.DONO))];
  const data: IScaleDOItem[] = [];
  for (let i = 0; i < doS.length; i += 1) {
    const doNo = doS[i];
    const DETAILS: IScaleDetailDTO[] = results.filter((p) => p.DONO === doNo);
    const custName = DETAILS.length > 0 ? DETAILS[0].CUSTNAME : '';
    data.push({
      DONO: doNo,
      CUSTNAME: custName,
      DETAILS,
      label: doNo,
      value: doNo,
      keySearch: removeUnicode(`${doNo} ${custName}`),
    });
  }
  yield put(ScaleNoteDownActions.getScaleNoteListSuccess(data));
}

function* handleCreateUpdateHeader({payload}: ICreateUpdateHeader) {
  const {model, isNavigate} = payload;
  let replaceScaleNo = model.SCALEID;
  let isSuccess = false;
  if (replaceScaleNo) {
    isSuccess = yield call(updateHeader, model);
  } else {
    replaceScaleNo = yield call(createHeader, model);
    isSuccess = !!replaceScaleNo;
  }
  if (isSuccess) {
    model.SCALEID = replaceScaleNo;
    yield put(ScaleNoteDownActions.setLocalModel(model));
    if (isNavigate) {
      const nav: INavigateScreen = {
        screen: ScreenType.ScaleNoteDown.EDIT_DETAIL,
        isNavigate: true,
      };
      yield onSagaNavigate(nav);
    }
  }
}

function* handleCreateUpdateDetail({payload}: ICreateUpdateDetail) {
  const {model} = payload;
  let id = model.AUTOID ?? 0;
  let isResult = false;
  if (id > 0) isResult = yield call(updateDetail, model);
  else {
    id = yield call(createDetail, model);
    isResult = id > 0;
  }
  if (isResult) {
    yield put(
      GlobalActions.openErrorInfoModal('Cập nhật chỉnh sửa thành công.'),
    );
    yield put(ScaleNoteDownActions.getItemByScaleNo(model.SCALENO ?? '---'));
  }
}

function* handleGetItemByScaleNo({payload}: IGetItemByScaleNo) {
  const {scaleNo} = payload;
  const results: IScaleNoteDownItemDTO[] = yield call(
    search,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    scaleNo,
    true,
  );
  if (results.length > 0) {
    const firstItem: IScaleNoteDownItemDTO = results[0];
    yield put(ScaleNoteDownActions.setLocalModel({...firstItem}));
  }
}

function* handleDeleteDetail({payload}: IDeleteDetail) {
  const {detail} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const isResult = yield call(
    deleteDetail,
    detail.AUTOID!,
    detail.REGIONID!,
    detail.UNITID!,
    detail.OFFICEID!,
    detail.SCALEID!,
    userParams.userId,
    detail.DEPTID!,
  );
  if (isResult) {
    yield put(
      GlobalActions.openErrorInfoModal('Xoá thông tin điều chỉnh thành công.'),
    );
    yield put(ScaleNoteDownActions.getItemByScaleNo(detail.SCALENO ?? ''));
  }
}

function* handlePostHeader({payload}: IPostHeader) {
  const {model} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const isResult = yield call(
    postHeader,
    model.SCALEID ?? '000',
    userParams.userId!,
    userParams.regionId!,
    userParams.officeId!,
    userParams.unitId!,
    userParams.deptId!,
  );
  if (isResult) {
    yield put(
      GlobalActions.openErrorInfoModal('Chốt thông tin điều chỉnh thành công'),
    );
    yield put(ScaleNoteDownActions.getItemByScaleNo(model.SCALENO!));
  }
}

function* handleDeleteHeader({payload}: IDeleteHeader) {
  const {scaleId, unitId} = payload;
  const userParams: IUserParams = yield select(getUserParams);
  const isResult = yield call(
    deleteHeader,
    scaleId,
    userParams.userId!,
    userParams.regionId!,
    userParams.officeId!,
    userParams.unitId ?? unitId ?? '',
    userParams.deptId!,
  );
  if (isResult) {
    yield put(ScaleNoteDownActions.deleteHeaderSuccess(scaleId));
    yield put(
      GlobalActions.openErrorInfoModal('Xoá thông tin điều chỉnh thành công.'),
    );
    onSagaNavigate({screen: ScreenType.ScaleNoteDown.List, isNavigate: true});
  }
}

// WATCHER
function* watchSearch() {
  yield takeEvery(Types.SCALE_SEARCH, safe(handleSearch));
}

function* watchGetListScaleNote() {
  yield takeEvery(Types.GET_LIST_SCALE_NOTE, safe(handleGetListScaleNote));
}

function* watchCreateUpdateHeader() {
  yield takeEvery(Types.CREATE_UPDATE, safe(handleCreateUpdateHeader));
}

function* watchCreateUpdateDetail() {
  yield takeEvery(Types.CREATE_UPDATE_DETAIL, safe(handleCreateUpdateDetail));
}

function* watchGetItemByScaleNo() {
  yield takeEvery(Types.GET_ITEM_BY_SCALE_NO, safe(handleGetItemByScaleNo));
}

function* watchDeleteDetail() {
  yield takeEvery(Types.DELETE_DETAIL, safe(handleDeleteDetail));
}

function* watchPostHeader() {
  yield takeEvery(Types.POST_HEADER, safe(handlePostHeader));
}

function* watchDeleteHeader() {
  yield takeEvery(Types.DELETE_HEADER, safe(handleDeleteHeader));
}

export default function* weighingGoodsRootSaga() {
  yield all([
    fork(watchSearch),
    fork(watchGetListScaleNote),
    fork(watchCreateUpdateHeader),
    fork(watchCreateUpdateDetail),
    fork(watchGetItemByScaleNo),
    fork(watchDeleteDetail),
    fork(watchPostHeader),
    fork(watchDeleteHeader),
  ]);
}
