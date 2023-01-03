const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('Sum of two numbers', () => {
    it ('Should add two numbers then return the sum"', () => {
        x = 0;
        y = 0;

        const sumOfNumbers = (x, y) => {
            return x+y;
        }

        assert.equal(2, sumOfNumbers(1,1), `${x} + ${y} = ${sumOfNumbers(x,y)}`);
    })
})