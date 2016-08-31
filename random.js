/**
 * @license
 * random.js <https://github.com/davidfig/random>
 * Released under MIT license <https://github.com/davidfig/random/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

// current generator
var generator = Math.random;

// changes the generator to use a seeded random function
// based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
function seed(seed)
{
    generator = function() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
}

/*
// changes the generator to use a seeded random function based on XOR
// see http://baagoe.com/en/RandomMusings/javascript/ (https://web.archive.org/web/20101106000458/http://baagoe.com/en/RandomMusings/javascript/)
// as seen here: http://jsdo.it/akm2/amk0
function seedXORshift(seed)
{
    function mash(data)
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

    generator = function()
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

// resets the random number generator to Math.random()
function reset()
{
    generator = Math.random;
}

// returns a random number using the generator between [0, ceiling - 1]
function get(ceiling, useFloat)
{
    if (useFloat)
    {
        return generator() * ceiling;
    }
    else
    {
        return Math.floor(generator() * ceiling);
    }
}


// random int number [middle - range, middle + range]
function middle(middle, delta, useFloat)
{
    var half = delta / 2;
    return range(middle - half, middle + half, useFloat);
}

// random int number [start, end]
function range(start, end, useFloat)
{
    return get(end - start, useFloat) + start;
}


// an array of random numbers between [start, end]
function rangeMultiple(start, end, count, useFloat)
{
    var array = [];
    for (var i = 0; i < count; i++)
    {
        array.push(range(start, end, useFloat));
    }
    return array;
}

// an array of random numbers between [middle - range, middle + range]
function middleMultiple(middle, range, count, useFloat)
{
    var array = [];
    for (var i = 0; i < count; i++)
    {
        array.push(middle(middle, range, useFloat));
    }
    return array;
}


// THIS DOES NOT WORK PROPERLY . . . (shoule be replaced with an algorithm from https://github.com/ckknight/random-js)
// returns a uniform distribution random integer using the generator between [0, ceiling - 1]
function uniform(ceiling)
{
    return Math.floor(generator() * ceiling);
}

// returns random sign (either +1 or -1)
function sign()
{
    return generator() < 0.5 ? 1 : -1;
}

// tells you whether a random chance was achieved; defaults to 0.5
function chance(percent)
{
    return generator() < (percent || 0.5);
}

// returns a random angle in radians [0 - 2 * Math.PI)
function angle()
{
    return get(Math.PI * 2, true);
}

// creates simple 1D noise generator
// from http://www.scratchapixel.com/old/lessons/3d-advanced-lessons/noise-part-1/creating-a-simple-1d-noise/
// via http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
//
// usage:
//  var noise = new Random.simple1DNoise();
//  noise.getVal(n) // returns the value based on n (usually incremented along an axis)
//  noise.setAmplitude(amplitude) // changes amplitude of noise function
//  noise.setScale(scale) // sets scale of noise function
function simple1DNoise()
{
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES - 1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for (var i = 0; i < MAX_VERTICES; i++)
    {
        r.push(generator());
    }

    var getVal = function(x)
    {
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * (3 - 2 * t);

        /// Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = (xMin + 1) & MAX_VERTICES_MASK;

        var y = lerp(r[xMin], r[xMax], tRemapSmoothstep);

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t )
    {
        return a * (1 - t) + b * t;
    };

    // return the API
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

// Shuffle array from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// returns copy of shuffled array
function shuffle(array)
{
    if (array.length === 0)
    {
        return [];
    }

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex)
    {
        // Pick a remaining element...
        randomIndex = get(currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// picks a random element from an array
function pick(array)
{
    return array[get(array.length)];
}

// returns a random property from an object
// from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
function property(obj)
{
    var result;
    var count = 0;
    for (var prop in obj)
    {
        if (chance(1 / ++count))
        {
            result = prop;
        }
    }
    return result;
}

// create a random set
//  min number to include in set
//  max number to include in set
function set(min, max, amount)
{
    var set = [], all = [], i;
    for (i = min; i < max; i++)
    {
        all.push(i);
    }

    for (i = 0; i < amount; i++)
    {
        var found = int(all.length);
        set.push(all[found]);
        all.splice(found, 1);
    }
    return set;
}


// returns a set of numbers with a randomly even distribution (i.e., no overlapping and filling the space)
//   start position
//   end position
//   count of non-start/end points
//   includeStart point (increases count by 1)
//   includeEnd point (increases count by 2)
function distribution(start, end, count, includeStart, includeEnd, useFloat)
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
        set.push(start + i * interval + halfInterval + range(-quarterInterval, quarterInterval, useFloat));
    }
    if (includeEnd)
    {
        set.push(end);
    }
    return set;
}

// returns a random number based on weighted probability
// from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
//      min minimum value
//      max maximum value
//      target for average value
//      stddev standard deviation
function weightedProbabilityInt(min, max, target, stddev)
{
    function normRand()
    {
        var x1, x2, rad;
        do
        {
            x1 = 2 * float() - 1;
            x2 = 2 * float() - 1;
            rad = x1 * x1 + x2 * x2;
        } while (rad >= 1 || rad === 0);
        var c = Math.sqrt(-2 * Math.log(rad) / rad);
        return x1 * c;
    }

    stddev = stddev || 1;
    if (Math.random() < 0.81546)
    {
        while (true)
        {
            var sample = ((normRand() * stddev) + target);
            if (sample >= min && sample <= max)
            {
                return sample;
            }
        }
    }
    else
    {
        return range(min, max);
    }
}

// returns a random hex color (0 - 0xffffff)
function color()
{
    return get(0xffffff);
}

var Random = {
    seed: seed,
    reset: reset,
    get: get,
    middle: middle,
    range: range,
    rangeMultiple: rangeMultiple,
    middleMultiple: middleMultiple,
    uniform: uniform,
    sign: sign,
    chance: chance,
    angle: angle,
    simple1DNoise: simple1DNoise,
    shuffle: shuffle,
    pick: pick,
    property: property,
    set: set,
    distribution: distribution,
    weightedProbabilityInt: weightedProbabilityInt,
    color: color
};

// Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd)
{
    define(function()
    {
        return {
            Random: Random
        };
    });
}

// Add support for CommonJS libraries such as browserify.
if (typeof exports !== 'undefined')
{
    module.exports = Random;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Random = Random;
}