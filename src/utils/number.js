export const toFloat = (value) => {
  let retVal = 0
  try {
    retVal = parseFloat(value)
  } catch(e) { console.log(e) }
  if(!isFinite(retVal))
    retVal = 0
  return retVal
}

export function toSignificant(value, decimals) {
  var x = toFloat(value).toPrecision(decimals), e
  if (Math.abs(x) < 1.0) {
    e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x = (x.toString().split('e-')[0]).replace('.', '');
      x = '0.' + (new Array(e)).join('0') + x;
    }
  } else {
    x = toFloat(x)
  }
  return x;
}

export function formatValue(value, defVal = '') {
  let inputValue = value ? value.toString() : defVal
  if(inputValue.includes('.')) {
    const nums = inputValue.split('.')
    inputValue = nums[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + nums[1]
  } else {
    inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return inputValue
}

export function noExponents (value) {
  var data = String(value).split(/[eE]/);
  if(data.length === 1) return data[0]; 

  var  z = '', sign = value < 0 ? '-' : '',
  str = data[0].replace('.', ''),
  mag = Number(data[1]) + 1;

  if(mag < 0) {
      z = sign + '0.';
      while(mag ++) z += '0';
      return z + str.replace(/^-/,'');
  }
  mag -= str.length;  
  while(mag --) z += '0';
  return str + z;
}