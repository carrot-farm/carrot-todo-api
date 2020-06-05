import { addZero } from './numberUtil';

type TDateFormat = "yyyy-MM-dd"|"yy-MM-dd"|'MM-dd'|"HH:mm";
/** 날짜 포맷 */
export const dateFormat = (_date: Date, _format: TDateFormat): string => {
  const date = _date;
  const format = _format || "yyyy-MM-dd";
  if (format === "yyyy-MM-dd") {
    return (
      date.getFullYear() +
      "-" +
      addZero(date.getMonth() + 1, 2) +
      "-" +
      addZero(date.getDate(), 2)
    );
  } else if (format === "yy-MM-dd") {
    const a = date.getFullYear();
    const yy = a >= 100 ? (a-100)+'' : a+'';
    return (
      yy+
      "." +addZero(date.getMonth() + 1, 2) +
      "." +addZero(date.getDate(), 2)
    );
  } else if (format === "MM-dd") {
    return addZero(date.getMonth() + 1, 2) + "-" + addZero(date.getDate(), 2);
  } else if (format === "HH:mm") {
    return addZero(date.getHours(), 2) + ":" + addZero(date.getMinutes(), 2);
  }
  return '';
};

/** 계산 기준 시간 형태 */
type TCaculationDateDelimiter = 'year'|'month'|'date'|'hours'|'minutes'|'seconds';
/** 
 * 날짜 및 시간 계산 
 * @param date 기준 `Date`객체
 * @param afterBefore 계산될 이전/이후 시간
 * @param delimiter 계산 기준 시간 형태
 */
export const calculationDate = (
  date: Date, // 기준 `Date객체`
  afterBefore: number, // 계산될 이전, 이후 시간
  delimiter: TCaculationDateDelimiter = 'date' // 계산 기준 시간
): number => {
  let result = 0;
  const _date = new Date();
  if(delimiter === 'year') {
    result = _date.setFullYear(date.getFullYear() + afterBefore);
  } else if(delimiter === 'month') {
    result = _date.setMonth(date.getMonth() + afterBefore);
  } else if(delimiter === 'date') {
    result = _date.setDate(date.getDate() + afterBefore);
  } else if(delimiter === 'hours') {
    result = _date.setHours(date.getHours() + afterBefore);
  } else if(delimiter === 'minutes') {
    result = _date.setMinutes(date.getMinutes() + afterBefore);
  } else if(delimiter === 'seconds') {
    result = _date.setSeconds(date.getSeconds() + afterBefore);
  }

  // console.log('> caculationDate: ', new Date(result).toLocaleString())
  
  return result;
};
