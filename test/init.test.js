const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

apiFirstRequest = [
    {
        title: "Dolphins Lose Again!",
        url: "www.url.com/dolphins-lose-again",
        pubDate: "12-12-12",
        thumbnail: "efgh.png",
        author: ""
    },
    {
        title: "The Bears Still Suck",
        url: "www.url.com/the-bears-still-suck",
        pubDate: "12-12-12",
        thumbnail: "abcd.png",
        author: ""
    }
]

apiSecondRequest = [
    {
        title: "The Bears Still Suck",
        url: "www.url.com",
        pubDate: "12-12-12",
        thumbnail: "abcd.png",
        author: ""
    },
    {
        title: "Tom Brady Wants To Play Another Year",
        url: "www.url.com/tom-brady-wants-to-play-another-year",
        pubDate: "12-12-12",
        thumbnail: "kdks.png",
        author: ""
    }
]

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


//DATABASE tests
describe("")

describe("Insert article object successfully", async () => {

})

describe('Check Database For Identical Article Titles', async () => {

});