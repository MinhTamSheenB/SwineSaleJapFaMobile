import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export interface IScreenPrams {
  name: string;
  component: JSX.Element;
}

export interface ITabsProps {
  data: IScreenPrams[];
  style?: StyleProp<ViewStyle>;
}

const TopTabs = ({data, style}: ITabsProps) => {
  return (
    <Tab.Navigator style={style}>
      {data.map((a) => (
        <Tab.Screen key={a.name} name={`${a.name}`}>
          {() => a.component}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

export default TopTabs;
const styles = StyleSheet.create({
  container: {},
});
