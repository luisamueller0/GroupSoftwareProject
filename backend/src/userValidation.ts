
    export const  validateIsOnlyLetters = (toValidate: string): boolean =>{
        const regOnlyString = /^[A-ZÄÖÜ][a-zA-Zäöü]+$/ ;
        return regOnlyString.test(toValidate);
    } ;
    export const validateIsNotNull = (toValidate: number): boolean =>{
        return toValidate !== 0;
    };
    export const validateIsCityName = (toValidate:string):boolean =>{
        const regCityName = /^[a-zA-ZäöüÄÖÜ\-]*$/;
        return regCityName.test(toValidate);
    };
    export const validateIsEmail =(toValidate: string):boolean =>{
        const regEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        return regEmail.test(toValidate);
    };
    export const validateIsPasswort = (toValidate: string):boolean =>{
        return toValidate.length >= 8;
    };



