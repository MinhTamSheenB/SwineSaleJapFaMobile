import {
  IWeighingGoodsDetailDTO,
  IWeighingGoodsItemDTO,
  IWeighingGoodsItemModel,
  IWeighingGoodsModel,
} from '~/apis/types.service';
import {convertStringToSqliteDatetime} from '~/helpers/DatetimeHelpers';
import {handleExecuteSql} from './Database';
import {IScaleTempDatabase} from './DatabaseType';

const getHeader = async (
  doNo: string,
  isThrowError = true,
): Promise<IWeighingGoodsModel | undefined> => {
  const rs = await handleExecuteSql(
    `SELECT * FROM SCALE_HEADER WHERE DONO = ?`,
    [doNo],
  );
  if (rs === undefined || rs.rows.length < 1) {
    if (isThrowError)
      throw new Error(`Không tìm thấy phiếu cân với số DO ${doNo}`);
    return undefined;
  }
  return rs.rows.item(0);
};

const getHeaderById = async (
  headerId: number,
  isThrowErrorIfNotExist: boolean,
): Promise<IWeighingGoodsItemDTO | undefined> => {
  const rs = await handleExecuteSql(
    `SELECT * FROM SCALE_HEADER WHERE SCALEID = ?`,
    [headerId],
  );
  if (rs === undefined || rs.rows.length < 1) {
    if (isThrowErrorIfNotExist) throw new Error('Không tồn tại phiếu cân');
    return undefined;
  }
  return rs.rows.item(0);
};

const checkScaleIsLocked = async (
  scaleId: number,
  isThrowErrorIfLocked,
): Promise<boolean> => {
  const scaleTemp = await getHeaderById(scaleId, true);

  if (scaleTemp?.SCALE_ONLINE_ID && scaleTemp.SCALE_ONLINE_ID > 0) {
    if (isThrowErrorIfLocked)
      throw new Error(
        'Phiếu cân đã được tải lên. Không thể thực hiện thao tác này.',
      );
    return true;
  }

  const isLocked = !!(scaleTemp!.IS_LOCKED && scaleTemp?.IS_LOCKED! > 0);
  if (isLocked && isThrowErrorIfLocked)
    throw new Error(
      'Phiếu cân đã được chốt. Không thể thực hiện thao tác này.',
    );
  return isLocked;
};

/**
 * Kiểm tra Do đã tồn tại trong table chưa.
 * True: đã tồn tại;
 * False: chưa có trong table.
 * @param doNo
 * @param isThrowErrorIfExist quăng thông báo lỗi nếu đã có trong table.
 */
const checkDoIsExist = async (
  doNo: string,
  isThrowErrorIfExist = true,
): Promise<boolean> => {
  const doItem = await getHeader(doNo, false);
  if (doItem) {
    if (isThrowErrorIfExist) throw new Error(`Do ${doNo} đã tồn tại.`);
    return true;
  }
  return false;
};

const deleteDetailsByHeaderId = async (headerId: number): Promise<boolean> => {
  const rs = await handleExecuteSql(
    `DELETE FROM SCALE_DETAIL WHERE SCALEID = ${headerId};`,
    [],
  );
  return !!(rs && rs.rowsAffected > 0);
};

const updateTotalQtyAndTotalBw = async (headerId: number): Promise<boolean> => {
  const rs = await handleExecuteSql(
    `SELECT
            SUM (qty)  SUM_QTY,
            SUM(GWEIGHT)  SUM_WEIGHT
        FROM 
            SCALE_DETAIL 
        WHERE
            SCALEID = ?;`,
    [headerId],
  );
  if (rs === undefined || rs.rows.length < 1) return false;
  const totalQty = rs.rows.item(0).SUM_QTY;
  const totalBw = rs.rows.item(0).SUM_WEIGHT;

  const rsUpdate = await handleExecuteSql(
    `UPDATE SCALE_HEADER SET 
    SUM_WEIGHT = ?,
    SUM_QTY = ?
    WHERE 
    SCALEID = ?
  `,
    [totalBw, totalQty, headerId],
  );

  return !!(rsUpdate && rsUpdate.rowsAffected > 0);
};

