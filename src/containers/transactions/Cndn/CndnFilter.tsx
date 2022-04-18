import React from 'react';
import {View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TagButton} from '~/components/commons';
import {AppStrings} from '~/configs';

const CndnFilter = () => {
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton text={AppStrings.Cndn.status.new} isActive />
        <TagButton text={AppStrings.Cndn.status.approved} />
        <TagButton text={AppStrings.Cndn.status.invoiced} />
        <TagButton text={AppStrings.Cndn.status.canceled} />
      </ScrollView>
    </View>
  );
};

export default CndnFilter;
