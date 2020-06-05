import { repeatCount } from './stringUtil';

/** 기준 단위까지 0 추가. */
export const addZero = (n: number, digits: number): string => {
  let zero = "";
  const _n = n.toString();

  if(_n.length < digits) {
    for (let i = 0; i < digits - _n.length; i++) {
      zero += "0";
    }
  }

  return zero + _n;
};

/** 3자리 마다 컴마 추가 */
export const commSet = (_n: string, isFloat: boolean): string => {
  let n = isFloat ? parseFloat(_n) : parseInt(_n, 10);
  if (n === 0) { return "0"; }
  
  var reg = /(^[+-]?\d+)(\d{3})/;
  let num = n + ""; // 숫자 문자로 변환
  while (reg.test(num)){ 
    num = num.replace(reg, "$1" + "," + "$2");
  }
  return num;
};

/** 콤마 제거 */
export const unCommSet = (_n: string, isFloat: boolean): number => {
  if (isFloat) {
    return parseFloat(_n.replace(/,/g, ""));
  }
  return parseInt(_n.replace(/,/g, ""), 10);
};

/** 소수점 지정 자리수 이후 버림 */
export const decimalFloor = (_n: number, digits: number): string => {
  let count = Math.pow(10, digits);
  let num = Math.floor(_n * count) / count;
  return num.toFixed(digits);
};

/** 지정된 소수점 이후 반올림 */
export const decimalRound = (_n: number, digits: number): string => {
  let count = Math.pow(10, digits);
  let num = Math.round(_n * count) / count;
  return num.toFixed(digits);
};

/** 수의 증감률을 계산 */
export const calcRatio = (_old: number, _new: number, digits = 2): string => {
  // (증가한 부분) / 증가하기전 * 100 = %
  return decimalFloor(((_new - _old) / _old) * 100, digits);
};