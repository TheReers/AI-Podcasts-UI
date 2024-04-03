import { hash, compare } from 'bcrypt';

export const hashPwd = async (password: string) => {
    return hash(password, 10);
}

export const comparePwd = async (password: string, hash: string) => {
    return compare(password, hash);
}
