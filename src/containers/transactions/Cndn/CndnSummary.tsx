import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getCndnAccountTypeName, getCndnTypeName} from '~/commons';
import {Accordion} from '~/components/commons';
import {Container, RowLabelValue} from '~/components/sections';
import {Colors} from '~/configs';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import CndnActions from '~/redux/cndn/cndn.actions';
import {RootState} from '~/redux/reducers';
import CndnProductItem from './CndnProductItem';

export interface IProps {
  cndnNo: string;
}

const CndnSummary = ({cndnNo}: IProps) => {
  const dispatch = useDispatch();
  const {info} = useSelector((state: RootState) => state.cndn);
  useEffect(() => {
    dispatch(CndnActions.getInfoByNo(cndnNo));
  }, [cndnNo, dispatch]);

  return (
    <Container style={{width: '100%'}} isIncludeScrollView>
      <Accordion title="Phiếu Điều Chỉnh" isOpen>
        <RowLabelValue
          label="Loại tài khoản:"
          value={info?.ACCTNAME ?? ''}
          isBold
        />
        <RowLabelValue
          label="Hình thức:"
          value={info?.TYPENAME ?? getCndnTypeName(info?.CNDN4ACCTYPE ?? -1)}
        />
        <RowLabelValue label="Từ đơn Vị:" value={info?.UNITNAME ?? ''} />
        <RowLabelValue label="Đến đơn Vị:" value={info?.UNITNAMETO ?? ''} />

        <RowLabelValue
          label="Khách hàng:"
          value={`${info?.CUSTNO ?? ''} ${info?.CUSTNAME}`}
          isBold
        />
        <RowLabelValue
          label="Ngày hạch toán:"
          value={convertStringDateToDdMmYyyy(info?.CREATEDDATE, 'date')}
        />

        <RowLabelValue label="Số chứng từ:" value={info?.CNDNNO ?? ''} isBold />
        <RowLabelValue
          label="Ngày chứng từ:"
          value={convertStringDateToDdMmYyyy(info?.CNDNDATE, 'date')}
        />

        <RowLabelValue
          label="Tổng số lượng:"
          value={numberFormat(info?.TOTALQTY, '')}
          valColor={Colors.ORIGIN}
          isBold
        />
        <RowLabelValue
          label="Tổng tiền:"
          value={numberFormat(info?.TOTALAMT)}
          valColor={Colors.ORIGIN}
          isBold
        />
        <RowLabelValue
          label="Diễn giải:"
          value={info?.NOTES ?? ' --- --- --- '}
        />
      </Accordion>

      <Accordion title="Chi Tiết Phiếu Điều Chỉnh" isOpen>
        <View style={{minHeight: 100}}>
          {info?.CNDNDETAILS.map((item) => (
            <CndnProductItem
              key={`${item.CNDNNO}-${item.CNDNDTID}`}
              item={item}
            />
          ))}
        </View>
      </Accordion>
    </Container>
  );
};

export default CndnSummary;
