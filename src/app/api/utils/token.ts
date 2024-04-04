import jwt from 'jsonwebtoken';
import envs from '../envs';
import { DAY_S, HOUR_S } from '../../../constants';
import { addSecondsToDate } from './date';
import { IUser } from '../db/models/user.model';

export enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh'
}

export const encodeData = (data: any, expiresIn: string | number = '1h') => {
    return jwt.sign(data, envs.secretKey, {
        expiresIn
    });
}

export const decodeData = (token: string) => {
    return jwt.verify(token, envs.secretKey);
}

export const createAuthTokens = async (user: IUser) => {
    const ACCESS_TOKEN_EXPIRES_SEC = 24 * HOUR_S
    const REFRESH_TOKEN_EXPIRES_SEC = 30 * DAY_S
    const accessTokensExpiresIn = addSecondsToDate(new Date(), ACCESS_TOKEN_EXPIRES_SEC);
    const refreshTokensExpiresIn = addSecondsToDate(new Date(), REFRESH_TOKEN_EXPIRES_SEC);
    const accessToken = encodeData({ _id: user._id, type: TokenType.ACCESS }, ACCESS_TOKEN_EXPIRES_SEC)
    const refreshToken = encodeData({ _id: user._id, type: TokenType.REFRESH }, REFRESH_TOKEN_EXPIRES_SEC)

    user.tokens.auth.access = accessToken
    user.tokens.auth.refresh = refreshToken
    await user.save()

    return {
        access: {
            token: accessToken,
            expires: accessTokensExpiresIn
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokensExpiresIn
        }
    }
}

export const verifyToken = (token: string, type = TokenType.ACCESS) => {
    try {
        const decoded = decodeData(token) as { _id: string, type: TokenType };
        if (decoded.type !== type) {
            return { error: 'Invalid token' }
        }

        return { data: decoded };
    } catch (error) {
        return { error: 'Invalid token' }
    }
}
