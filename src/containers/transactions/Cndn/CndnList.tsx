import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CnDnStatus, ICndnDtoItem, ICndnHeaderModel} from '~/apis/types.service';
import {FlatListCommon} from '~/components/commons';
import {ConfirmModal, Container} from '~/components/sections';
import {convertStringDateToMdDdYyyy} from '~/helpers/DatetimeHelpers';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import {RootState} from '~/redux/reducers';
import CndnItem from './CndnItem';

export interface IProps {
  status: CnDnStatus;
  fromDate: string;
  toDate: string;
}

const CndnList = ({status, fromDate, toDate}: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {dataApproved, dataInvoiceIssued, dataNew, dataRejected} = useSelector(
    (state: RootState) => state.cndn,
  );
  const {currentDrawerScreen} = useSelector((state: RootState) => state.global);

  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<
    ICndnDtoItem | undefined
  >();

  const handleSearch = useCallback(() => {
    dispatch(
      CndnActions.search(fromDate, toDate, undefined, undefined, status),
    );
  }, [dispatch, fromDate, status, toDate]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const getDataSource = (): ICndnDtoItem[] => {
    if (status === CnDnStatus.Approved) return dataApproved;
    if (status === CnDnStatus.InvoiceIssued) return dataInvoiceIssued;
    if (status === CnDnStatus.New) return dataNew;
    if (status === CnDnStatus.Rejected) return dataRejected;
    return [];
  };

  const handleAccept = () => {
    if (!selectedItem) return;
    const {CNDNNO, STATUS} = selectedItem;
    setIsConfirm(false);
    dispatch(CndnActions.deleteHeader(CNDNNO, STATUS, true));
  };

  const handleSelect = (item?: ICndnDtoItem) => {
    if (!item) return Alert.alert('undifined');
    const {STATUS} = item;
    if (
      currentDrawerScreen === ScreenType.Approval.CNDN ||
      STATUS !== CnDnStatus.New
    ) {
      return navigate.navigate(ScreenType.Cndn.SUMMARY, {cndnNo: item.CNDNNO});
    }

    if (STATUS === CnDnStatus.New) {
      const model: ICndnHeaderModel = {
        REGIONID: item.REGIONID,
        UPDATEDBY: item.UPDATEDBY,
        UPDATEDDATE: item.UPDATEDBY,
        CREATEDBY: item.CREATEDBY,
        CREATEDDATE: convertStringDateToMdDdYyyy(item.CREATEDDATE),
        OFFICEID: item.OFFICEID,
        UNITID: item.UNITID,
        DEPTID: item.DEPTID,
        CNDNNO: item.CNDNNO,
        CNDNDATE: convertStringDateToMdDdYyyy(item.CNDNDATE),
        CNDNTYPE: item.CNDNTYPE ?? 0,
        CUSTNO: item.CUSTNO,
        CUSTNAME: item.CUSTNAME,
        CUSTADDRESS: item.CUSTADDRESS,
        CUSTTAXCODE: item.CUSTTAXCODE,
        UNITIDTO: item.UNITIDTO,
        CURRENCY: item.CURRENCY,
        NOTES: item.NOTES,
        STATUS: item.STATUS,
        CNDN4ACCTYPE: item.CNDN4ACCTYPE,
        PIT: item.PIT,
        PIT_FLAG: item.PIT_FLAG,
        P_USAGEDIS: item.P_USAGEDIS,
        S_USAGEDIS: item.S_USAGEDIS,
        TOTALQTY: item.TOTALQTY ?? 0,
        TOTALAMT: item.TOTALAMT ?? 0,
      };
      dispatch(CndnActions.getDetails(model.CNDNNO ?? ''));
      dispatch(CndnActions.updateHeaderLocalModel(model));
      return navigate.navigate(ScreenType.Cndn.ACCOUNT);
    }
  };

  return (
    <>
      <Container>
        <FlatListCommon
          onRefresh={() => handleSearch()}
          isShowVertical={false}
          data={getDataSource()}
          renderItem={({item}) => (
            <CndnItem
              item={item}
              onLongPress={() => {
                setSelectedItem(item);
                setIsConfirm(true);
              }}
              onPress={() => handleSelect(item)}
            />
          )}
        />
      </Container>
      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => {
          setSelectedItem(undefined);
          setIsConfirm(false);
        }}
        onAccept={handleAccept}
      />
    </>
  );
};

export default CndnList;
