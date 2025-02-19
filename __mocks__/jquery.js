const $ = {
  ajax: jest.fn(() => Promise.resolve({}))
};

module.exports = $;
