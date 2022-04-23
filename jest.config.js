/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail:true,
  verbose: true,
  testMatch:["**/__test__/**/*.test.ts?(x)",],
};