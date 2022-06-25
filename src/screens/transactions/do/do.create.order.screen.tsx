import React from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {AppStrings} from '~/configs';
import {DoWizard, DoOrderInformation} from '~/containers/transactions/Do';

const DoCreateOrderScreen = () => {
  return (
    <SafeView>
      <Header title={AppStrings.DO.DeliveryTitle} noShadow isMenu={false} disableThreeDot/>
      <DoWizard currentStep={0} />
      <DoOrderInformation />
    </SafeView>
  );
};

export default DoCreateOrderScreen;
