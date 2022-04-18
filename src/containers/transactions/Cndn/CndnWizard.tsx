import React from 'react';
import {Row, Wizard} from '~/components/sections';
import {IconProps} from '~/components/commons/Icon';

export interface IDoWizardProps {
  currentStep: number;
}

const CndnWizard: React.FC<IDoWizardProps> = ({currentStep}) => {
  const arrayIcon: IconProps[] = [
    {name: 'idcard', type: 'AntDesign'},
    {name: 'receipt', type: 'MaterialIcons'},
    {name: 'book', type: 'AntDesign'},
    {name: 'shoppingcart', type: 'AntDesign'},
  ];
  return (
    <Row>
      <Wizard currentStep={currentStep} icons={arrayIcon} size="M" />
    </Row>
  );
};

export default CndnWizard;
