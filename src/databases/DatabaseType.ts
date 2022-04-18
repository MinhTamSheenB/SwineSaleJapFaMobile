import {
  IDoItem,
  IDoLocalItem,
  IProductStockDTO,
  IWeighingGoodsDetailDTO,
  IWeighingGoodsItemDTO,
  IWeighingGoodsItemModel,
  IWeighingGoodsModel,
} from '~/apis/types.service';

export interface IVersion {
  version: number;
  statement: string;
}

export interface IStarDevice {
  macAddress: string;
  moduleName?: string;
  portName: string;
  isDefault: boolean;
  remindName?: string;
  type: 'RONGTA' | 'STAR';
}

export interface IProductStockDatabase {
  getProductsStock: () => Promise<IProductStockDTO[]>;
  storeProductsStock: (products: IProductStockDTO[]) => Promise<void>;
  getProductById: (id: string) => Promise<IProductStockDTO | undefined>;
  deleteProductById: (id: string) => Promise<boolean>;
}

export interface IScaleTempDatabase {
  checkScaleIsLocked: (
    scaleId: number,
    isThrowErrorIfLocked: boolean,
  ) => Promise<boolean>;
  storeScaleHeader: (
    header: IWeighingGoodsModel,
    userId: string,
  ) => Promise<IWeighingGoodsModel | undefined>;
  addDetailIntoHeader: (
    headerId: number,
    detail: IWeighingGoodsItemModel,
  ) => Promise<IWeighingGoodsDetailDTO | undefined>;
  uploadHeaderSuccess: (headerId: number) => Promise<boolean>;
  getHeader: (
    doNo: string,
    isThrowError: boolean,
  ) => Promise<IWeighingGoodsModel | undefined>;
  getHeaderById: (
    headerId: number,
    isThrowErrorIfNotExist: boolean,
  ) => Promise<IWeighingGoodsItemDTO | undefined>;
  deleteHeaderById: (headerId: number) => Promise<boolean>;
  deleteDetailById: (detailId: number, headerId: number) => Promise<boolean>;
  getUnUploadedListOfScale: (
    userId: string,
  ) => Promise<IWeighingGoodsItemDTO[]>;
  getDetailsByScaleId: (scaleId: number) => Promise<IWeighingGoodsDetailDTO[]>;

  lockUnlock: (scaleId: number) => Promise<boolean>;

  updateOnlineId: (
    scaleLocalId: number,
    scaleOnlineId: number,
  ) => Promise<boolean>;

  updateEventIfExcessco: (scaleLocalId: number) => Promise<boolean>;
}

export interface IDeliveryOrderDatabase {
  storeOrders: (userId: string, orders: IDoItem[]) => Promise<boolean>;
  getOrderByDoNo: (doNo: string) => Promise<IDoLocalItem | undefined>;
  getOrders: (userId: string) => Promise<IDoLocalItem[]>;

  updateScaleTempStatus: (
    doNo: string,
    isHasSaleTemp: boolean,
  ) => Promise<boolean>;
}

export interface IBluetoothPrinter {
  addNewDevice: (device: IStarDevice) => Promise<boolean>;
  deleteDevice: (macAddress: string) => Promise<boolean>;
  getList: () => Promise<IStarDevice[]>;
  setDefault: (macAddress: string) => Promise<boolean>;
  getDefaultPrinter: () => Promise<IStarDevice | undefined>;
}
