/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {IBleDevice} from '~/apis/types.service';
import {Icon, TextCustom} from '~/components/commons';
import {Colors} from '~/configs';
import {scaleFactor} from '~/helpers/UtilitiesHelper';

export interface IProps {
  item: IBleDevice;
  onPress?: () => void;
  onLongPress?: () => void;
}

const BluetoothItem = ({item, onPress, onLongPress}: IProps) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.deviceContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="bluetooth"
            type="MaterialIcons"
            color={Colors.GRAY_LIGHT}
            size={30}
          />
          <View>
            <TextCustom>
              {item.deviceName}
              {item.localName && (
                <TextCustom
                  style={{
                    fontStyle: 'italic',
                    marginLeft: 10,
                    fontSize: scaleFactor(14),
                    color: Colors.GRAY_LIGHT,
                  }}>
                  {' '}
                  ({item.localName})
                </TextCustom>
              )}
            </TextCustom>
            <TextCustom isSmall>{item.deviceId}</TextCustom>
          </View>
        </View>
        <Icon
          name="right"
          type="AntDesign"
          color={Colors.GRAY_LIGHT}
          size={18}
        />
      </View>
    </Pressable>
  );
};

export default BluetoothItem;
const styles = StyleSheet.create({
  deviceContainer: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.GRAY_LIGHT,
    width: '100%',
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
});
