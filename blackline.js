const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;

const USERNAME = process.env.LT_USERNAME;
const KEY = process.env.LT_ACCESS_KEY;
const GRID_HOST = 'hub.lambdatest.com/wd/hub';

async function pdfWebTest(runNumber) {
  const capabilities = {
    browserName: 'MicrosoftEdge',
    browserVersion: '118.0',
    'LT:Options': {
      build: `Sequential Test Run - ${new Date().toISOString().slice(0,10)}`,
      name: `Gateway.E2E.Run-${runNumber}`,
      platformName: 'Windows 10',
      resolution: '1920x1080',
      console: true,
      network: true,
      video: true,
      visual: true,
      idleTimeout: 360,
      tunnel: false,
      w3c: true,
      project: 'Build-With-LambdaTest',
      plugin: 'NodeJS',
    },
  };

  const gridUrl = `https://${USERNAME}:${KEY}@${GRID_HOST}`;
  const driver = new webdriver.Builder().usingServer(gridUrl).withCapabilities(capabilities).build();

  try {
    console.log(`🚀 [${runNumber}] Starting test...`);
    await driver.get('https://example.com');
    await driver.wait(until.titleContains('Example Domain'), 10000);
    console.log(`✅ [${runNumber}] Test passed.`);
    await driver.executeScript('lambda-status=passed');
  } catch (err) {
    console.error(`❌ [${runNumber}] Test failed:`, err.message);
    await driver.executeScript('lambda-status=failed');
  } finally {
    await driver.quit();
  }
}

// Run 20 tests sequentially
(async () => {
  for (let i = 1; i <= 20; i++) {
    console.log(`\n============================`);
    console.log(`▶️  Running test #${i}`);
    console.log(`============================\n`);
    await pdfWebTest(i);
  }
  console.log('\n🎉 All 20 sequential tests completed.');
})();
