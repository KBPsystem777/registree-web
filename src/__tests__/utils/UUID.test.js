
import { generateUUID } from '../../utils/UUID';

describe('UUID Generation', () => {
    test('Generates a valid UUID', () => {
        const uuid = generateUUID();
        expect(typeof uuid).toBe('string');
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
