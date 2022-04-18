import React, {useState} from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {AppStrings} from '~/configs';
import {CndnTabs} from '~/containers/transactions/Cndn';
import {ModalFilter} from '~/containers/transactions/So';
import {getCurrentDateToString} from '~/helpers/DatetimeHelpers';

const CndnListScreen = () => {
  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>(() =>
    getCurrentDateToString(),
  );
  const [toDate, setToDate] = React.useState<string>(() =>
    getCurrentDateToString(),
  );

  return (
    <SafeView>
      <Header
        title={AppStrings.Cndn.title}
        isMenu
        noShadow
        onMenuPress={() => setFilterVisible(true)}
      />
      <CndnTabs fromDate={fromDate} toDate={toDate} />

      <ModalFilter
        isVisible={isFilterVisible}
        title={AppStrings.Cndn.filterModalTitle}
        onClose={() => setFilterVisible(false)}
        fromDate={fromDate}
        toDate={toDate}
        onDateChange={(strDate, type) => {
          if (type === 'fromDate') setFromDate(strDate);
          else setToDate(strDate);
        }}
        onFilter={() => {
          setFilterVisible(false);
        }}
      />
    </SafeView>
  );
};

export default CndnListScreen;
