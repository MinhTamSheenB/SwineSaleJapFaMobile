import {get} from '~/helpers/HttpHelpers';
import {IResult} from '~/commons/types';
import {IAnimal} from './types.service';

export const testFetchApi = async (): Promise<IResult<IAnimal>> => {
  const urlFetch = 'checks/user';
  return get<IResult<IAnimal>>(urlFetch);
};

export const testFetchApi2 = async (): Promise<IResult<IAnimal>> => {
  const urlFetch = 'checks/user';
  return get<IResult<IAnimal>>(urlFetch);
};
