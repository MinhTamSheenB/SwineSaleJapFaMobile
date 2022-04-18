/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {IBleDevice} from '~/apis/types.service';
import {Icon, TextCustom} from '~/components/commons';
import {Colors, Sizes} from '~/configs';
import {isAndroid, scaleFactor} from '~/helpers/UtilitiesHelper';
import icons from '~/assets/icons';

export interface IProps {
  item: IBleDevice;
  isConnected: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onConnect?: () => void;
  connectText?: string;
}

const ScaleBluetoothItem = ({
  item,
  isConnected,
  onLongPress,
  onPress,
  onConnect,
  connectText,
}: IProps) => {
  const text = connectText ?? (isConnected ? 'Đã kết nối' : 'Kết nối');
  const color = isConnected ? Colors.ORIGIN : Colors.GRAY;
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.deviceContainer}>
      <Image source={icons.scale} style={styles.img} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: Colors.SUCCESS}}>{item.deviceName}</Text>
        {item.localName && <Text>{item.localName}</Text>}
        {isAndroid() && <Text>{item.deviceId}</Text>}
      </View>

      <TouchableOpacity onPress={onConnect}>
        <View style={[styles.btnConnect, {backgroundColor: color}]}>
          <TextCustom style={styles.textConnect}>{text}</TextCustom>
          <Icon style={styles.iconConnect} type="AntDesign" name="right" />
        </View>
      </TouchableOpacity>
    </Pressable>
  );
};

export default ScaleBluetoothItem;
const styles = StyleSheet.create({
  deviceContainer: {
    backgroundColor: Colors.WHITE,
    marginTop: 15,
    alignItems: 'center',
    paddingVertical: 10,
  },
  img: {
    width: scaleFactor(80),
    height: scaleFactor(80),
  },
  deviceHeader: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceTitle: {},
  scanDevice: {
    height: 50,
    backgroundColor: Colors.ORIGIN,
  },
  btnSearchDeviceContainer: {
    flexDirection: 'row',
    backgroundColor: '#2891CA',
    paddingVertical: 20,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  btnSearchDevice: {
    color: Colors.WHITE,
    marginLeft: 10,
    textTransform: 'capitalize',
  },
  btnConnect: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: Colors.WHITE,
    backgroundColor: Colors.ORIGIN,
    elevation: 1,
  },
  textConnect: {
    fontSize: Sizes.Content,
    color: Colors.WHITE,
  },
  iconConnect: {
    fontSize: Sizes.IconSub,
    color: Colors.WHITE,
  },
});
