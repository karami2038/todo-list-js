
import Validator from 'validator';

/**
 * Validation utility class providing static methods for input sanitization and date parsing.
 * @class Validation
 */
export default class Validation {

    validator = new Validator;

    static escapeControlCharacters(input) {
        if (typeof input !== 'string') {
            throw new TypeError("Input must be a string")
        }
        return input
            .replaceAll('\\', String.raw`\\`)   // Backslash
            .replaceAll('"', String.raw`\"`)    // Double quote
            .replaceAll('\b', String.raw`\\b`) // Backspace
            .replaceAll('\f', String.raw`\\f`) // Form feed
            .replaceAll('\n', String.raw`\\n`) // New line
            .replaceAll('\r', String.raw`\\r`) // Carriage return
            .replaceAll('\t', String.raw`\\t`) // Tab
            .replaceAll(/[\u0000-\u001F\u007F-\u009F]/g, (c) =>
                String.raw`\u${c.codePointAt(0).toString(16).padStart(4, '0')}` // Other control characters
            );
    };

    /**
     * Sanitize a string for use in JavaScript and JSON files.
     * @param input
     * @returns {string}
     */
    static sanitizeStringForJSON(input) {
        if (typeof input !== 'string') {
            throw new TypeError("Input must be a string")
        }
        if (!validator.isUnicode(input)) {
            throw new Error("String is not valid Unicode")
        }
        // Escape control characters
        return this.escapeControlCharacters(input);
    };

    /**
     * Parse a date string into a Date object. If the input is invalid or not provided, return the current date.
     * @param dateString
     * @returns {Date}
     */
    static parseDateOrNow(dateString) {
        if (!dateString || dateString === true) return new Date();

        if (validator.isDate(dateString, { strictMode:false })) {
            return new Date(dateString);

        } else {
            return new Date();
        }
    };
}