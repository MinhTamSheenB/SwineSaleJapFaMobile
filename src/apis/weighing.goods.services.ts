import {post, get, deleteHttp, putHttp} from '~/helpers/HttpHelpers';
import {
  IWeighingGoodsDetailDTO,
  IWeighingGoodsItemDTO,
  IWeighingGoodsItemModel,
  IWeighingGoodsModel,
} from './types.service';

const URL_WEIGHT = 'sales/weight/';

export const getListOfWeights = async (
  fromDate?: string,
  toDate?: string,
  userId?: string,
  tmpWeiStatus?: number,
  regionId?: string,
  unitId?: string,
  locationId?: string,
  tempWeiId?: number,
): Promise<IWeighingGoodsItemDTO[]> => {
  return post<IWeighingGoodsItemDTO[]>(`${URL_WEIGHT}temp/search`, undefined, {
    fromDate,
    toDate,
    userId,
    tmpWeiStatus,
    regionId,
    unitId,
    locationId,
    tempWeiId,
  });
};

export const saveWeight = async (
  model: IWeighingGoodsModel,
): Promise<number> => {
  return post<number>(`${URL_WEIGHT}temp`, model);
};

export const updateWeight = async (
  model: IWeighingGoodsModel,
): Promise<boolean> => {
  return putHttp<boolean>(`${URL_WEIGHT}temp`, model);
};

export const deleteHeader = async (
  id: number,
  userID: string,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${URL_WEIGHT}temp`, {id, userID});
};

export const getHeaderDetail = async (
  id: number,
  regionId: string,
): Promise<IWeighingGoodsItemDTO> => {
  return get<IWeighingGoodsItemDTO>(`${URL_WEIGHT}temp`, {id, regionId});
};

export const uploadWeight = async (
  userID: string,
  tempWeightID: number,
  regionId?: string,
): Promise<void> => {
  return post<void>(`${URL_WEIGHT}temp/uploadonline`, undefined, {
    userID,
    tempWeightID,
    regionId,
  });
};

export const returnWeight = async (
  userID: string,
  tempWeightID: number,
  regionId?: string,
): Promise<void> => {
  return post<void>(`${URL_WEIGHT}temp/returnupload`, undefined, {
    userID,
    tempWeightID,
    regionId,
  });
};

// item
export const saveWeightItem = async (
  itemModel: IWeighingGoodsItemModel,
  isOverWeight: boolean,
): Promise<number> => {
  // eslint-disable-next-line prettier/prettier
  return post<number>(
    `${URL_WEIGHT}detail/temp?evenIfExcessCO=${isOverWeight}`,
    itemModel,
  );
};

export const updateWeightItem = async (
  itemModel: IWeighingGoodsItemModel,
  isOverWeight: boolean,
): Promise<boolean> => {
  // eslint-disable-next-line prettier/prettier
  return putHttp<boolean>(`${URL_WEIGHT}detail/temp?evenIfExcessCO=${isOverWeight}`, itemModel);
};

export const deleteWeightItem = async (
  id: number,
  userID: string,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${URL_WEIGHT}detail/temp`, {id, userID});
};

export const getWeightItemDetailById = async (
  id: number,
  regionId: string,
): Promise<IWeighingGoodsDetailDTO> => {
  return get<IWeighingGoodsDetailDTO>(`${URL_WEIGHT}detail/temp`, {
    id,
    regionId,
  });
};

export const createScaleNoteOffline = async (
  userId: string,
  header: IWeighingGoodsItemDTO,
  details: IWeighingGoodsDetailDTO[],
): Promise<number> => {
  return post<number>(`${URL_WEIGHT}temp/uploadoffline`, {
    USERID: userId,
    TEMPWEIHEADER: header,
    TEMPWEIDETAIL: details,
    EVENIFEXCESSCO: header.EVENIFEXCESSCO,
  });
};
