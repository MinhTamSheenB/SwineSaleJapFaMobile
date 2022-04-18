import {IDoItem, IDoLocalItem} from '~/apis/types.service';
import {handleExecuteSql} from './Database';
import {IDeliveryOrderDatabase} from './DatabaseType';

const storeOrder = async (order: IDoItem, userId: string): Promise<boolean> => {
  try {
    const rs = await handleExecuteSql(
      `INSERT INTO DELIVERY_ORDER (DONO, SONO, UNITID,  CUSTNAME,  CUSTID,  CUSTADDRESS, TRUCK_NO,  BW_TOTAL,  TOTALQTY, CREATED_BY, LOCATIONNAME, DODATE) 
       VALUES(?,?,?,?,?,?,?,?,?,?, ?,?);`,
      [
        order.DONO,
        order.SONO,
        order.UNITID,
        order.CUSTNAME,
        order.CUSTID,
        order.CUSTADDRESS,
        order.TRUCK_NO,
        order.BW_TOTAL,
        order.TOTALQTY,
        userId,
        order.LOCATIONNAME,
        order.DODATE,
      ],
    );
    return !!(rs && rs.rowsAffected > 0);
  } catch (ex) {
    return false;
  }
};

const storeOrders = async (
  userId: string,
  orders: IDoItem[],
): Promise<boolean> => {
  try {
    await handleExecuteSql(
      `DELETE FROM DELIVERY_ORDER WHERE IS_HAS_SCALE_TEMP = 0 AND CREATED_BY = ?;`,
      [userId],
    );
    await Promise.all(
      orders.map(async (order) => {
        await storeOrder(order, userId);
      }),
    );
    return true;
  } catch (ex) {
    return false;
  }
};

const getOrderByDoNo = async (
  doNo: string,
): Promise<IDoLocalItem | undefined> => {
  const rs = await handleExecuteSql(
    `SELECT * FROM DELIVERY_ORDER WHERE DONO = ?;`,
    [doNo],
  );
  if (rs === undefined || rs.rows.length < 1) return undefined;
  const {rows} = rs;
  const item: IDoLocalItem = rows.item(0);
  return item;
};

const getOrders = async (userId: string): Promise<IDoLocalItem[]> => {
  const rs = await handleExecuteSql(
    `SELECT * FROM DELIVERY_ORDER WHERE  IS_HAS_SCALE_TEMP = 0 AND CREATED_BY = ?;`,
    [userId],
  );
  if (rs === undefined) return [];
  const data: IDoLocalItem[] = [];
  const {item} = rs.rows;
  for (let i = 0; i < rs.rows.length; i += 1) {
    data.push(item(i));
  }
  return data;
};

const updateScaleTempStatus = async (
  doNo: string,
  isHasSaleTemp: boolean,
): Promise<boolean> => {
  const doItem = await getOrderByDoNo(doNo);
  if (doItem === undefined) return false;
  const rs = await handleExecuteSql(
    `UPDATE DELIVERY_ORDER SET IS_HAS_SCALE_TEMP=? WHERE DONO = ?;`,
    [isHasSaleTemp ? 1 : 0, doNo],
  );
  return !!(rs && rs.rowsAffected > 0);
};

export const deliveryOrderDatabase: IDeliveryOrderDatabase = {
  getOrderByDoNo,
  storeOrders,
  getOrders,
  updateScaleTempStatus,
};
