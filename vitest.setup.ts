import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toHaveValue(value: string | number): T;
    toBeDisabled(): T;
    toHaveTextContent(text: string | RegExp): T;
  }
}

afterEach(() => {
  cleanup();
});