import React from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {AppStrings} from '~/configs';
import {CndnAccountForm, CndnWizard} from '~/containers/transactions/Cndn';

const CndnCreateAccountScreen = () => {
  return (
    <SafeView>
      <Header title={AppStrings.Cndn.titleCreate} isMenu={false} noShadow />
      <CndnWizard currentStep={0} />
      <CndnAccountForm />
    </SafeView>
  );
};

export default CndnCreateAccountScreen;
