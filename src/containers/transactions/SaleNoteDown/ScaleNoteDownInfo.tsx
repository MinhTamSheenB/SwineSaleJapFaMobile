import React from 'react';
import {Accordion} from '~/components/commons';
import {RowLabelValue} from '~/components/sections';

export interface IProps {
  scaleDate: string;
  scaleMan?: string;
  exportCode?: string;
  receivedCode?: string;
  time?: string;
}

const ScaleNoteDownInfo = ({
  scaleDate,
  scaleMan,
  exportCode,
  receivedCode,
  time,
}: IProps) => {
  return (
    <Accordion title="Thông tin phiếu cân" isOpen>
      <RowLabelValue label="Ngày cân:" value={scaleDate} />
      <RowLabelValue label="Nhân viên cân:" value={scaleMan ?? ''} />
      <RowLabelValue label="Giờ đến/ giờ đi:" value={time ?? ''} />
      <RowLabelValue label="Mã đàn xuất:" value={exportCode ?? ''} />
      <RowLabelValue label="Mã đàn nhận:" value={receivedCode ?? ''} />
    </Accordion>
  );
};

export default ScaleNoteDownInfo;
