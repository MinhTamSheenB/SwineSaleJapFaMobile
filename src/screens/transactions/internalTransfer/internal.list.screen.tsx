import React from 'react';
import {View, Text} from 'react-native';
import {Header} from '~/components/sections';
import {AppStrings} from '~/configs';

const InternalListScreen = () => {
  return (
    <>
      <Header title={AppStrings.IN_TF.title} isMenu disableThreeDot />
    </>
  );
};

export default InternalListScreen;
