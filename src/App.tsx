import React from 'react';
import {Text, TextInput} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import CodePush from 'react-native-code-push';
import {RoutesNavigatorContainer} from '~/navigations';
import configurationStore from '~/redux/store';
import InformationModal from './containers/InformationModal';
import Loading from './containers/Loading';
import ConfirmGlobal from './containers/ConfirmGlobal';
import FcmMessage from './containers/FcmMessage';

const App = (): any => {
  if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;

  if ((TextInput as any).defaultProps == null)
    (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.allowFontScaling = false;

  return (
    <SafeAreaProvider>
      <Provider store={configurationStore()}>
        <RoutesNavigatorContainer />
        <InformationModal />
        <Loading />
        <ConfirmGlobal />
        <FcmMessage />
      </Provider>
    </SafeAreaProvider>
  );
};

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
