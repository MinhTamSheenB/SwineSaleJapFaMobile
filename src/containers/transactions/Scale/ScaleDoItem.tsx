/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from '~/components/commons';
import {Colors, Sizes} from '~/configs';

export interface IProps {
  label: string;
  index: number;
  selected: boolean;
  onPress?: () => void;
}

const ScaleDoItem = ({label, index, selected, onPress}: IProps) => {
  const selectedStyle = selected ? styles.selected : undefined;
  const textSelectedStyle = selected ? styles.textSelected : undefined;
  const borderSelectedStyle = selected ? styles.borderSelected : undefined;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, selectedStyle, borderSelectedStyle]}>
        {selected && (
          <Icon type="EvilIcons" name="cart" style={styles.iconStyle} />
        )}
        <Text style={[styles.title, textSelectedStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ScaleDoItem;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    margin: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: Sizes.Title,
    color: Colors.BLACK,
  },
  selected: {
    backgroundColor: Colors.ORIGIN,
    borderRadius: 20,
  },
  textSelected: {
    color: Colors.WHITE,
  },
  iconStyle: {
    color: Colors.WHITE,
  },
  borderSelected: {
    borderWidth: 0.5,
    borderColor: Colors.WHITE,
    borderStyle: "solid"
  }
});
