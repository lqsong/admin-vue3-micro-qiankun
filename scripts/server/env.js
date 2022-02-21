/* eslint-disable */
const fs = require("fs");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || 'development';

function resolve (dir) {
    return path.join(__dirname, '../../', dir);// .env文件的位置，项目根目录下
}

const envFile = resolve('.env');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
    `${envFile}.${NODE_ENV}.local`,
    `${envFile}.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && `${envFile}.local`,
    envFile,
].filter(Boolean);


// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});


const reg = /^(MICRO_)/;
const raw = Object.keys(process.env).filter(key => reg.test(key)).reduce(
    (env, key) => {
    env[key] = process.env[key];
    return env;
    },{}
);

const stringified = Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key]);
    return env;
}, {});

module.exports = {
  raw,
  stringified
};
