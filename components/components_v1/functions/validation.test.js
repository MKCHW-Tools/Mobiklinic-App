import { validateAlphaNum, validateNumber, validateUgandaPhoneNumber, validateEmail, similarPasswords, validatePassword } from "../../helpers/validation";

//Testing validation functions

//validateAlphaNum
describe('validateAlphaNum', () => {
    it('should return true for an alphanumeric string', () => {
        expect(validateAlphaNum('hello123')).toBeTruthy();
    });

    it('should return false for a string that is not alphanumeric', () => {
        expect(validateAlphaNum('12345323455')).toBeFalsy();
    });

    it('should return false for a string that empty', () => {
        expect(validateAlphaNum('')).toBeFalsy();
    });
});

//validateNumber
describe('validateNumber', () => {
    it('should return true for a numeric string', () => {
        expect(validateNumber('1234567890')).toBeTruthy();
    });

    it('should return false for a string that is not numeric', () => {
        expect(validateNumber('hello123')).toBeFalsy();
    });

    it('should return false for a string that empty', () => {
        expect(validateNumber('')).toBeFalsy();
    });
});

//validateUgandaPhoneNumber
describe('validateUgandaPhoneNumber', () => {
    it('should return true for a valid Uganda phone number', () => {
        expect(validateUgandaPhoneNumber('256772123456')).toBeTruthy();
    });

    it('should return false for an invalid Uganda phone number', () => {
        expect(validateUgandaPhoneNumber('25677212345')).toBeFalsy();
    });
});

//validateEmail
describe('validateEmail', () => {
    it('should return true for a valid email address', () => {
        expect(validateEmail('hello@world.com')).toBeTruthy();
    });

    it('should return false for an invalid email address', () => {
        expect(validateEmail('helloworld.com')).toBeFalsy();
    });

    it('should return false for an empty email address', () => {
        expect(validateEmail('')).toBeFalsy();
    });
});

//validatePassword
describe('validatePassword', () => {
    it('should return true for a valid password', () => {
        expect(validatePassword('Hello123@')).toBeTruthy();
    });

    it('should return false for an invalid password', () => {
        expect(validatePassword('hello123')).toBeFalsy();
    });

    it('should return false for an empty password', () => {
        expect(validatePassword('')).toBeFalsy();
    });
});



//SimilarPasswords

// Tests that the function returns true when two identical passwords are inputted
it("should test if two passwords are equal", () => {
    const input1 = "1234"
    const input2 = "1234"
    expect(similarPasswords(input1, input2)).toBeTruthy();
})

// Tests that the function returns false when two different passwords are inputted
it('should return false when two different passwords are inputted', () => {
    expect(similarPasswords('password1', 'password2')).toBe(false);
});

// Tests that the function returns true when two empty strings are inputted
it('should return true when two empty strings are inputted', () => {
    expect(similarPasswords('', '')).toBe(true);
});

