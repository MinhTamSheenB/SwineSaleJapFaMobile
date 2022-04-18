import {deleteHttp, get, post, putHttp} from '~/helpers/HttpHelpers';
import {
  ICreditDTO,
  ICreditFilterModel,
  ICreditModel,
  ICreditModelCommon,
} from './types.service';

const END_POINT = 'sale/credit';

export const search = async (
  filter: ICreditFilterModel,
): Promise<ICreditDTO[]> => {
  return get<ICreditDTO[]>(`${END_POINT}/search`, filter);
};

export const deleteCredit = async (
  model: ICreditModelCommon,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${END_POINT}/header/delete`, model);
};

export const sendCredit = async (
  model: ICreditModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/send`, undefined, model);
};

export const unSendCredit = async (
  model: ICreditModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/unsend`, undefined, model);
};

export const approveCredit = async (
  model: ICreditModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/approved`, undefined, model);
};

export const cancelCredit = async (
  model: ICreditModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/cancel`, undefined, model);
};

export const createCredit = async (model: ICreditModel): Promise<number> => {
  return post<number>(`${END_POINT}/header/add`, model);
};

export const updateCredit = async (model: ICreditModel): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/edit`, model);
};

export const rejectCredit = async (
  model: ICreditModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/reject`, undefined, model);
};
