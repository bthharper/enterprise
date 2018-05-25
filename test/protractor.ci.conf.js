/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const protractorImageComparison = require('protractor-image-comparison');

const getSpecs = (listSpec) => {
  if (listSpec) {
    return listSpec.split(',');
  }

  return ['components/**/*.e2e-spec.js', 'kitchen-sink.e2e-spec.js'];
};

const theme = process.env.ENTERPRISE_THEME || 'light'

exports.config = {
  params: {
    theme
  },
  allScriptsTimeout: 12000,
  logLevel: 'INFO',
  specs: getSpecs(process.env.PROTRACTOR_SPECS),
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://master-enterprise.demo.design.infor.com',
  jasmineNodeOpt: {
    defaultTimeoutInterval: 10000,
    showColors: true,
    random: false
  },
  commonCapabilities: {
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
    'browserstack.debug': false,
    'browserstack.video' : 'false',
    'browserstack.local': false,
    'browserstack.selenium_version': '3.11.0',
    'browserstack.networkLogs' : false,
    build: `${theme} theme: ci e2e`,
    name: `${theme} theme ci e2e tests`
  },
  multiCapabilities: [
    {
      browserName: 'Chrome',
      browser_version: '66.0',
      resolution: '1280x800',
      os_version: '10',
      os: 'Windows'
    },
    {
     browserName: 'Chrome',
     browser_version : '66.0',
     os: 'OS X',
     os_version: 'High Sierra',
     resolution: '1280x960'
    }
  ],
  onPrepare: () => {
    global.requireHelper = (filename) => require(`${basePath}/helpers/${filename}.js`);
    browser.ignoreSynchronization = true;
    browser.protractorImageComparison = new protractorImageComparison({
      baselineFolder: `${basePath}/baseline`,
      screenshotPath: `${basePath}/.tmp/`,
      autoSaveBaseline: false,
      ignoreAntialiasing: true,
      debug: false
    });

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: true }
    }));

    return browser.getProcessedConfig().then((cap) => {
      browser.browserName = cap.capabilities.browserName.toLowerCase();
      if (browser.browserName === 'chrome') {
        return browser.driver.manage().window().setSize(1200, 800);
      }
    });
  }
};

exports.config.multiCapabilities.forEach((caps) => {
  for (const i in exports.config.commonCapabilities) {
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
  }
});
