import {deleteHttp, get, post, putHttp} from '~/helpers/HttpHelpers';
import {
  ICndnDetailModel,
  ICndnDtoItem,
  ICndnFilterModel,
  ICndnHeaderModel,
  ICndnModelCommon,
} from './types.service';

const END_POINT = 'sale/cndn';

export const search = async (
  model: ICndnFilterModel,
): Promise<ICndnDtoItem[]> => {
  return get<ICndnDtoItem[]>(`${END_POINT}/search`, model);
};

export const deleteHeader = async (
  model: ICndnModelCommon,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${END_POINT}/header`, model);
};

export const createHeader = async (
  model: ICndnHeaderModel,
): Promise<string> => {
  return post<string>(`${END_POINT}/header`, model);
};

export const updateHeader = async (
  model: ICndnHeaderModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header`, model);
};

export const approveCndn = async (
  model: ICndnModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/approved`, undefined, model);
};

export const postToInvoice = async (
  model: ICndnModelCommon,
): Promise<string> => {
  return post<string>(`${END_POINT}/postcndn2inv`, undefined, model);
};

export const rejectCndn = async (
  model: ICndnModelCommon,
  reasonReject: string,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/reject`, undefined, {
    ...model,
    reasonReject,
  });
};

export const deleteDetail = async (
  model: ICndnModelCommon,
  cndndtID: number,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${END_POINT}/detail`, {...model, cndndtID});
};

export const createDetail = async (
  model: ICndnDetailModel,
): Promise<number> => {
  return post<number>(`${END_POINT}/detail`, model);
};

export const updateDetail = async (
  model: ICndnDetailModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/detail`, model);
};
