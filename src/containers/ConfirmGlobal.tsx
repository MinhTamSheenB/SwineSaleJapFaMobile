/* eslint-disable prettier/prettier */
/* eslint-disable dot-notation */
import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ConfirmModal} from '~/components/sections';
import DoActions from '~/redux/do/do.actions';
import {Types as DoTypes} from '~/redux/do/do.types';
import {Types as SoTypes} from '~/redux/so/so.types';
import GlobalActions from '~/redux/global/global.actions';
import {RootState} from '~/redux/reducers';
import SoAction from '~/redux/so/so.actions';
import { ISoHeaderCommon } from '~/apis/types.service';

const ConfirmGlobal = () => {
  const dispatch = useDispatch();
  const {confirm} = useSelector((state: RootState) => state.global);

  const handleAccept = () => {
    dispatch(GlobalActions.acceptDenyConfirm(true));
    const {payload} = confirm;
    switch (confirm.actionName) {
      case DoTypes.DO_POST_TO_SALE: {
        if (payload) {
          dispatch(DoActions.postToSale(payload['doNo'], payload['status'], payload['isAlert'], true));
        }
        break;
      }
      case SoTypes.SO_POST_TO_DO: {
        const model = payload as ISoHeaderCommon;
        model.creditFlag = true;
        dispatch(SoAction.postToDo(model))
        break;
      }
      default:
        break;
    }
  };

  return (
    <ConfirmModal
      isVisible={confirm.isOpen}
      title={confirm.title}
      onClose={() => dispatch(GlobalActions.acceptDenyConfirm(false))}
      onAccept={() => handleAccept()}
    />
  );
};

export default ConfirmGlobal;
