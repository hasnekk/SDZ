// zamijeni src/db.js testnim mockom prije nego se bilo što import-a
import { jest } from '@jest/globals';
jest.unstable_mockModule('../src/db.js', () => import('./mocks/db.mock.js'));
