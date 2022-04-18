import {get} from '~/helpers/HttpHelpers';
import {IScaleDetailDTO, IScaleFilterModel} from './types.service';

const END_POINT = 'sale/ScaleNote';

// eslint-disable-next-line import/prefer-default-export
export const search = async (
  filterModel: IScaleFilterModel,
): Promise<IScaleDetailDTO[]> => {
  return get<IScaleDetailDTO[]>(`${END_POINT}/search`, filterModel);
};
