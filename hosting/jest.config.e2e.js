module.exports = {
    "preset": "jest-puppeteer",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "testMatch": [
        "**/?(*.)(e2e).ts?(x)"
    ],
    "transform": {
        "^.+\\.ts?(x)$": "ts-jest"
    }
};
