import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ScaleStatus} from '~/apis/types.service';
import {TagButton} from '~/components/commons';
import {AppStrings} from '~/configs';

export interface IProps {
  currentValue: ScaleStatus;
  onChange: (value: ScaleStatus) => void;
}

const ScaleFilter = ({currentValue, onChange}: IProps) => {
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text={AppStrings.Scale.NewStatus}
          isActive={currentValue === ScaleStatus.New}
          onPress={() => onChange(ScaleStatus.New)}
        />
        <TagButton
          text={AppStrings.Scale.DeletedStatus}
          isActive={currentValue === ScaleStatus.Deleted}
          onPress={() => onChange(ScaleStatus.Deleted)}
        />
      </ScrollView>
    </View>
  );
};

export default ScaleFilter;
