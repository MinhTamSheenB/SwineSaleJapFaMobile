/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import icons from '~/assets/icons';
import {Icon, TextCustom} from '~/components/commons';
import {Row} from '~/components/sections';
import {Colors} from '~/configs';
import {scaleFactor} from '~/helpers/UtilitiesHelper';

export interface IProps {
  connected?: boolean;
  deviceName: string;
  macAddress?: string;
  farmName?: string;
  type: 'SCALE' | 'PRINTER';
  onConnect?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
}

const DeviceItem = ({
  connected,
  deviceName,
  macAddress,
  farmName,
  type,
  onConnect,
  onDelete,
  onSelect,
}: IProps) => {
  return (
    <Pressable onLongPress={onDelete}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {type === 'SCALE' ? (
              <Image source={icons.scale} style={styles.icon} />
            ) : (
              <Image source={icons.escPrinter} style={styles.icon} />
            )}
          </View>
          <View style={{flex: 1}}>
            <TextCustom>{deviceName}</TextCustom>
            <Row isSmall>
              <View style={{flex: 2}}>
                <TextCustom isSmall>{macAddress}</TextCustom>
                <TextCustom isSmall>{farmName}</TextCustom>
              </View>
              {connected && (
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <View style={styles.connectContainer}>
                    <Icon
                      name="check"
                      type="Entypo"
                      size={14}
                      color={Colors.WHITE}
                    />
                    <TextCustom style={{fontSize: 12, color: Colors.WHITE}}>
                      Đã kết nối
                    </TextCustom>
                  </View>
                </View>
              )}
            </Row>
          </View>
        </View>
        <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
          <TouchableOpacity style={styles.btnConnect} onPress={onSelect}>
            <View style={styles.btnConnectContainer}>
              <Icon
                type="AntDesign"
                name="edit"
                style={{...styles.iconConnect, color: Colors.ORIGIN}}
              />
              <TextCustom style={{...styles.textConnect, color: Colors.ORIGIN}}>
                Chỉnh
              </TextCustom>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnConnect} onPress={onConnect}>
            <View style={styles.btnConnectContainer}>
              <Icon
                type="AntDesign"
                name="swap"
                style={{...styles.iconConnect, color: Colors.SUCCESS}}
              />
              <TextCustom
                style={{...styles.textConnect, color: Colors.SUCCESS}}>
                Kết nối
              </TextCustom>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default DeviceItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 10,
    // flexDirection: 'row',
    shadowOffset: {width: 0, height: 1},
    shadowColor: Colors.SHADOW,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderRadius: 5,
  },
  icon: {width: 50, height: 50},
  connectContainer: {
    backgroundColor: Colors.SUCCESS,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: Colors.SHADOW,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    flexDirection: 'row',
    paddingVertical: 2,
  },
  connectBg: {
    backgroundColor: Colors.ORIGIN,
  },
  btnConnect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  iconConnect: {fontSize: scaleFactor(15), color: Colors.GRAY, marginRight: 10},
  textConnect: {fontSize: scaleFactor(14)},
  btnConnectContainer: {
    borderWidth: 0.5,
    borderColor: Colors.BORDER_TWO,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
