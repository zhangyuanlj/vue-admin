//请不要修改该文件，该文件会自动匹配环境配置文件
import buildConfig from '../../../../build/config.js';
import developConfig from './developConfig.js';
import testConfig from './testConfig.js';
import productConfig from './productConfig.js';
import errorMsg from './errorMsgConfig.js';
developConfig["errorMsg"] = errorMsg;
testConfig["errorMsg"] = errorMsg;
productConfig["errorMsg"] = errorMsg;
let config = {
    develop: developConfig,
    test: testConfig,
    product: productConfig
};
export default config[buildConfig.environment];