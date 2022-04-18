import {
  DiscountStatus,
  IDiscountItemDTO,
  IDiscountModel,
} from '~/apis/types.service';
import {IState, DiscountActionType, Types} from './discount.types';

const initialState: IState = {
  data: [],
  model: null,
};

export default function DiscountReducers(
  state = initialState,
  action: DiscountActionType,
): IState {
  switch (action.type) {
    case Types.SEARCH_SUCCESS: {
      const {data} = action.payload;
      return {...state, data};
    }
    case Types.UPDATE_LOCAL_MODEL: {
      const {model} = action.payload;
      return {...state, model};
    }
    case Types.DELETE_HEADER_SUCCESS: {
      const {discountId} = action.payload;
      const data: IDiscountItemDTO[] = [...state.data];
      const index = data.findIndex((p) => p.DISCOUNTID === discountId);
      if (index > -1) data.splice(index, 1);
      return {...state, data};
    }
    case Types.POST_SUCCESS: {
      const {discountId} = action.payload;
      const model: IDiscountModel = {...state.model};
      if (model) {
        model.STATUS = DiscountStatus.Approved;
      }
      return {...state, model};
    }
    case Types.RETURN_POST_SUCCESS: {
      const {discountId} = action.payload;
      const model: IDiscountModel = {...state.model};
      if (model) {
        model.STATUS = DiscountStatus.New;
      }
      return {...state, model};
    }
    case Types.CREATE_OR_UPDATE_SUCCESS: {
      const {dto} = action.payload;
      const data: IDiscountItemDTO[] = [...state.data];
      const index: number = data.findIndex(
        (p) => p.DISCOUNTID === dto.DISCOUNTID,
      );
      if (index > -1) data[index] = dto;
      else data.unshift(dto);
      return {...state, data};
    }
    default: {
      return {...state};
    }
  }
}
