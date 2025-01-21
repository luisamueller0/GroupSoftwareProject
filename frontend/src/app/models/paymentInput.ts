export type InputHCIPal = {
    email: string,
    password: string,
    amount: string,
    service: 'hcipal'
};

export type InputSWPSafe = {
    code: string,
    amount: string,
    service: 'swpsafe'
}

export type InputBC = {
    name: string,
    cardNumber : string,
    securityCode: string,
    expirationDate: string,
    amount: string,
    service: 'bachelorcard'
}