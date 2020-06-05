// ===== 문자가 몇번 반복되는지 세기
export const  repeatCount = (str: string, delimiter: string): number => {
  return str.split(delimiter).length - 1;
};
