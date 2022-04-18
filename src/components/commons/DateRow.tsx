import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useField} from 'formik';
import styles from './common.styles';
import TextCustom from './TextCustom';
import Icon from './Icon';
import {formatDate} from '~/helpers/DatetimeHelpers';
import {DateType} from '~/commons/types';

export interface IDateRowProps {
  label: string;
  date: Date;
  type: DateType;
  name: string;
  onDateChange?: (date: string) => void;
}

const DateRow: React.FC<IDateRowProps> = ({
  label,
  date,
  type,
  name,
  onDateChange,
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helpers] = useField(name);
  const [isShow, setIsShow] = useState(false);

  const handleDateChange = (
    event: Event,
    dateChange: Date | undefined,
  ): void => {
    setIsShow(false);
    if (dateChange) {
      const strDate = formatDate(dateChange!, type, false);
      helpers.setValue(strDate);
      return onDateChange && onDateChange(strDate);
    }
  };

  return (
    <View style={[styles.inputContainer]}>
      <TextCustom style={{...styles.inputTitle}}>{label}</TextCustom>

      <Pressable onPress={() => setIsShow(true)}>
        <View style={styles.inputContent}>
          <TextCustom style={styles.inputForm}>
            {formatDate(date, type)}
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
      {meta.error && meta.touched && (
        <TextCustom style={styles.errorMessage}>{meta.error}</TextCustom>
      )}
    </View>
  );
};

DateRow.defaultProps = {
  type: 'date',
};

export default React.memo(DateRow);
