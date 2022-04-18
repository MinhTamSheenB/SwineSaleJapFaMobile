import {WeighingGoodsStatus} from '~/apis/types.service';
import {IState, Types, WeighingGoodsActionType} from './weighing.goods.types';

const initialState: IState = {
  doData: [],
  wGoodModel: undefined,
  items: [],
  products: [],
  wGoodsData: [],
  isPostItemSuccess: false,
  // offline
  productsOffline: [],
  detailsOffline: [],
  dosOffline: [],
  wGoodsDataOffline: [],
  wOfflineModel: undefined,
};

export default function WeighingGoodsReducer(
  state = initialState,
  action: WeighingGoodsActionType,
): IState {
  switch (action.type) {
    case Types.WEIGHING_GOODS_CHANGE_STATUS_POST_ITEM_FALSE_OR_SUCCESS: {
      const {isStatus} = action.payload;
      return {...state, isPostItemSuccess: isStatus};
    }
    case Types.WEIGHING_GOOD_GET_LIST_DO_SUCCESS: {
      const {doData} = action.payload;
      return {...state, doData: doData.reverse()};
    }
    case Types.WEIGHING_GOOD_UPDATE_HEADER_LOCAL_MODEL: {
      const {headerModel, isClear} = action.payload;
      if (!isClear) {
        return {...state, wGoodModel: headerModel};
      }
      return {...state, wGoodModel: headerModel, products: [], items: []};
    }
    case Types.WEIGHING_GOOD_POST_HEADER_MODEL_SUCCESS: {
      const {model} = action.payload;
      return {...state, wGoodModel: model};
    }
    case Types.WEIGHING_GOOD_GET_LIST_ITEMS_BY_ID_SUCCESS: {
      const {items} = action.payload;
      return {...state, items, isPostItemSuccess: true};
    }
    case Types.WEIGHING_GOOD_DELETE_ITEM_SUCCESS: {
      const {id} = action.payload;
      const {items} = state;
      const index = items.findIndex((p) => p.SNITEMID === id);
      if (index > -1) items.splice(index, 1);
      return {...state, items};
    }
    case Types.WEIGHING_GOODS_UPLOAD_OR_RETURN_SUCCESS: {
      const {status, tempWeightID} = action.payload;
      const {wGoodModel, wGoodsData} = state;
      if (!wGoodModel) {
        return {...state};
      }
      wGoodModel.STATUS =
        wGoodModel.STATUS === WeighingGoodsStatus.UnUpload
          ? WeighingGoodsStatus.Uploaded
          : WeighingGoodsStatus.UnUpload;
      const index = wGoodsData.findIndex((p) => p.SCALEID === tempWeightID);
      if (index > -1) {
        wGoodsData[index].STATUS = status;
      }

      return {...state, wGoodModel, wGoodsData};
    }
    case Types.WEIGHING_GOODS_DELETE_HEADER_SUCCESS: {
      const {scaleId} = action.payload;
      const {wGoodsData} = state;
      const index = wGoodsData.findIndex((p) => p.SCALEID === scaleId);
      if (index > -1) {
        wGoodsData.splice(index, 1);
      }
      return {...state, wGoodModel: undefined, items: [], wGoodsData};
    }
    case Types.WEIGHING_GOODS_GET_PRODUCT_LIST_BY_DO_SUCCESS: {
      const {products} = action.payload;
      return {...state, products};
    }
    case Types.WEIGHING_GOOD_GET_LIST_SUCCESS: {
      const {wGoodsData} = action.payload;
      return {...state, wGoodsData};
    }
    // OFFLINE
    case Types.WEIGHING_GOODS_GET_PRODUCTS_OFFLINE_SUCCESS: {
      const {products} = action.payload;
      return {...state, productsOffline: products};
    }
    case Types.WEIGHING_GOOD_GET_DOS_OFFLINE_BY_UNIT_SUCCESS: {
      const {dos} = action.payload;
      return {...state, dosOffline: dos};
    }
    case Types.WEIGHING_GOOD_UPDATE_HEADER_MODEL_OFFLINE: {
      const {model, isClearDetails} = action.payload;
      const scaleId = model.SCALEID ?? 0;
      const {dosOffline} = state;
      const detailsOffline = isClearDetails ? [] : state.detailsOffline;
      if (scaleId > 0) {
        // Xoá DO trong danh sách các DO chưa có phiếu cân tạm.
        const indexDo = dosOffline.findIndex(
          (p) => p.DONO && p.DONO === model.DONO,
        );
        if (indexDo > -1) dosOffline.splice(indexDo, 1);
      }
      return {...state, wOfflineModel: model, detailsOffline, dosOffline};
    }
    case Types.WEIGHING_GOODS_GET_DETAILS_OFFLINE_SUCCESS: {
      const {details} = action.payload;
      return {...state, detailsOffline: details};
    }
    case Types.WEIGHING_GOODS_DELETE_DETAIL_OFFLINE_SUCCESS: {
      const {detailId} = action.payload;
      const {detailsOffline} = state;
      const index = detailsOffline.findIndex((p) => p.ID === detailId);
      if (index > -1) detailsOffline.splice(index, 1);
      return {...state, detailsOffline};
    }
    case Types.WEIGHING_GOODS_ADD_DETAIL_OFFLINE_SUCCESS: {
      const {item} = action.payload;
      const {detailsOffline} = state;
      const index = detailsOffline.findIndex((p) => p.ID === item.ID);
      if (index > -1) detailsOffline[index] = item;
      else detailsOffline.push(item);
      return {...state, detailsOffline, isPostItemSuccess: true};
    }
    case Types.WEIGHING_GOODS_LOCK_UNLOCK_OFFLINE_SUCCESS: {
      const {scaleId} = action.payload;
      const {wOfflineModel, wGoodsDataOffline} = state;
      if (wOfflineModel) {
        wOfflineModel.IS_LOCKED =
          wOfflineModel.IS_LOCKED && wOfflineModel.IS_LOCKED > 0 ? 0 : 1;
      }
      const index = wGoodsDataOffline.findIndex((p) => p.SCALEID === scaleId);
      if (index > -1) {
        const lockValue = wGoodsDataOffline[index].IS_LOCKED ?? 0;
        wGoodsDataOffline[index].IS_LOCKED = lockValue > 0 ? 0 : 1;
      }
      return {...state, wOfflineModel, wGoodsDataOffline};
    }
    case Types.WEIGHING_GOODS_DELETE_HEADER_OFFLINE_SUCCESS: {
      const {scaleId} = action.payload;
      const {wGoodsDataOffline} = state;
      const index = wGoodsDataOffline.findIndex((p) => p.SCALEID === scaleId);
      if (index > -1) {
        wGoodsDataOffline.splice(index, 1);
      }
      return {...state, wGoodsDataOffline};
    }
    case Types.WEIGHING_GOODS_GET_SALE_TEMP_DATA_OFFLINE_SUCCESS: {
      const {dataS} = action.payload;
      return {...state, wGoodsDataOffline: dataS};
    }
    case Types.WEIGHING_GOODS_UPLOAD_SCALE_TEMP_OFFLINE_SUCCESS: {
      const {scaleLocalId} = action.payload;
      const {wGoodsDataOffline} = state;
      const index = wGoodsDataOffline.findIndex(
        (p) => p.SCALEID === scaleLocalId,
      );
      if (index > -1) wGoodsDataOffline.splice(index, 1);
      return {...state, wGoodsDataOffline};
    }
    default: {
      return state;
    }
  }
}
