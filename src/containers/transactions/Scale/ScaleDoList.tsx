/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Colors} from '~/configs';
import ScaleDoItem from './ScaleDoItem';

export interface IProps {
  data: string[];
  doSelected: string;
  onPress?: (doNo: string) => void;
}

const ScaleDoList = ({data, doSelected, onPress}: IProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        pagingEnabled={false}
        horizontal
        decelerationRate={0}
        snapToInterval={216}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `scale-do-item-${index}`}
        renderItem={({item, index}) => (
          <ScaleDoItem
            label={item}
            index={index}
            selected={doSelected === item}
            onPress={() => onPress && onPress(item)}
          />
        )}
      />
    </View>
  );
};

export default ScaleDoList;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    elevation: 1,
    marginVertical: 10,
    paddingVertical: 5,
    borderTopColor: Colors.GRAY_LIGHT,
    borderTopWidth: 0.3,
    minHeight: 40,
  },
});
