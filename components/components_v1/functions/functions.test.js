import { MyDate } from "../../helpers/functions";

// Tests that the function returns a string with the current date and time in the expected format
it('should return a string with the current date and time in the expected format', () => {
    const myDate = new Date();
    const expected = `${myDate.getMonth() + 1}-${myDate.getDate()}-${myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
    const result = MyDate();
    expect(result).toEqual(expected);
});



