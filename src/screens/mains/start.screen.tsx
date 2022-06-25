/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import imgs from '~/assets/imgs';
import {Colors} from '~/configs';
import useLocalAuthentication from '~/helpers/useLocalAuthentication';
import ScreenType from '~/navigations/screen.constant';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';

const StartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const {isConnected} = useSelector((state: RootState) => state.network);
  console.log({isConnected});

  const {checkDeviceSupportBiometric} = useLocalAuthentication();

  const handleAppStart = useCallback(async () => {
    const biometricItem = await checkDeviceSupportBiometric();
    if (!biometricItem) {
      navigate.navigate(ScreenType.Main.Login);
    } else {
      setTimeout(() => {
        dispatch(MasterActions.appStart());
      }, 1000);
    }
  }, [checkDeviceSupportBiometric, dispatch, navigate]);

  useEffect(() => {
    handleAppStart();
  }, [handleAppStart]);

  return (
    <View style={styles.container}>
      <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={imgs.japfaLogo}
          resizeMode="cover"
          style={{width: 120, height: 120}}
        />
        <Text style={{color: Colors.GRAY, fontSize: 15, marginTop: 10}}>
          Japfa Comfeed Viet Nam
        </Text>
      </View>

      <ImageBackground
        resizeMode="cover"
        source={imgs.bg2}
        style={{width: '100%', flex: 2}}
      />
    </View>
  );
};

export default StartScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
