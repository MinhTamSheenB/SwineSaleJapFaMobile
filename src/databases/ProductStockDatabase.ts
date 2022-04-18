import SQLite from 'react-native-sqlite-storage';
import {IProductStockDTO} from '~/apis/types.service';
import {getDatabase} from './Database';
import {IProductStockDatabase} from './DatabaseType';

// ======= implement interface =====
const getProductById = async (
  id: string,
): Promise<IProductStockDTO | undefined> => {
  const db = await getDatabase();
  const rs: SQLite.ResultSet = await db.executeSql(
    'SELECT * FROM PRODUCT_STOCK WHERE PRODUCTID=?',
    [id],
  )[0];
  if (rs === undefined) return undefined;
  const {rows} = rs;
  return rows.item(0);
};

const deleteProductById = async (id: string): Promise<boolean> => {
  const db = await getDatabase();
  const results = await db.executeSql(
    'DELETE FROM PRODUCT_STOCK WHERE PRODUCTID = ?',
    [id],
  )[0];
  if (!results) return false;
  return true;
};

const getProductsStock = async (): Promise<IProductStockDTO[]> => {
  const db = await getDatabase();
  const results = await db.executeSql('SELECT * from PRODUCT_STOCK;', []);
  if (results === undefined) return [];
  const products: IProductStockDTO[] = [];
  for (let i = 0; i < results[0].rows.length; i += 1) {
    const row: IProductStockDTO = results[0].rows.item(i);
    products.push(row);
  }
  return products;
};

const storeProductsStock = async (
  products: IProductStockDTO[],
): Promise<void> => {
  const db = await getDatabase();
  products.forEach(async (p) => {
    try {
      if ((await getProductById(p.PRODUCTID)) === undefined) {
        await db.executeSql(
          `INSERT INTO PRODUCT_STOCK (PRODUCTID, NAME_VN, NAME_EN, MEASURECODE, DESCRIPTION, PRODTYPE,  ACTIVE, VAT, USERCREATE, CREATEDATE) VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            p.PRODUCTID,
            p.NAME_VN,
            p.NAME_EN,
            p.MEASURECODE,
            p.DESCRIPTION,
            p.PRODTYPE,
            p.ACTIVE,
            p.VAT,
            p.USERCREATE,
            p.CREATEDATE,
          ],
        );
      }
    } catch (ex) {}
  });
};

// eslint-disable-next-line import/prefer-default-export
export const productsStockDatabase: IProductStockDatabase = {
  getProductsStock,
  storeProductsStock,
  getProductById,
  deleteProductById,
};
