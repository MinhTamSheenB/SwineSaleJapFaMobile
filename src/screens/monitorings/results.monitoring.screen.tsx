/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeView} from '~/components/commons';
import {Header, MonitoringHorizontalMemo} from '~/components/sections';
import {AccountType, GroupBy, GroupInformation} from '~/containers/monitorings';
import MonitoringActions from '~/redux/monitoring/monitoring.actions';
import {RootState} from '~/redux/reducers';

const CUSTOMER_BALANCE_MONTHLY = 203;
const CUSTOMER_BALANCE_DAILY = 214;

const ResultsMonitoringScreen = () => {
  const dispatch = useDispatch();
  const {drawerId} = useSelector((state: RootState) => state.global);

  const {
    dataDailySale,
    groupFieldData,
    groupBys,
    viewer,
    dataGroupBy,
    monitoringType,
  } = useSelector((state: RootState) => state.monitoring);

  const [groupIndex, setGroupIndex] = useState<number>();

  const [groupSelected, setGroupSelected] = useState<string>('');
  const [accountType, setAccountType] = useState<
    'MAIN' | 'SUB' | 'MAIN_AND_SUB'
  >('MAIN');

  useEffect(() => {
    if (groupIndex !== null && groupIndex !== undefined) {
      const group = groupFieldData[groupIndex ?? 0];
      if (group) {
        dispatch(MonitoringActions.setDataGroupByField(group.data));
      } else {
        dispatch(MonitoringActions.setDataGroupByField(dataDailySale));
      }
    }
  }, [dataDailySale, dispatch, groupFieldData, groupIndex]);

  return (
    <SafeView style={styles.container}>
      <Header title="Dữ Liệu Thống kê" isMenu={false} disableThreeDot />
      {drawerId === CUSTOMER_BALANCE_MONTHLY && (
        <AccountType
          selectedValue={accountType}
          onSelect={(value) => {
            setAccountType(value);
            dispatch(
              MonitoringActions.setViewerByReportType(
                'CUSTOMER_MONTHLY_BALANCE',
                value,
              ),
            );
          }}
        />
      )}
      <GroupBy
        data={groupBys}
        selectedValue={groupSelected}
        onSelect={(value) => {
          setGroupSelected(value);
          dispatch(MonitoringActions.groupByField(value, dataDailySale));
        }}
      />

      <GroupInformation
        data={groupFieldData}
        onChange={(index) => setGroupIndex(index)}
        type={monitoringType}
      />

      <MonitoringHorizontalMemo
        dataS={dataGroupBy}
        titles={viewer.titles}
        fieldKeys={viewer.fields}
      />
    </SafeView>
  );
};

export default ResultsMonitoringScreen;
const styles = StyleSheet.create({
  container: {},
});
