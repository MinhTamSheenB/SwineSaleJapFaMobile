import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './common.styles';
import TextCustom from './TextCustom';
import Icon from './Icon';
import {formatDate, formatDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {DateType} from '~/commons/types';

export interface IDateRowProps {
  label: string;
  date: Date;
  type: DateType;
  onDateChange?: (date: string) => void;
}

const DateRowWithoutFormik: React.FC<IDateRowProps> = ({
  label,
  date,
  type,
  onDateChange,
}): JSX.Element => {
  const [isShow, setIsShow] = useState(false);

  const handleDateChange = (
    event: Event,
    dateChange: Date | undefined,
  ): void => {
    setIsShow(false);
    if (dateChange) {
      const strDate = formatDate(dateChange!, type, false);
      return onDateChange && onDateChange(strDate);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextCustom style={styles.inputTitle}>{label}</TextCustom>

      <Pressable onPress={() => setIsShow(true)}>
        <View style={styles.inputContent}>
          <TextCustom style={styles.inputForm}>
            {type === 'date'
              ? formatDateToDdMmYyyy(date)
              : formatDate(date, type)}
          </TextCustom>
          {type === 'date' ? (
            <Icon
              name="calendar"
              type="AntDesign"
              style={styles.inputCalendarIcon}
            />
          ) : (
            <Icon
              name="back-in-time"
              type="Entypo"
              style={styles.inputCalendarIcon}
            />
          )}
        </View>
      </Pressable>
      {isShow ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={type}
          is24Hour
          display="default"
          onChange={(event, dateChange) => handleDateChange(event, dateChange)}
        />
      ) : null}
    </View>
  );
};

DateRowWithoutFormik.defaultProps = {
  type: 'date',
};

export default DateRowWithoutFormik;