const insertHeader = async (
  header: IWeighingGoodsModel,
  userId: string,
): Promise<IWeighingGoodsModel | undefined> => {
  await checkDoIsExist(header.DONO!, true);
  const statement = `INSERT INTO SCALE_HEADER(
    SCALEDATE, 
    DONO, 
    SONO,
    SCALENO,
    TRUCKNO, 
    ARRIVALTIME, 
    DEPARTTIME, 
    KMSTART, 
    KMARRIVED, 
    WEIGHMAN, 
    REMAKS, 
    USERNAME,  
    CREATEDBY,  
    UNITID, 
    CUSTID,  
    CUSTNAME, 
    CUSTADD,  
    SEALNUMBER, 
    SEALCONDITION,  
    EVENIFEXCESSCO, 
    LOCATIONNAME,
    SCALE_ONLINE_ID)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?,?,?);`;
  let scaleNo: string | undefined;
  if (header.DONO) {
    scaleNo = `OF${header.DONO.toUpperCase().replace('DO', '')}`;
  }
  const values: Array<any> = [
    convertStringToSqliteDatetime(header.SCALEDATE!),
    header.DONO,
    header.SONO,
    scaleNo,
    header.TRUCKNO,
    header.ARRIVALTIME,
    header.DEPARTTIME,
    header.KMSTART,
    header.KMARRIVED,
    header.WEIGHMAN,
    header.REMAKS,
    header.USERNAME,
    userId,
    header.UNITID,
    header.CUSTID,
    header.CUSTNAME ?? '',
    header.CUSTADD ?? '',
    header.SEALNUMBER,
    header.SEALCONDITION,
    header.EVENIFEXCESSCO ? 1 : 0,
    header.LOCATION_NAME,
    header.SCALE_ONLINE_ID,
  ];
  const rs = await handleExecuteSql(statement, values);
  if (rs && rs.rowsAffected > 0) {
    return getHeader(header.DONO!, true);
  }
  throw new Error('Lỗi thêm mới phiếu cân');
};

const updateHeader = async (
  header: IWeighingGoodsModel,
): Promise<IWeighingGoodsModel | undefined> => {
  await checkScaleIsLocked(header.SCALEID!, true);

  const rs = await handleExecuteSql(
    `UPDATE SCALE_HEADER SET 
    SCALEDATE = ?,
    TRUCKNO = ?,
    ARRIVALTIME = ?,
    DEPARTTIME = ?,
    KMSTART = ?,
    KMARRIVED = ?,
    WEIGHMAN = ?,
    REMAKS = ?,
    CUSTNAME =?,
    SEALNUMBER = ?,
    SEALCONDITION = ?,
    EVENIFEXCESSCO = ?,
    LOCATIONNAME = ?
  `,
    [
      header.SCALEDATE,
      header.TRUCKNO,
      header.ARRIVALTIME,
      header.DEPARTTIME,
      header.KMSTART,
      header.KMARRIVED,
      header.WEIGHMAN,
      header.REMAKS,
      header.CUSTNAME,
      header.SEALNUMBER,
      header.SEALCONDITION,
      header.EVENIFEXCESSCO ? 1 : 0,
      header.LOCATION_NAME,
    ],
  );
  if (rs === undefined || rs.rowsAffected < 1) return undefined;
  return getHeader(header.DONO!);
};

const storeScaleHeader = async (
  header: IWeighingGoodsModel,
  userId: string,
): Promise<IWeighingGoodsModel | undefined> => {
  const isUpdate = !!(header.SCALEID && header.SCALEID > 0);
  return isUpdate ? updateHeader(header) : insertHeader(header, userId);
};

const getDetailById = async (
  id: number,
): Promise<IWeighingGoodsDetailDTO | undefined> => {
  const rs = await handleExecuteSql(`SELECT * FROM SCALE_DETAIL WHERE ID = ?`, [
    id,
  ]);
  if (rs === undefined || rs.rows.length < 1) return undefined;
  return rs.rows.item(0);
};

const deleteDetailById = async (
  detailId: number,
  headerId: number,
): Promise<boolean> => {
  await checkScaleIsLocked(headerId, true);
  const rs = await handleExecuteSql(
    `DELETE FROM SCALE_DETAIL WHERE ID = ${detailId};`,
    [],
  );
  await updateTotalQtyAndTotalBw(headerId);
  return !!(rs && rs.rowsAffected > 0);
};

const addDetailIntoHeader = async (
  headerId: number,
  detail: IWeighingGoodsItemModel,
): Promise<IWeighingGoodsDetailDTO | undefined> => {
  await checkScaleIsLocked(headerId, true);
  if (detail.ID && detail.ID > 0) {
    await deleteDetailById(detail.ID, headerId);
  }

  const statement = `INSERT INTO SCALE_DETAIL(SCALEID,  PRODUCTCODE, PRODUCTNAME, FLOCKID, FLOCKNAME, MEASURE, QTY, PWEIGHT, GWEIGHT, NWEIGHT, AVGBW, REMARKS, WHID, CREATEDBY, WEIGHTCONNECTID, PRODUCTDOWN, PRODUCTDOWNDESC, EARTAG1)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?,?, ?);`;
  const rs = await handleExecuteSql(statement, [
    headerId,
    detail.PRODUCTCODE,
    detail.PRODUCTNAME,
    detail.FLOCKID,
    detail.FLOCKNAME,
    detail.MEASURE,
    detail.QTY,
    detail.PWEIGHT,
    detail.GWEIGHT,
    detail.NWEIGHT,
    detail.AVGBW,
    detail.REMARKS,
    detail.WHID,
    detail.CREATEDBY,
    detail.WEIGHTCONNECTID,
    detail.PRODUCTDOWN ?? 0,
    detail.PRODUCTDOWNDESC,
    detail.EARTAG1,
  ]);
  if (rs === undefined) throw new Error('Lỗi thêm phiếu cân tạm Offline');
  await updateTotalQtyAndTotalBw(headerId);
  return getDetailById(rs.insertId);
};

