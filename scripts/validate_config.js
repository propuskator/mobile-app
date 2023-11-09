/* eslint-disable */
const dotenv       = require('dotenv');
const fs           = require('fs');
const LIVR         = require('livr');
const runtimeRules = require('../.env_rules.json');
const buildRules   = require('../.build_env_rules.json');

const runtimeValidator = new LIVR.Validator(runtimeRules);
const buildValidator = new LIVR.Validator(buildRules);

let runtimeEnv = fs.readFileSync('.env', 'utf8');
let buildEnv = fs.readFileSync('.build.env', 'utf8');

runtimeEnv = runtimeEnv.replace(/export /g, '');
buildEnv = buildEnv.replace(/export /g, '');

runtimeEnv = dotenv.parse(runtimeEnv);
buildEnv = dotenv.parse(buildEnv);

if (!runtimeValidator.validate(runtimeEnv)) {
    console.log(runtimeValidator.getErrors());
    console.log();
    throw Error('Runtime config is not valid');
}
if (!buildValidator.validate(buildEnv)) {
    console.log(buildValidator.getErrors());
    console.log();
    throw Error('Build config is not valid');
}
