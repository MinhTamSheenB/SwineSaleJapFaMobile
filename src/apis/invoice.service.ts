import {API_URL} from '~/configs/strings';
import {IoHelper} from '~/helpers';
import {post, deleteHttp, get, putHttp} from '~/helpers/HttpHelpers';
import {
  IDoHeaderCommon,
  IInvoiceFilterModel,
  IInvoiceHeaderDetail,
  IInvoiceItemDetail,
  IInvoiceModelCommon,
  IInvoicePublicDTO,
  IInvoicePublishModel,
} from './types.service';

const invoiceEndPoint = 'sale/invoice';

export const search = async (
  filter: IInvoiceFilterModel,
): Promise<IInvoiceHeaderDetail[]> => {
  return get<IInvoiceHeaderDetail[]>(`${invoiceEndPoint}/search`, filter);
};

// Post Do to invoice
export const postDoToInvoice = async (
  model: IDoHeaderCommon,
): Promise<string> => {
  return post<string>(`${invoiceEndPoint}/postdo2inv`, undefined, model);
};

/**
 * Phát hành hóa đơn điện tử
 * @param location
 * @param model
 */
export const publishInvoice = async (
  location = 'test',
  model: IInvoicePublishModel,
): Promise<IInvoicePublicDTO> => {
  return post<IInvoicePublicDTO>(
    `${invoiceEndPoint}/publish?location=${location}`,
    model,
  );
};

/**
 * Lấy chi tiết hóa đơn.
 * @param model
 */
export const getHeaderDetail = async (
  model: IInvoiceModelCommon,
): Promise<IInvoiceHeaderDetail> => {
  return get<IInvoiceHeaderDetail>(`${invoiceEndPoint}/header`, model);
};

export const getItemsInvoice = async (
  model: IInvoiceModelCommon,
): Promise<IInvoiceItemDetail[]> => {
  return get<IInvoiceItemDetail[]>(`${invoiceEndPoint}/items`, model);
};

export const deleteInvoice = async (
  model: IInvoiceModelCommon,
): Promise<boolean> => {
  return deleteHttp<boolean>(`${invoiceEndPoint}/delete`, model);
};

export const downloadInvoicePdf = async (
  invNo,
  username,
  location,
): Promise<string> => {
  const url = `${API_URL}${invoiceEndPoint}/${invNo}/download?username=${username}&location=${location}`;
  return IoHelper.getBase64FromServerFile(url);
};

export const cancelInvoice = async (
  model: IInvoiceModelCommon,
  reason: string,
): Promise<boolean> => {
  return putHttp<boolean>(`${invoiceEndPoint}/header/cancel`, undefined, {
    ...model,
    reasonCancel: reason,
  });
};
