import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect} from 'react';
import {BackHandler, Pressable,View,ImageBackground,Image,Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IBleDevice} from '~/apis/types.service';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {getBluetoothDevices} from '~/helpers/AsyncStorageHelpers';
import {RootState} from '~/redux/reducers';
import SettingActions from '~/redux/settings/setting.actions';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import ScreenType from '~/navigations/screen.constant';
import imgs from '~/assets/imgs';
import {Colors} from '~/configs';

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

  const navigate = useNavigation();
  const Press = (): void => {
    return navigate.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeView>
      <Header title="Swine Sale" isMenu disableThreeDot noShadow />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable onPress={Press} style={{ flex: 1, minWidth: '100%', minHeight: '100%' }}>
          <View style={{ top:200,flex:1,position: 'absolute', alignItems: 'center', justifyContent:'center',minWidth: '100%', minHeight: '100%' }}>
            <Image
              source={imgs.touch}
              resizeMode="cover"
              style={{ width: 110, height: 120, opacity: 0.2, alignSelf: 'center' }}
            />
            <Text style={{ color: Colors.GRAY, fontSize: 25, marginTop: 10, opacity: 0.5, alignSelf: 'center' }}>
              Chạm Để Bắt Đầu
            </Text>
          </View>
        </Pressable>
      </View>   
    </SafeView>
  );
};

export default DashboardScreen;
