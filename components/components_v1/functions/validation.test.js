import { validateAlphaNum, similarPasswords } from "../../helpers/validation";






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

