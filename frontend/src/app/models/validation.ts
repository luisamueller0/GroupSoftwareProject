export const  validateIsOnlyLetters = (toValidate: string): boolean =>{
  const regOnlyString = /^[A-Za-zÄÖÜäöüß]+$/ ;
  return regOnlyString.test(toValidate);
} ;
export const validateIsNotNull = (toValidate: string): boolean =>{
  return toValidate !== '0';
};
export const validateIsCityName = (toValidate:string):boolean =>{
  const regCityName = /^[a-zA-ZäöüÄÖÜ\-]*$/;
  return regCityName.test(toValidate);
};
export const validateStreet = (toValidate:string):boolean =>{
  const regStreet = /^[A-Za-zäöüÄÖÜß\s]+/;
  return regStreet.test(toValidate);
};
export const validateIsEmail =(toValidate: string):boolean =>{
  const regEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return regEmail.test(toValidate);
};
export const validateIsPassword = (toValidate: string):boolean =>{
  return toValidate.length >= 8;
};
export const validateStreetNumber = (toValidate: string): boolean =>{
  const regStreetNumber= /^\d+\w*/;
  return regStreetNumber.test(toValidate);
};
export const validateIsOnlyNumbers = (toValidate: string): boolean =>{
  const regOnlyNumbers = /^\d+$/;
  return regOnlyNumbers.test(toValidate);
};
export const validateIsPostalcode = (toValidate: string):boolean =>{
  return toValidate.length === 5;
};






