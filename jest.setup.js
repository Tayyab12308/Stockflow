import '@testing-library/jest-dom';

class ResizeObserver {
  constructor(callback) { }
  observe() { }
  unobserve() { }
  disconnect() { }
};

global.ResizeObserver = ResizeObserver;