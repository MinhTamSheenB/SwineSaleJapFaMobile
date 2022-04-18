import React from 'react';
import {SafeView} from '~/components/commons';
import {Header, Container} from '~/components/sections';
import {AppStrings, Colors} from '~/configs';
import {SoAddProductForm} from '~/containers/transactions/So';

const SoCreateProductAddScreen = (): JSX.Element => {
  return (
    <SafeView style={{flex: 1}}>
      <Header
        disableThreeDot
        noShadow
        title={AppStrings.SO.AddProductTitle}
        isMenu={false}
      />
      <Container bgColor={Colors.WHITE} isIncludeScrollView>
        <SoAddProductForm />
      </Container>
    </SafeView>
  );
};

export default SoCreateProductAddScreen;
