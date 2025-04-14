const validateInput = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailHasSpecialChars = /[<>()[\]\\,;:}{'"]/.test(email);

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = {
        emailSigns: emailHasSpecialChars,
        emailFormat: !emailRegex.test(email),
        passwordLength: password.length < 8,
        passwordUppercase: !hasUpperCase,
        passwordLowercase: !hasLowerCase,
        passwordNumber: !hasNumber,
        passwordSpecial: !hasSpecialChar,
    };

    return {
        error:
            !emailHasSpecialChars &&
            emailRegex.test(email) &&
            password.length >= 8 &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar,
        errors,
    };
};

export { validateInput };
