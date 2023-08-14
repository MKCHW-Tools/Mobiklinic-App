module.exports = {
    preset: 'react-native',
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|react-native-fs|react-native-vector-icons|@react-native/polyfills|@react-native-async-storage/async-storage)/)"
    ],
    transformIgnorePatterns: [

        'node_modules/(?!@react-native|react-native|react-native-fs)',
    ],
    setupFiles: [
        "<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js",
        "<rootDir>/jestSetupFile.js",
        "<rootDir>/jest.setup.js",
        "<rootDir>/mocks/fileMock.js"
    ],

    moduleNameMapper: {
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",
        "\\.(css|less)$": "<rootDir>/mocks/fileMock.js"
    }
};