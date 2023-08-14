import { MyDate } from "../../helpers/functions";

// Tests that the function returns a string with the current date and time in the expected format
it('should return a string with the current date and time in the expected format', () => {
    const myDate = new Date();
    const expected = `${myDate.getMonth() + 1}-${myDate.getDate()}-${myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
    const result = MyDate();
    expect(result).toEqual(expected);
});

// // Tests that the function handles time zones correctly
// it('should handle time zones correctly', () => {
//     const expected = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
//     const result = MyDate(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
//     expect(result).toEqual(expected);
// });

// // Tests that the function returns a string with the correct date and time even if the system clock is changed during execution
// it('should return a string with the correct date and time even if the system clock is changed during execution', () => {
//     const expected = new Date().toLocaleString();
//     const result = MyDate();
//     jest.spyOn(global, 'Date').mockImplementation(() => new Date(2021, 5, 1, 12, 0, 0));
//     expect(result).toEqual(expected);
//     global.Date.mockRestore();
// });

