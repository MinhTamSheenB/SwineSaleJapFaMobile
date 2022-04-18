import {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import SettingActions from '~/redux/settings/setting.actions';

const FcmMessage = () => {
  const dispatch = useDispatch();

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onNotificationOpenedApp((removeMessage) => {
    console.log({onNotificationOpenedApp: removeMessage});
  });

  useEffect(() => {
    dispatch(SettingActions.storeFcmToken());
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage.notification?.body),
      );
    });
    return unsubscribe;
  }, [dispatch]);
  return null;
};

export default FcmMessage;
