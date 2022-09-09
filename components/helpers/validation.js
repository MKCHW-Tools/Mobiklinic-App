
    export const validateAlphaNum = input => {
        let pattern = /([a-zA-Z])\w+/ig
        return pattern.test(input)
    }

    export const validateNumber = input => {
        let pattern = /(^[\d])\w+/g
        return pattern.test(input)
    }

    export const validateUgandaPhoneNumber = input => {
        let pattern = /(?:(256))(3|4|7)\d{2}\d{6}/
        return pattern.test(input)
    }

    export const validateEmail = input => {
        let pattern = /^\S+@\S+[\.][0-9a-z]+$/
        return pattern.test(input)
    }

    export const validatePassword = input => {
        let pattern = /^(?=.{8,32})(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
        return pattern.test(input)
    }

    export const similarPasswords = (input1, input2) => input1 === input2
