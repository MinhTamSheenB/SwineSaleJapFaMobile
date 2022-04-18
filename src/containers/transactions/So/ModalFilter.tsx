import React from 'react';
import {View} from 'react-native';
import {ModalCommon, Button, DateRowWithoutFormik} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {convertMmDdYyyyToDate} from '~/helpers/DatetimeHelpers';

export type DateFilterType = 'fromDate' | 'toDate';

export interface IModalFilterProps {
  isVisible: boolean;
  fromDate: string;
  toDate: string;
  title: string;
  onClose?(): void;
  onDateChange: (strDate: string, type: DateFilterType) => void;
  onFilter?: () => void;
}

const ModalFilter: React.FC<IModalFilterProps> = ({
  isVisible,
  title,
  onClose,
  fromDate,
  toDate,
  onDateChange,
  onFilter,
}): JSX.Element => {
  return (
    <ModalCommon isVisible={isVisible} onClose={onClose} title={title}>
      <Row>
        <DateRowWithoutFormik
          label={AppStrings.SO.fromDate}
          date={convertMmDdYyyyToDate(fromDate)}
          type="date"
          onDateChange={(strDate) => onDateChange(strDate, 'fromDate')}
        />
        <View style={{width: 30}} />
        <DateRowWithoutFormik
          label={AppStrings.SO.toDate}
          type="date"
          date={convertMmDdYyyyToDate(toDate)}
          onDateChange={(strDate) => onDateChange(strDate, 'toDate')}
        />
      </Row>
      <Row>
        <Column style={{justifyContent: 'center'}}>
          <Button
            outline
            title={AppStrings.SO.filter}
            radius={20}
            onPress={onFilter}
            color={Colors.ORIGIN}
          />
        </Column>
      </Row>
    </ModalCommon>
  );
};

export default ModalFilter;
