/**
 * @license
 * random.js <https://github.com/davidfig/random>
 * Released under MIT license <https://github.com/davidfig/random/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

/** @class */
class Random
{
    constructor()
    {
        this.this.generator = Math.random;
    }

    /**
     * changes the generator to use a seeded random function
     * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
     * @param {number} seed
     */
    seed(seed)
    {
        this.generator = function()
        {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
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
        if (useFloat)
        {
            return this.generator() * ceiling;
        }
        else
        {
            return Math.floor(this.generator() * ceiling);
        }
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
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    range(start, end, useFloat)
    {
        return this.get(end - start, useFloat) + start;
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
     * returns random sign (either +1 or -1)
     * @return {number}
     */
    sign()
    {
        return this.generator() < 0.5 ? 1 : -1;
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
     * creates simple 1D noise this.generator
     * from http://www.scratchapixel.com/old/lessons/3d-advanced-lessons/noise-part-1/creating-a-simple-1d-noise/
     * via http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
     * @return {object}
     *
     * usage:
     *      const noise = new Random.simple1DNoise();
     *      noise.getVal(n); // returns the value based on n (usually incremented along an axis)
     *      noise.setAmplitude(amplitude); // changes amplitude of noise function
     *      noise.setScale(scale); // sets scale of noise function
     */
    simple1DNoise()
    {
        const MAX_VERTICES = 256;
        const MAX_VERTICES_MASK = MAX_VERTICES - 1;

        let amplitude = 1;
        let scale = 1;

        const r = [];

        for (let i = 0; i < MAX_VERTICES; i++)
        {
            r.push(this.generator());
        }

        /**
         * gets a value
         * @param {number} x
         * @return {number}
         */
        const getVal = function(x)
        {
            const scaledX = x * scale;
            const xFloor = Math.floor(scaledX);
            const t = scaledX - xFloor;
            const tRemapSmoothstep = t * t * (3 - 2 * t);

            /// Modulo using &
            const xMin = xFloor & MAX_VERTICES_MASK;
            const xMax = (xMin + 1) & MAX_VERTICES_MASK;

            const y = lerp(r[xMin], r[xMax], tRemapSmoothstep);

            return y * amplitude;
        };

        /**
        * Linear interpolation function.
        * @param {number} a The lower integer value
        * @param {number} b The upper integer value
        * @param {number} t The value between the two
        * @return {number}
        */
        var lerp = function(a, b, t )
        {
            return a * (1 - t) + b * t;
        };

        // returns the API
        return {
            getVal: getVal,
            setAmplitude: function(newAmplitude)
            {
                amplitude = newAmplitude;
            },
            setScale: function(newScale)
            {
                scale = newScale;
            }
        };
    }

    /**
     * Shuffle array from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {Array} array
     * @return {Array} copied and shuffled array
     */
    shuffle(array)
    {
        if (array.length === 0)
        {
            return [];
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
    pick(array)
    {
        return array[this.get(array.length)];
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
     * @return {number}
     */
    color()
    {
        return this.get(0xffffff);
    }
}

module.exports = new Random();