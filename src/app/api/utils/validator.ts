import validator from 'validator';

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

export const validateLogin = (email: string, password: string) => {
    const errors: { [key: string]: string } = {};
    if (!isValidEmail(email)) errors.email = 'Invalid email';
    if (!isValidPassword(password)) errors.password = INVALID_PASSWORD;

    if (Object.keys(errors).length) return { errors, valid: false };
    
    return { valid: true, data: { email: email.toLowerCase(), password } }
}

export const validateSignup = (email: string, password: string, confirmPassword: string) => {
    const errors: { [key: string]: string } = {};
    if (!isValidEmail(email)) errors.email = 'Invalid email';
    if (!isValidPassword(password)) errors.password = INVALID_PASSWORD;
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length) return { errors, valid: false };

    return { valid: true, data: { email: email.toLowerCase(), password } }
}

export const isValidJwtHeader = (header?: string | null) => {
    return !!header && header.startsWith('Bearer ') && validator.isJWT(header.split(' ')[1]);
}
