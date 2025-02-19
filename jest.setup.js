import '@testing-library/jest-dom';

class ResizeObserver {
  constructor(callback) { }
  observe() { }
  unobserve() { }
  disconnect() { }
};

global.ResizeObserver = ResizeObserver;
global.$ = require('jquery');

// Set the window API key values for tests.
global.window.finModelPrepAPIKeyOne = 'dummy_key_one';
global.window.finModelPrepAPIKeyTwo = 'dummy_key_two';
global.window.finModelPrepAPIKeyThree = 'dummy_key_three';
global.window.finModelPrepAPIKeyFour = 'dummy_key_four';
global.window.finModelPrepAPIKeyFive = 'dummy_key_five';
global.window.finModelPrepAPIKeySix = 'dummy_key_six';
global.window.finModelPrepAPIKeySeven = 'dummy_key_seven';
global.window.finModelPrepAPIKeyEight = 'dummy_key_eight';
global.window.finModelPrepAPIKeyNine = 'dummy_key_nine';

global.window.alphaVantageAPIKeyOne = 'dummy_alpha_key_one';
global.window.alphaVantageAPIKeyTwo = 'dummy_alpha_key_two';
global.window.alphaVantageAPIKeyThree = 'dummy_alpha_key_three';
global.window.alphaVantageAPIKeyFour = 'dummy_alpha_key_four';
global.window.alphaVantageAPIKeyFive = 'dummy_alpha_key_five';
global.window.alphaVantageAPIKeySix = 'dummy_alpha_key_six';
global.window.alphaVantageAPIKeySeven = 'dummy_alpha_key_seven';
global.window.alphaVantageAPIKeyEight = 'dummy_alpha_key_eight';
global.window.alphaVantageAPIKeyNine = 'dummy_alpha_key_nine';
global.window.alphaVantageAPIKeyTen = 'dummy_alpha_key_ten';

global.window.newsAPIKey = 'dummy_news_key';