/*** Generates a Universally Unique Identifier (UUID).
 *
 * @returns {string} The generated UUID.
 */export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const n = Math.random() * 16 | 0;
        const e = c === 'x' ? n : (n & 0x3 | 0x8);
        return e.toString(16);
    });
}