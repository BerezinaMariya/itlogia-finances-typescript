export type TokensType = {
    accessToken: string,
    refreshToken: string,
}

export type RefreshResponseType = {
    tokens: TokensType
}