import {deleteHttp, get, post, putHttp} from '~/helpers/HttpHelpers';
import {
  IDiscountFilterModel,
  IDiscountItemDTO,
  IDiscountModel,
  IDiscountModelCommon,
} from './types.service';

const END_POINT = 'sale/Discount';

export const search = async (
  model: IDiscountFilterModel,
): Promise<IDiscountItemDTO[]> => {
  return get<IDiscountItemDTO[]>(`${END_POINT}/search`, model);
};

export const postDiscount = async (
  model: IDiscountModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/post`, undefined, model);
};

export const rePostDiscount = async (
  model: IDiscountModelCommon,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header/returnpost`, undefined, model);
};

export const deleteDiscount = async (
  model: IDiscountModelCommon,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${END_POINT}/header`, model);
};

export const createDiscount = async (
  model: IDiscountModel,
): Promise<number> => {
  return post<number>(`${END_POINT}/header`, model);
};

export const updateDiscount = async (
  model: IDiscountModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${END_POINT}/header`, model);
};
