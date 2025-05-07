// app/backend/sum.test.js
const sum = require('../sum'); // Adjust path if using __tests__ folder

describe('sum module', () => {
  it('should add two numbers correctly', () => {
    // Arrange (set up input)
    const a = 1;
    const b = 2;

    // Act (call the function)
    const result = sum(a, b);

    // Assert (check the result)
    expect(result).toBe(3);
  });

  it('should add negative numbers correctly', () => {
    expect(sum(-1, -5)).toBe(-6);
  });
});
