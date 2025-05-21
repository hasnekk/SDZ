import { isTerminValid } from '../../../src/services/termin.service.js';

describe('Termin business rule', () => {
  it('scheduled u prošlosti NIJE valjan', () => {
    expect(isTerminValid({ datum: '2020-01-01', status: 'scheduled' })).toBe(false);
  });
  it('completed u prošlosti JE valjan', () => {
    expect(isTerminValid({ datum: '2020-01-01', status: 'completed' })).toBe(true);
  });
});