const uploadHeaderSuccess = async (headerId: number): Promise<boolean> => {
  const statement = `UPDATE SCALE_HEADER SET IS_UPLOADED = 1, DATE_TO_UPLOADED = datetime('now', 'localtime') WHERE SCALEID = ${headerId}`;
  const rs = await handleExecuteSql(statement, []);
  return !!(rs && rs.rowsAffected > 0);
};

const deleteHeaderById = async (headerId: number): Promise<boolean> => {
  await checkScaleIsLocked(headerId, true);
  await deleteDetailsByHeaderId(headerId);
  const rs = await handleExecuteSql(
    `DELETE FROM SCALE_HEADER WHERE SCALEID = ${headerId};`,
    [],
  );
  return !!(rs && rs.rowsAffected > 0);
};

const getUnUploadedListOfScale = async (
  userId: string,
): Promise<IWeighingGoodsItemDTO[]> => {
  const rs = await handleExecuteSql(
    `SELECT * FROM SCALE_HEADER WHERE CREATEDBY = ?;`,
    [userId],
  ); // IS_UPLOADED = 0 AND
  if (!rs) return [];
  const {item} = rs.rows;
  const weighGoods: IWeighingGoodsItemDTO[] = [];
  for (let i = 0; i < rs.rows.length; i += 1) {
    const row: IWeighingGoodsItemDTO = item(i);
    weighGoods.push(row);
  }
  return weighGoods;
};

const getDetailsByScaleId = async (
  scaleId: number,
): Promise<IWeighingGoodsDetailDTO[]> => {
  const rs = await handleExecuteSql(
    `SELECT * FROM SCALE_DETAIL WHERE SCALEID =?;`,
    [scaleId],
  );

  const dataReturn: IWeighingGoodsDetailDTO[] = [];
  if (rs !== undefined && rs.rows.length > 0) {
    for (let i = 0; i < rs.rows.length; i += 1) {
      dataReturn.push(rs.rows.item(i));
    }
  }
  return dataReturn;
};

const lockUnlock = async (scaleId: number): Promise<boolean> => {
  const scaleTemp: IWeighingGoodsItemDTO | undefined = await getHeaderById(
    scaleId,
    true,
  );
  if (scaleTemp === undefined) return false;

  if (scaleTemp?.SCALE_ONLINE_ID && scaleTemp.SCALE_ONLINE_ID > 0) {
    throw new Error(
      'Phiếu cân đã được tải lên. Không thể thực hiện thao tác này.',
    );
  }

  const rsUpdate = await handleExecuteSql(
    `UPDATE SCALE_HEADER SET IS_LOCKED = ? WHERE SCALEID = ?`,
    [scaleTemp.IS_LOCKED === 1 ? 0 : 1, scaleId],
  );
  return !!(rsUpdate && rsUpdate.rowsAffected > 0);
};

const updateOnlineId = async (
  scaleLocalId: number,
  scaleOnlineId: number,
): Promise<boolean> => {
  const rs = await handleExecuteSql(
    `UPDATE SCALE_HEADER SET IS_UPLOADED = 1, SCALE_ONLINE_ID = ? WHERE SCALEID = ?`,
    [scaleOnlineId, scaleLocalId],
  );
  return !!(rs && rs.rowsAffected > 0);
};

const updateEventIfExcessco = async (
  scaleLocalId: number,
): Promise<boolean> => {
  const rs = await handleExecuteSql(
    `UPDATE SCALE_HEADER SET EVENIFEXCESSCO = 1 WHERE SCALEID = ?`,
    [scaleLocalId],
  );
  return !!(rs && rs.rowsAffected > 0);
};

// eslint-disable-next-line import/prefer-default-export
export const scaleTempDatabase: IScaleTempDatabase = {
  getHeader,
  storeScaleHeader,
  uploadHeaderSuccess,
  deleteDetailById,
  deleteHeaderById,
  getUnUploadedListOfScale,
  addDetailIntoHeader,
  getDetailsByScaleId,
  lockUnlock,
  getHeaderById,
  updateOnlineId,
  updateEventIfExcessco,
  checkScaleIsLocked,
};
