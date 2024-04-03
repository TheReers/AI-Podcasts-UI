import validator from 'validator';
import { capitalizeWord } from './capitalize_word.utils';

const invalidPwdMsg = 'Invalid password';
const pwdLengthMsg = 'Password must be at least 8 characters long and'
const pwdCharsMsg = 'contain at least one uppercase letter one lowercase letter, one number, and one special character.'
const INVALID_PASSWORD = `${invalidPwdMsg} ${pwdLengthMsg} ${pwdCharsMsg}`;

const isValidEmail = (email: string) => !!email && validator.isEmail(email);
const isValidPassword = (password: string) => !!password && validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
});

export interface RegisterDto {
    name: string
    email: string
    password: string
    confirm_password: string
}

export interface LoginDto {
    email: string
    password: string
}

export const validateLogin = ({ email, password }: LoginDto) => {
    const errors: { [key: string]: string } = {};
    if (!isValidEmail(email)) errors.email = 'Invalid email';
    if (!isValidPassword(password)) errors.password = INVALID_PASSWORD;

    if (Object.keys(errors).length) return { errors, valid: false };
    
    return { valid: true, data: { email: email.toLowerCase(), password } }
}

export const validateSignup = ({ email, password, confirm_password, name }: RegisterDto) => {
    const errors: { [key: string]: string } = {};
    if (!isValidEmail(email)) errors.email = 'Invalid email';
    if (!isValidPassword(password)) errors.password = INVALID_PASSWORD;
    if (!name || name.split(' ').length < 2) errors.name = 'Invalid full name';
    if (password !== confirm_password) errors.confirm_password = 'Passwords do not match';

    if (Object.keys(errors).length) return { errors, valid: false };

    return {
        valid: true,
        data: {
            email: email.toLowerCase(),
            password,
            name: name.split(' ').map(word => capitalizeWord(word)).join(' ')
        }
    }
}

export const isValidJwtHeader = (header?: string | null) => {
    return !!header && header.startsWith('Bearer ') && validator.isJWT(header.split(' ')[1]);
}
