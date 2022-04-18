import {deleteHttp, get, post, putHttp} from '~/helpers/HttpHelpers';
import {
  IScaleNoteDownDetailModel,
  IScaleNoteDownItemDTO,
  IScaleNoteDownModel,
} from './types.scale.note.down';

const END_POINT = 'sale/ScaleNoteDown';

export const search = async (
  regionId?: string,
  officeId?: number,
  deptId?: number,
  fromDate?: string,
  toDate?: string,
  status?: number,
  doCode?: string,
  scaleCode?: string,
  loadDetail?: boolean,
): Promise<IScaleNoteDownItemDTO[]> => {
  return get<IScaleNoteDownItemDTO[]>(`${END_POINT}/search`, {
    fromDate,
    toDate,
    status,
    regionId,
    officeId,
    deptId,
    doCode,
    scaleCode,
    loadDetail,
  });
};

export const createHeader = async (
  model: IScaleNoteDownModel,
): Promise<string> => {
  return post<string>(`${END_POINT}/header`, model);
};

export const updateHeader = async (
  model: IScaleNoteDownModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header`, model);
};

export const createDetail = (
  model: IScaleNoteDownDetailModel,
): Promise<number> => {
  return post<number>(`${END_POINT}/detail`, model);
};

export const updateDetail = (
  model: IScaleNoteDownDetailModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/detail`, model);
};

export const deleteDetail = async (
  autoId: number,
  regionId: string,
  unitId: string,
  officeId: number,
  scaleId: string,
  userId: string,
  deptId: number,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${END_POINT}/Detail`, {
    autoId,
    regionId,
    unitId,
    officeId,
    scaleId,
    userId,
    deptId,
  });
};

export const postHeader = async (
  scaleDownId: string,
  userId: string,
  regionId?: string,
  officeId?: number,
  unitId?: string,
  deptId?: number,
): Promise<boolean> => {
  return post<boolean>(`${END_POINT}/header/post`, undefined, {
    scaleDownId,
    userId,
    regionId,
    officeId,
    unitId,
    deptId,
  });
};

export const deleteHeader = async (
  scaleId: string,
  userId: string,
  regionId: string,
  officeId: number,
  unitId: string,
  deptId: number,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${END_POINT}/header`, {
    scaleId,
    userId,
    regionId,
    officeId,
    unitId,
    deptId,
  });
};
