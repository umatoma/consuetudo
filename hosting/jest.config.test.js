module.exports = {
    "preset": "ts-jest",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "setupFilesAfterEnv": [
        "./src/setUpTest.ts"
    ],
    "testMatch": [
        "**/?(*.)(spec|test).ts?(x)"
    ]
};
