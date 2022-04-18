import {DropdownItemType} from '~/commons/types';
import {removeUnicode} from '~/helpers/UtilitiesHelper';
import {IMasterState, MasterActionsType, Types} from './master.types';

const initialState: IMasterState = {
  userMenus: [],
  userOfficeS: [],
  userDepartmentS: [],
  customers: [],
  customerDropdownData: [],
  locations: [],
  saleLocations: [],
  locationsOfUser: [],
  locationsDropdownData: [],
  productsUnit: [],
  productsDropdownData: [],
  prices: [],
  customerBalances: [],
  discountTypeDropdownData: [
    {
      label: 'Chiết khấu nhập thường',
      value: 0,
      keySearch: 'chiet khau tra sau',
    },
    // {label: 'Write Off', value: 1, keySearch: 'write off'},
  ],
  unitsCustomerDropdownData: [],
  unitsOfCustomer: [],
  unitsSale: [],
  products: [],
  userMenuIds: [],
};

export default function MasterReducers(
  state = initialState,
  action: MasterActionsType,
): IMasterState {
  switch (action.type) {
    case Types.MASTER_FETCH_OFFICE_BY_USER_SUCCESS: {
      return {...state, userOfficeS: action.payload};
    }
    case Types.MASTER_FETCH_DEPARTMENT_BY_USER_SUCCESS: {
      return {...state, userDepartmentS: action.payload};
    }
    case Types.MASTER_FETCH_CUSTOMERS_SUCCESS: {
      return {...state, customers: action.payload};
    }
    case Types.MASTER_UPDATE_CUSTOMER_DROPDOWN_DATA: {
      return {...state, customerDropdownData: action.payload};
    }
    case Types.MASTER_FETCH_LOCATION_BY_UNIT_SUCCESS: {
      return {...state, locations: action.payload};
    }
    case Types.MASTER_GET_SALE_LOCATION_SUCCESS: {
      const {locations} = action.payload;
      return {...state, saleLocations: locations};
    }
    case Types.MASTER_UPDATE_LOCATION_DROPDOWN_DATA: {
      return {...state, locationsDropdownData: action.payload};
    }
    case Types.MASTER_FETCH_PRODUCTS_BY_UNIT_SUCCESS: {
      const products = action.payload;
      const dropdownData: DropdownItemType[] = products.map((item) => {
        const dropDownItem: DropdownItemType = {
          label: item.Name,
          value: item.ID,
          keySearch: `${removeUnicode(item.Name)} ${item.ID}`,
        };
        return dropDownItem;
      });
      return {
        ...state,
        productsUnit: products,
        productsDropdownData: dropdownData,
      };
    }
    case Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT_SUCCESS: {
      return {...state, prices: action.payload};
    }
    case Types.MASTER_GET_CUSTOMER_BALANCES_SUCCESS: {
      return {...state, customerBalances: action.payload};
    }
    case Types.MASTER_GET_UNITS_OF_CUSTOMER_SUCCESS: {
      const {units, unitsDropdownData} = action.payload;
      return {
        ...state,
        unitsOfCustomer: units,
        unitsCustomerDropdownData: unitsDropdownData,
      };
    }
    case Types.MASTER_GET_LOCATIONS_BY_USER_SUCCESS: {
      const {locations} = action.payload;
      return {...state, locationsOfUser: locations};
    }
    case Types.MASTER_GET_MENU_BY_USER_SUCCESS: {
      const {menus, userMenuIds} = action.payload;
      return {...state, userMenus: menus, userMenuIds};
    }
    case Types.MASTER_GET_SALE_UNITS_SUCCESS: {
      const {units} = action.payload;
      return {...state, unitsSale: units};
    }
    case Types.MASTER_GET_ALL_PRODUCTS_SUCCESS: {
      const {products} = action.payload;
      return {...state, products};
    }
    default:
      return state;
  }
}
