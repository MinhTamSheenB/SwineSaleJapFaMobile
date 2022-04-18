import React from 'react';
import {Row, Wizard} from '~/components/sections';
import {IconProps} from '~/components/commons/Icon';

export interface ISoWizardProps {
  currentStep: number;
}

const SoWizard: React.FC<ISoWizardProps> = ({currentStep}) => {
  const arrayIcon: IconProps[] = [
    {name: 'idcard', type: 'AntDesign'},
    {name: 'receipt', type: 'MaterialIcons'},
    {name: 'shoppingcart', type: 'AntDesign'},
    {name: 'infocirlce', type: 'AntDesign'},
  ];
  return (
    <Row>
      <Wizard currentStep={currentStep} icons={arrayIcon} size="M" />
    </Row>
  );
};

export default SoWizard;
