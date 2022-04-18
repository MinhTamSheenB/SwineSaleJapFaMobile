/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeView} from '~/components/commons';
import {Container, Header} from '~/components/sections';
import {Filter} from '~/containers/monitorings';
import {RootState} from '~/redux/reducers';

const DailySaleMonitoringScreen = () => {
  const {drawerTitle} = useSelector((state: RootState) => state.global);
  return (
    <SafeView style={styles.container}>
      <Header title={drawerTitle} isMenu disableThreeDot />
      <Container isIncludeScrollView>
        <Filter />
      </Container>
    </SafeView>
  );
};

export default DailySaleMonitoringScreen;
const styles = StyleSheet.create({
  container: {flex: 1},
});
