import {deleteHttp, get, post, putHttp} from '~/helpers/HttpHelpers';
import {IDeviceDTO, IDeviceModel} from './types.device';

const END_POINT = 'sale/ScaleDevice';

export const search = async (MacAddress?: string): Promise<IDeviceDTO[]> => {
  return get<IDeviceDTO[]>(`${END_POINT}/search`, {MacAddress});
};

export const createDevice = async (
  deviceModel: IDeviceModel,
): Promise<number> => {
  return post<number>(`${END_POINT}`, deviceModel);
};

export const updateDevice = async (
  deviceModel: IDeviceModel,
): Promise<boolean> => {
  return putHttp<boolean>(END_POINT, deviceModel);
};

export const deleteDevice = async (
  autoId: number,
  userId: string,
): Promise<boolean> => {
  return deleteHttp<boolean>(END_POINT, {autoId, userId});
};
