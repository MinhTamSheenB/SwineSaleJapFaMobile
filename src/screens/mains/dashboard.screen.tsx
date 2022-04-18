import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IBleDevice} from '~/apis/types.service';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {getBluetoothDevices} from '~/helpers/AsyncStorageHelpers';
import {RootState} from '~/redux/reducers';
import SettingActions from '~/redux/settings/setting.actions';

const DashboardScreen = () => {
  // const dispatch = useDispatch();

  // const {bleDevice} = useSelector((state: RootState) => state.setting);
  const {userOfficeS} = useSelector((state: RootState) => state.master);

  // const handleGetDefaultScale = useCallback(async () => {
  //   try {
  //     if (!bleDevice) {
  //       const scaleDevices = await getBluetoothDevices();
  //       if (scaleDevices.length > 0) {
  //         const item: IBleDevice = scaleDevices[0];
  //         dispatch(SettingActions.updateBluetoothScaleDevices(scaleDevices));
  //         dispatch(SettingActions.setBluetoothScaleDevice(item));
  //       }
  //     }
  //     // eslint-disable-next-line no-empty
  //   } catch (ex) {}
  // }, [bleDevice, dispatch]);

  // useEffect(() => {
  //   handleGetDefaultScale();
  // }, [handleGetDefaultScale]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return userOfficeS.length < 2;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [userOfficeS.length]),
  );

  return (
    <SafeView>
      <Header title="Swine Sale" isMenu noShadow />
    </SafeView>
  );
};

export default DashboardScreen;
