
import { formatToUsd } from '../../utils/currencyFormatter.helper';

describe('formatToUsd() helper function', () => {
    test('should format a number to USD currency format', () => {
        // Test with a positive number
        expect(formatToUsd(1234)).toBe('$1,234.00');

        // Test with a negative number
        expect(formatToUsd(-1234)).toBe('-$1,234.00');

        // Test with a string representing a number
        expect(formatToUsd('5678')).toBe('$5,678.00');

        // Test with a string representing a negative number
        expect(formatToUsd('-5678')).toBe('-$5,678.00');

        // Test with a string representing a number with decimals
        expect(formatToUsd('1234.56')).toBe('$1,234.56');

        // Test with zero
        expect(formatToUsd(0)).toBe('$0.00');

        // Test with an invalid input
        expect(formatToUsd('abc')).toBe('$NaN');
    });

});