'use strict';

const expect = require('expect.js');
const Random = require('../random.js');

const count = 100;

describe('Random', () => {
    describe('get()', () => {
        it('returns a random integer between 0 and 9', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.get(10)).to.be.within(0, 9);
            }
        });
        it('returns a negative random integer between -100 and 0', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.get(-100)).to.be.within(-100, 0);
            }
        });
        it('returns a random float between 0 and 1', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.get(1, true)).to.be.within(0, 1);
            }
        });
        it('returns a random float between -10 and 0', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.get(-10, true)).to.be.within(-10, 0);
            }
        });
    });
    describe('seed()', () => {
        it('returns the same random integers when a random seed is used', () => {
            const seed = Random.get(100000);
            Random.seed(seed);
            const first = [];
            for (let i = 0; i < count; i++)
            {
                first[i] = Random.get(1000);
            }
            Random.seed(seed);
            const second = [];
            for (let i = 0; i < count; i++)
            {
                second[i] = Random.get(1000);
            }
            expect(first).to.be.eql(second);
            Random.reset();
        });
    });
    describe('middle()', () => {
        it('returns a random integer with -10 >= n >= 10', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.middle(0, 10)).to.be.within(-10, 10);
            }
        });
        it('returns a random float 25 away from 50', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.middle(50, 25, true)).to.be.within(25, 75);
            }
        });
        it('returns a random number between a negative a positive value', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.middle(25, 100)).to.be.within(-75, 125);
            }
        });
        it('returns a random number in a negative range', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.middle(-100, 20)).to.be.within(-120, -80);
            }
        });
    });
    describe('range()', () => {
        it('returns a random range in positive values', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.range(0, 100)).to.be.within(0, 100);
            }
        });
        it('returns all integers inclusively in a small range with zero', () => {
            let finds = [];
            for (let i = 0; i < count; i++)
            {
                finds[Random.range(0, 2)] = true;
            }
            expect(finds[0]).to.be.equal(true);
            expect(finds[1]).to.be.equal(true);
            expect(finds[2]).to.be.equal(true);
            expect(finds[3]).to.be(undefined);
        });
        it('returns all integers inclusively in a small range without zero', () => {
            let finds = [];
            for (let i = 0; i < count; i++)
            {
                finds[Random.range(1, 3)] = true;
            }
            expect(finds[0]).to.be(undefined);
            expect(finds[1]).to.be.equal(true);
            expect(finds[2]).to.be.equal(true);
            expect(finds[3]).to.be.equal(true);
            expect(finds[4]).to.be(undefined);
        });
        it('returns all floats inclusively in a small range with zero', () => {
            for (let i = 0; i < count; i++)
            {
                const n = Random.range(0, 3, true);
                expect(n).to.be.within(0, 3);
            }
        });
        it('returns all negatives integers inclusively in a small range with zero', () => {
            let finds = {};
            for (let i = 0; i < count; i++)
            {
                const n = Random.range(-1, 0);
                finds[n] = true;
                expect(n).to.be.within(-1, 0);
            }
            expect(finds[-2]).to.be(undefined);
            expect(finds[-1]).to.be.equal(true);
            expect(finds[0]).to.be.equal(true);
            expect(finds[1]).to.be(undefined);
        });
        it('returns a huge number between 0 and MAX_SAFE_INTEGER', () => {
            for (let i = 0; i < count; i++)
            {
                expect(Random.getHuge()).to.be.within(0, Number.MAX_SAFE_INTEGER);
            }
        });
    });
    describe('speed test', () => {
        it('time for Random.get() with Math.random()', function() {
            Random.reset();
            this.timeout(100000);
            for (let i = 0; i < 100000; i++)
            {
                expect(Random.getHuge()).to.be.within(0, Number.MAX_SAFE_INTEGER);
            }
        });
        it('time for Random.get() with sin random function', function() {
            Random.seed(1);
            this.timeout(100000);
            for (let i = 0; i < 100000; i++)
            {
                expect(Random.getHuge()).to.be.within(0, Number.MAX_SAFE_INTEGER);
            }
        });
    });
    describe('shuffle test', () => {
        it('shuffle array, copy=false', function() {
            Random.reset();
            const array = [0, 1, 2, 3, 4, 5];
            Random.shuffle(array, false);
            expect(array).not.eql([0, 1, 2, 3, 4, 5]);
        });
        it('shuffle array, copy=true', function() {
            Random.reset();
            const array = [0, 1, 2, 3, 4, 5];
            const newArray = Random.shuffle(array, true);
            expect(array).to.eql([0, 1, 2, 3, 4, 5]);
            expect(newArray).not.eql(array);
        });
    });
});