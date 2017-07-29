/**
 * @file random.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/random}
 */

const seedrandom = require('seedrandom');

/** a javascript random number API with seeded support. not cryptographically sound. useful for games */
class Random
{
    constructor()
    {
        this.generator = Math.random;
    }

    /**
     * generates a seeded number
     * @param {number} seed
     * @param {object} [options]
     * @param {string} [PRNG="alea"] - name of algorithm, see https://github.com/davidbau/seedrandom
     * @param {boolean} [save=true] 
     */
    seed(seed, options)
    {
        options = options || {};
        this.generator = seedrandom[options.PRNG || 'alea'](seed, { state: options.state });
        this.options = options;
    }

    /**
     * saves the state of the random generator ()
     * @returns {number} state
     */
    save()
    {
        if (this.generator !== Math.random)
        {
            return this.generator.state();
        }
    }

    restore(state)
    {
        if (this.generator !== Math.random)
        {
            this.generator = seedrandom[this.options.PRNG || 'alea']('', { state });
        }
    }

    /**
     * changes the generator to use the old Math.sin-based random function
     * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
     * (deprecated) Use only for compatibility purposes
     * @param {number} seed
     */
    seedOld(seed)
    {
        this.generator = function()
        {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }

    /**
     * create a separate random generator using the seed
     * @param {number} seed
     * @return {object}
     */
    separateSeed(seed)
    {
        const random = new Random();
        random.seed(seed);
        return random;
    }

    /*
    // future work to replace Math.sin seed generator with an XOR generator
    // changes the this.generator to use a seeded random based on XOR
    // see http://baagoe.com/en/RandomMusings/javascript/ (https://web.archive.org/web/20101106000458/http://baagoe.com/en/RandomMusings/javascript/)
    // as seen here: http://jsdo.it/akm2/amk0
    seedXORshift(seed)
    {
        mash(data)
        {
            data = data.toString();
            var n = 0xefc8249d;
            for (var i = 0; i < data.length; i++)
            {
                n += data.charCodeAt(i);
                var h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000;
            }
            return (n >>> 0) * 2.3283064365386963e-10;
        }

        this.generator = function()
        {
            var self = this;
            var seeds = (arguments.length) ? Array.prototype.slice.call(arguments) : [new Date().getTime()];

            var x = 123456789;
            var y = 362436069;
            var z = 521288629;
            var w = 88675123;
            var v = 886756453;

            self.uint32 = function()
            {
                var t = (x ^ (x >>> 7)) >>> 0;
                x = y;
                y = z;
                z = w;
                w = v;
                v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
                return ((y + y + 1) * v) >>> 0;
            };

            self.random = function() {
                return self.uint32() * 2.3283064365386963e-10;
            };

            self.fract53 = function() {
                return self.random() + (self.uint32() & 0x1fffff) * 1.1102230246251565e-16;
            };

            for (var i = 0, len = seeds.length, seed; i < len; i++) {
                seed = seeds[i];
                x ^= mash(seed) * 0x100000000;
                y ^= mash(seed) * 0x100000000;
                z ^= mash(seed) * 0x100000000;
                v ^= mash(seed) * 0x100000000;
                w ^= mash(seed) * 0x100000000;
            }
    }
    */

    /**
     * resets the random number this.generator to Math.random()
     */
    reset()
    {
        this.generator = Math.random;
    }

    /**
     * returns a random number using the this.generator between [0, ceiling - 1]
     * @param {number} ceiling
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    get(ceiling, useFloat)
    {
        const negative = ceiling < 0 ? -1 : 1;
        ceiling *= negative;
        let result;
        if (useFloat)
        {
            result = this.generator() * ceiling;
        }
        else
        {
            result = Math.floor(this.generator() * ceiling);
        }
        return result * negative;
    }

    /**
     * returns a random integer between 0 - Number.MAX_SAFE_INTEGER
     * @return {number}
     */
    getHuge()
    {
        return this.get(Number.MAX_SAFE_INTEGER);
    }

    /**
     * random number [middle - range, middle + range]
     * @param {number} middle
     * @param {number} delta
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    middle(middle, delta, useFloat)
    {
        const half = delta / 2;
        return this.range(middle - half, middle + half, useFloat);
    }

    /**
     * random number [start, end]
     * @param {number} start
     * @param {number} end
     * @param {boolean} [useFloat=false] if true, then range is (start, end)--i.e., not inclusive to start and end
     * @return {number}
     */
    range(start, end, useFloat)
    {
        // case where theres is no range
        if (end === start)
        {
            return end;
        }

        if (useFloat)
        {
            return this.get(end - start, true) + start;
        }
        else
        {
            let range;
            if (start < 0 && end > 0)
            {
                range = -start + end + 1;
            }
            else if (start === 0 && end > 0)
            {
                range = end + 1;
            }
            else if (start < 0 && end === 0)
            {
                range = start - 1;
                start = 1;
            }
            else if (start < 0 && end < 0)
            {
                range = end - start - 1;
            }
            else
            {
                range = end - start + 1;
            }
            return Math.floor(this.generator() * range) + start;
        }
    }

    /**
     * an array of random numbers between [start, end]
     * @param {number} start
     * @param {number} end
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    rangeMultiple(start, end, count, useFloat)
    {
        var array = [];
        for (var i = 0; i < count; i++)
        {
            array.push(this.range(start, end, useFloat));
        }
        return array;
    }

    /**
     * an array of random numbers between [middle - range, middle + range]
     * @param {number} middle
     * @param {number} range
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    middleMultiple(middle, range, count, useFloat)
    {
        const array = [];
        for (let i = 0; i < count; i++)
        {
            array.push(middle(middle, range, useFloat));
        }
        return array;
    }


    // THIS DOES NOT WORK PROPERLY . . . (shoule be replaced with an algorithm from https://github.com/ckknight/random-js)
    // returns a uniform distribution random integer using the this.generator between [0, ceiling - 1]
    // uniform(ceiling)
    // {
    //     return Math.floor(this.generator() * ceiling);
    // }

    //
    /**
     * @param {number} [chance=0.5]
     * returns random sign (either +1 or -1)
     * @return {number}
     */
    sign(chance)
    {
        chance = chance || 0.5;
        return this.generator() < chance ? 1 : -1;
    }

    //
    /**
     * tells you whether a random chance was achieved
     * @param {number} [percent=0.5]
     * @return {boolean}
     */
    chance(percent)
    {
        return this.generator() < (percent || 0.5);
    }

    /**
     * returns a random angle in radians [0 - 2 * Math.PI)
     */
    angle()
    {
        return this.get(Math.PI * 2, true);
    }

    /**
     * Shuffle array (either in place or copied)
     * from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {Array} array
     * @param {boolean} [copy=false] whether to shuffle in place (default) or return a new shuffled array
     * @return {Array} a shuffled array
     */
    shuffle(array, copy)
    {
        if (copy)
        {
            array = array.slice();
        }
        if (array.length === 0)
        {
            return array;
        }

        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex)
        {
            // Pick a remaining element...
            randomIndex = this.get(currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    /**
     * picks a random element from an array
     * @param {Array} array
     * @return {*}
     */
    pick(array, remove)
    {
        if (!remove)
        {
            return array[this.get(array.length)];
        }
        else
        {
            const pick = this.get(array.length);
            const temp = array[pick];
            array.splice(pick, 1);
            return temp;
        }
    }

    /**
     * returns a random property from an object
     * from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
     * @param {object} obj
     * @return {*}
     */
    property(obj)
    {
        var result;
        var count = 0;
        for (var prop in obj)
        {
            if (this.chance(1 / ++count))
            {
                result = prop;
            }
        }
        return result;
    }

    /**
     * creates a random set where each entry is a value between [min, max]
     * @param {number} min
     * @param {number} max
     * @param {number} amount of numbers in set
     * @param {number[]}
     */
    set(min, max, amount)
    {
        var set = [], all = [], i;
        for (i = min; i < max; i++)
        {
            all.push(i);
        }

        for (i = 0; i < amount; i++)
        {
            var found = this.get(all.length);
            set.push(all[found]);
            all.splice(found, 1);
        }
        return set;
    }


    /**
     * returns a set of numbers with a randomly even distribution (i.e., no overlapping and filling the space)
     * @param {number} start position
     * @param {number} end position
     * @param {number} count of non-start/end points
     * @param {boolean} [includeStart=false] includes start point (count++)
     * @param {boolean} [includeEnd=false] includes end point (count++)
     * @param {boolean} [useFloat=false]
     * @param {number[]}
     */
    distribution(start, end, count, includeStart, includeEnd, useFloat)
    {
        var interval = Math.floor((end - start) / count);
        var halfInterval = interval / 2;
        var quarterInterval = interval / 4;
        var set = [];
        if (includeStart)
        {
            set.push(start);
        }
        for (var i = 0; i < count; i++)
        {
            set.push(start + i * interval + halfInterval + this.range(-quarterInterval, quarterInterval, useFloat));
        }
        if (includeEnd)
        {
            set.push(end);
        }
        return set;
    }

    /**
     * returns a random number based on weighted probability between [min, max]
     * from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
     * @param {number} min value
     * @param {number} max value
     * @param {number} target for average value
     * @param {number} stddev - standard deviation
     */
    weightedProbabilityInt(min, max, target, stddev)
    {
        function normRand()
        {
            let x1, x2, rad;
            do
            {
                x1 = 2 * this.get(1, true) - 1;
                x2 = 2 * this.get(1, true) - 1;
                rad = x1 * x1 + x2 * x2;
            } while (rad >= 1 || rad === 0);
            const c = Math.sqrt(-2 * Math.log(rad) / rad);
            return x1 * c;
        }

        stddev = stddev || 1;
        if (Math.random() < 0.81546)
        {
            while (true)
            {
                const sample = ((normRand() * stddev) + target);
                if (sample >= min && sample <= max)
                {
                    return sample;
                }
            }
        }
        else
        {
            return this.range(min, max);
        }
    }

    /*
     * returns a random hex color (0 - 0xffffff)
     * this provides very bad random colors; use davidfig/color (npm yy-color) for better random colors
     * @return {number}
     */
    color()
    {
        return this.get(0xffffff);
    }
}

module.exports = new Random();