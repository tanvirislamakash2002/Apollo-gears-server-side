export type TAuthRegister = {
    email: string;
    password?: string;
    name?: string;
};

export type TAuthLogin = {
    email: string;
    password: string;
};

export type TAuthTokens = {
    accessToken: string;
    refreshToken: string;
};