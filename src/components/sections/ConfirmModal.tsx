import React from 'react';
import {View} from 'react-native';
import {ModalCommon, TextCustom, Button} from '../commons';
import Column from './Column';
import Row from './Row';
import {Colors, AppStrings} from '~/configs';
import {IconProps} from '../commons/Icon';

export interface IProps {
  onClose?: () => void;
  onAccept: () => void;
  isVisible: boolean;
  title?: string;
}

const ConfirmModal: React.FC<IProps> = ({
  isVisible,
  onClose,
  onAccept,
  title,
}) => {
  const acceptIcon: IconProps = {name: 'check', type: 'AntDesign'};
  const cancelIcon: IconProps = {name: 'block', type: 'Entypo'};

  const showText = () => {
    if (!title) return AppStrings.Common.ConfirmText;
    const newText = title.split('\n').map((str) => str);
    return newText;
  };

  return (
    <ModalCommon
      title={AppStrings.Common.ConfirmTitle}
      isVisible={isVisible}
      onClose={onClose}>
      <>
        <TextCustom style={{lineHeight: 30, textAlign: 'center'}}>
          {showText()}
        </TextCustom>
        <Row>
          <Column>
            <View>
              <Button
                title={AppStrings.Common.ConfirmAccept}
                outline
                color={Colors.ORIGIN}
                radius={5}
                disabled={false}
                iconLeft={acceptIcon}
                onPress={onAccept}
                isSmall
              />
            </View>
          </Column>
          <Column>
            <Button
              title={AppStrings.Common.ConfirmCancel}
              color={Colors.WHITE}
              bgColor={Colors.DISABLED}
              radius={5}
              outline={false}
              iconLeft={cancelIcon}
              onPress={onClose}
              isSmall
            />
          </Column>
        </Row>
      </>
    </ModalCommon>
  );
};

export default ConfirmModal;
