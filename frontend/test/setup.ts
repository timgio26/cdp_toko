import {afterEach,vi} from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks()
});