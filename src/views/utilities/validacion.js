/* eslint-disable */
const isNumber = (event) => {
  if (event.charCode < 48 || event.charCode > 57) {
    event.preventDefault();
  }
}

const isNumberWithDecimal = (event) => {
  if ((event.charCode < 48 || event.charCode > 57) && event.charCode != 46) {
    event.preventDefault();
  }
}



export default {  isNumber, isNumberWithDecimal }
