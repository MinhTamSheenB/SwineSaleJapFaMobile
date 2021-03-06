import moment from 'moment';
import {DateType} from '~/commons/types';
import {DateFormat} from '~/configs';

export function isValidDateIso8601(strDate?: string): boolean {
  if (!strDate) return false;
  if (strDate.length < 8) return false;
  const isResult = moment(strDate, moment.ISO_8601, true).isValid();
  return isResult;
}

export function getCurrentUnixTimestamp(): number {
  return moment().unix();
}

export function monthOfDate(date: Date): number {
  return date.getMonth();
}

export function yearOfDate(date: Date): number {
  return date.getFullYear();
}

export function daysOfDate(date: Date): number {
  return date.getDate();
}

export function isValidMmDdYyyyString(str: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(str);
}

export function getCurrentDate(): Date {
  const date = new Date();
  const year = yearOfDate(date);
  const month = monthOfDate(date);
  const days = daysOfDate(date);
  return new Date(year, month, days);
}

export function formatDate(
  date: Date | undefined,
  type: DateType,
  isDdMm = true,
): string {
  if (!date) return '';
  if (type === 'date') {
    return moment(date).format(
      isDdMm ? DateFormat.DD_MM_YYYY : DateFormat.PATTEN_DATE_FORMAT,
    );
  }
  if (type === 'time')
    return moment(date).format(DateFormat.PATTEN_TIME_FORMAT);
  if (type === 'HH:mm:ss') return moment(date).format(DateFormat.HH_MM_SS);
  return moment(date).format(
    `${isDdMm ? DateFormat.DD_MM_YYYY : DateFormat.PATTEN_DATE_FORMAT} ${
      DateFormat.PATTEN_TIME_FORMAT
    }`,
  );
}

export function formatDateToDdMmYyyy(
  date: Date | undefined,
  includeTime = false,
  isWhiteSpace = true,
): string {
  if (!date) {
    if (isWhiteSpace) return '';
    throw new Error('DATE IS INVALID');
  }
  const timeFormat = includeTime
    ? `${DateFormat.DD_MM_YYYY} ${DateFormat.HH_MM_SS}`
    : DateFormat.DD_MM_YYYY;
  return moment(date).format(timeFormat);
}

export function getCurrentDateToString(): string {
  const date = new Date();
  return formatDate(date, 'date', false);
}

export function getCurrentTimeToString(includeSecond = false): string {
  const date = new Date();
  if (!includeSecond) return formatDate(date, 'time');
  return formatDate(date, 'HH:mm:ss');
}

export function convertStringDateToMdDdYyyy(str: string): string {
  // const date = new Date(str);
  return moment(str).format(DateFormat.PATTEN_DATE_FORMAT);
  // return formatDate(date, 'date');
}

export function convertStringDateToDdMmYyyy(
  str: string | undefined,
  type: DateType,
): string {
  if (str === undefined) return '';
  const date = str.replace(' ', 'T');
  if (type === 'date') return moment(date).format(DateFormat.DD_MM_YYYY);
  if (type === 'time')
    return moment(date).format(DateFormat.PATTEN_TIME_FORMAT);

  return moment(date).format(`${DateFormat.DD_MM_YYYY} ${DateFormat.HH_MM_SS}`);
}

export function getTimeFromStringDate(
  strDate: string | undefined | null,
  isDefault = false,
): string {
  if (strDate) {
    const date = new Date(strDate);
    return formatDate(date, 'time');
  }
  if (isDefault) return getCurrentTimeToString();
  throw new Error('strDate invalid');
}

export function convertMmDdYyyyToDate(str: string | null | undefined): Date {
  let strCurrentDate = str;
  if (!str) {
    strCurrentDate = getCurrentDateToString();
  }
  const date = moment(strCurrentDate, DateFormat.PATTEN_DATE_FORMAT).toDate();
  return date;
}

export function convertDdMmYyyyToDate(str: string | null | undefined): Date {
  const strCurrentDate = str;
  if (!str) {
    return new Date();
  }
  const date = moment(strCurrentDate, DateFormat.DD_MM_YYYY).toDate();
  return date;
}

export function convertStringToDate(strDate: string): Date {
  if (strDate && strDate.includes('T') && strDate.indexOf('-') > -1) {
    return moment(strDate).toDate();
  }

  if (strDate.length === 5 && strDate.indexOf(':') > -1) {
    return moment(`2021-08-20T${strDate}:00`).toDate();
  }

  const str = strDate.replace(' ', 'T');
  if (isValidMmDdYyyyString(str)) {
    return convertMmDdYyyyToDate(str);
  }
  const newStrDate = convertStringDateToMdDdYyyy(str);
  return convertMmDdYyyyToDate(newStrDate);
}

export function convertTimeStringToDate(time: string | null | undefined): Date {
  const patten = `${DateFormat.PATTEN_DATE_FORMAT} ${DateFormat.PATTEN_TIME_FORMAT}`;
  const strDate = getCurrentDateToString();
  const strTime = time ?? getCurrentTimeToString();
  return moment(`${strDate} ${strTime}`, patten).toDate();
}

export function subtractDate(date: Date, days = 1): Date {
  return moment(date).subtract(days, 'days').toDate();
}

/**
 * Gi???m s??? ng??y t??? ng??y ???? ???????c ?????nh d???ng
 * MM/DD/YYYY
 * @param strDate
 * @param days
 */
export function subtractDateFromMmDdYyyy(strDate: string, days): string {
  const date = moment(strDate, DateFormat.PATTEN_DATE_FORMAT).subtract(
    days,
    'days',
  );
  return formatDate(date.toDate(), 'date');
}

export function getValueOfDate(
  date: Date,
  type: 'YEAR' | 'MONTH' | 'DAYS' = 'DAYS',
): string {
  if (type === 'YEAR') return moment(date).format('YYYY');
  if (type === 'MONTH') return moment(date).format('MM');
  return moment(date).format('DD');
}

// sqlite
export function convertStringToSqliteDatetime(strDate: string): string {
  return moment(
    strDate,
    `${DateFormat.PATTEN_DATE_FORMAT} ${DateFormat.HH_MM_SS}`,
  ).format(DateFormat.SQLITE);
}
