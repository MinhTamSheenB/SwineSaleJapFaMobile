import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Accordion} from '~/components/commons';
import {RowLabelValue} from '~/components/sections';

export interface IProps {
  doNo: string;
  custName?: string;
  from?: string;
  farmAddress?: string;
  receiverName?: string;
  toAddress?: string;
}

const ScaleNoteDownDoInfo = ({
  doNo,
  custName,
  from,
  farmAddress,
  receiverName,
  toAddress,
}: IProps) => {
  return (
    <Accordion title="Phiếu xuất kho" isOpen>
      <RowLabelValue label="Do no:" value={doNo} />
      <RowLabelValue label="Khách hàng:" value={custName ?? '----'} />
      <RowLabelValue label="Nhận từ:" value={from ?? '----'} />
      <RowLabelValue label="Địa chỉ trại:" value={farmAddress ?? '----'} />
      <RowLabelValue label="Người nhận:" value={receiverName ?? '----'} />
      <RowLabelValue label="Địa chỉ nhận:" value={toAddress ?? '----'} />
    </Accordion>
  );
};

export default ScaleNoteDownDoInfo;
const styles = StyleSheet.create({
  container: {},
});
