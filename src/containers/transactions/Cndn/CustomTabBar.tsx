import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Icon} from '~/components/commons';
import {Colors} from '~/configs';

export type IProps = MaterialTopTabBarProps;

const CustomTabBar = ({state, descriptors, navigation, position}: IProps) => {
  return (
    <View style={styles.tabsContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = Animated.interpolate(position, {
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            key={`${route.name}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
            onLongPress={onLongPress}>
            <View>
              <Icon name="home" type="AntDesign" />
              <Text>{route.name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
    overflow: 'scroll',
  },
  tab: {
    flex: 1,
    width: '40%',
  },
});
