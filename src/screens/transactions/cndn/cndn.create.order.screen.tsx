import React from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {AppStrings} from '~/configs';
import {CndnOrderForm, CndnWizard} from '~/containers/transactions/Cndn';

const CndnCreateOrderScreen = () => {
  return (
    <SafeView>
      <Header title={AppStrings.Cndn.titleCreate} isMenu={false} noShadow />
      <CndnWizard currentStep={2} />
      <CndnOrderForm />
    </SafeView>
  );
};

export default CndnCreateOrderScreen;
