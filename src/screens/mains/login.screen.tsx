/* eslint-disable @typescript-eslint/camelcase */
import React, {useRef} from 'react';
import {useDispatch} from 'react-redux';
import jwtDecode from 'jwt-decode';
import masterActions from '~/redux/master/master.actions';
import ADLoginView from '~/components/microsoftLogin/ADLoginView';
import ReactNativeAD from '~/components/microsoftLogin/ReactNativeAD';
import {AccessTokenObject} from '~/components/microsoftLogin/types';
import {Header} from '~/components/sections';
import {SafeView} from '~/components/commons';
import {INavigateScreen} from '~/commons/types';
import ScreenType from '~/navigations/screen.constant';

const CLIENT_ID = 'd14ca098-eb8e-4cbb-a748-09ff6035c55f';
const OUTLOOK = 'https://outlook.office365.com';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const rNativeAd = useRef(
    new ReactNativeAD({
      client_id: CLIENT_ID,
      resources: [OUTLOOK],
    }),
  ).current;

  const handleLoginSuccess = async (strAccessToken) => {
    try {
      const objToken: AccessTokenObject = jwtDecode(strAccessToken);
      dispatch(masterActions.loginSuccess(objToken, strAccessToken));
    } catch (er) {
      console.log({er});
    }
  };

  const onLoginSuccess = async (credentials) => {
    const strAccessToken = credentials[OUTLOOK].access_token;
    handleLoginSuccess(strAccessToken);
  };

  return (
    <SafeView>
      <Header isMenu={false} title="Đăng Nhập Hệ Thống" noShadow />
      <ADLoginView
        context={rNativeAd}
        onSuccess={(adc) => onLoginSuccess(adc)}
        hideAfterLogin
        needLogout
      />
    </SafeView>
  );
};

export default LoginScreen;
