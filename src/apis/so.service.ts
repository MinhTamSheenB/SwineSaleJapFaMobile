/* eslint-disable import/prefer-default-export */
/* eslint-disable prettier/prettier */
import { number } from 'yup';
import {post, get, deleteHttp, putHttp} from '~/helpers/HttpHelpers';
import {ISoFilterModel, ISoDetail, ISoHeaderCommon, ISoHeaderModel, ISoDetailDeleteModel, ISoDetailModel} from './types.service';

const endPoint = 'sale/order';

export const getListSo = async (
  filter: ISoFilterModel,
): Promise<ISoDetail[]> => {
  const url = `${endPoint}/search`;
  return get<ISoDetail[]>(url, filter);
};

export const deleteSoHeader = async (so: ISoHeaderCommon): Promise<void> => {
  const url = `${endPoint}/header`;
  return deleteHttp<void>(url, so);
}

// Thêm mới So header
export const createSo = async(header: ISoHeaderModel): Promise<string> => {
  return post<string>(`${endPoint}/header`, header);
}

export const updateSo = async(header: ISoHeaderModel): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/header`, header, undefined);
}

/**
 * Xóa So Detail theo so
 * @param soDetail 
 */
export const deleteSoDetail = async(soDetail: ISoDetailDeleteModel): Promise<boolean> => {
  return deleteHttp<boolean>(`${endPoint}/detail`, soDetail);
}

/**
 * Chuyển So sang Do
 * @param soInfo 
 */
export const postToDo = async(soInfo: ISoHeaderCommon): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/post`,undefined,soInfo);
}

// revert from do to so
export const revertSo = async(soInfo: ISoHeaderCommon): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/returnpost`,undefined,soInfo);
}

export const createSoDetail = async(detail: ISoDetailModel): Promise<string> => {
  return post<string>(`${endPoint}/detail`, detail);
}

export const updateSoDetail = async (detail: ISoDetailModel): Promise<boolean> => {
  return putHttp<boolean>(`${endPoint}/detail`, detail);
}

export const getTruckNo = async(filter: ISoFilterModel): Promise<string[]>=> {
  return get<string[]>(`${endPoint}/GetTruckNo`, filter);
}

export const getReceiverName = async(filter: ISoFilterModel): Promise<string[]> => {
  return get<string[]>(`${endPoint}/GetReceiverName`, filter);
}

export const calculatorDetail = async(detail: ISoDetailModel): Promise<number> => {
  return putHttp<number>(`${endPoint}/detail/CaculateDetailAmt_v2`, detail);
}

export const getPITValue = async(regionId: string): Promise<number> => {
  return get<number>(`sale/Pit`, {regionId});
}
