/**
 * @file Unit tests for the math utility functions using Vitest.
 * Validates basic arithmetic operations including positive and negative numbers.
 */

import { expect, test } from 'vitest';
import { add } from './math';

test('addiert 1 + 2 und ergibt 3', () => {
  // Das Ergebnis der Funktion
  const result = add(1, 2);

  // Die Erwartung (Assertion)
  expect(result).toBe(3);
});

test('funktioniert auch mit negativen Zahlen', () => {
  expect(add(-1, 5)).toBe(4);
});