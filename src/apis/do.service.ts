import {deleteHttp, get, post, putHttp} from '~/helpers/HttpHelpers';
import {
  IDoDetailDelete,
  IDoFilterModel,
  IDoHeaderCommon,
  IDoHeaderModel,
  IDoItem,
  IDoItemDetailModel,
  IGoodsDTO,
  IGoodsFilterModel,
} from './types.service';

const endPoint = 'sale/delivery';

// search
export const getListDo = async (model: IDoFilterModel): Promise<IDoItem[]> => {
  return get<IDoItem[]>(`${endPoint}/search`, model);
};

// Xóa Do
export const deleteDo = (header: IDoHeaderCommon): Promise<boolean> => {
  return deleteHttp<boolean>(`${endPoint}/header`, header);
};

export const createDo = (model: IDoHeaderModel): Promise<string> => {
  return post<string>(`${endPoint}/header`, model);
};

export const updateDo = (model: IDoHeaderModel): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/header`, model);
};

export const getItemsDo = (
  regionId: string,
  deptId: number,
  officeId: number,
  Dono: string,
): Promise<IDoItemDetailModel[]> => {
  return get<IDoItemDetailModel[]>(`${endPoint}/items`, {
    regionId,
    deptId,
    officeId,
    Dono,
  });
};

export const deleteDetailById = (model: IDoDetailDelete): Promise<boolean> => {
  return deleteHttp<boolean>(`${endPoint}/detail`, model);
};

export const createDoItem = (model: IDoItemDetailModel): Promise<number> => {
  return post<number>(`${endPoint}/detail`, model);
};

export const updateDoItem = (
  itemModel: IDoItemDetailModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/detail`, itemModel);
};

export const postDoToSale = (header: IDoHeaderCommon): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/post`, undefined, header);
};

export const returnDoFromSale = (header: IDoHeaderCommon): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/returnpost`, undefined, header);
};

export const getTruckNo = async (filter: IDoFilterModel): Promise<string[]> => {
  return get<string[]>(`${endPoint}/GetTruckNo`, filter);
};

export const getReceiverName = async (
  filter: IDoFilterModel,
): Promise<string[]> => {
  return get<string[]>(`${endPoint}/GetReceiverName`, filter);
};

export const getProductList = async (
  filter: IGoodsFilterModel,
): Promise<IGoodsDTO[]> => {
  return get<IGoodsDTO[]>(`${endPoint}/listproduct`, filter);
};
