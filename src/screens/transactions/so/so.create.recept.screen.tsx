import React from 'react';
import {SafeView} from '~/components/commons';
import {Header, Container} from '~/components/sections';
import {AppStrings} from '~/configs';
import {SoWizard, SoReceptInfoFrom} from '~/containers/transactions/So';

const SoCreateReceptScreen = (): JSX.Element => {
  return (
    <SafeView>
      <Header
        disableThreeDot
        title={AppStrings.SO.CustomersOrderForm}
        isMenu={false}
      />
      <Container isIncludeScrollView>
        <SoWizard currentStep={1} />
        <SoReceptInfoFrom />
      </Container>
    </SafeView>
  );
};

export default SoCreateReceptScreen;
