# random
random number API for javascript, including basic (and unsecure) seeded random number


var generator = Math.random;

/**
 * create a seeded random function
 * from: http://stackoverflow.com/questions/521295/javascript-random-seeds
 * @param {number} seed
 */
function seed(seed)
{
    generator = function() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
}

/**
 * resets the random number generator to Math.random()
 */
function reset()
{
    generator = Math.random;
}

/**
 * returns a random number using the generator between [0, ceiling - 1]
 * @param  {number} ceiling
 * @param  {boolean} useFloat
 * @return {number} random number
 */
function get(ceiling, useFloat)
{
    if (useFloat)
    {
        return generator() * ceiling;
    }
    else
    {
        return Math.round(generator() * ceiling);
    }
}

/**
 * random int number [middle - range, middle + range]
 * @param  {number} middle
 * @param  {number} range
 * @param  {boolean} useFloat
 * @return {number}
 */
function middle(middle, range, useFloat)
{
    var half = range / 2;
    return range(middle - half, middle + half, useFloat);
},

/**
 * random int number [start, end]
 * @param  {number} start
 * @param  {number} end
 * @param  {boolean} useFloat
 * @return {number}
 */
function range(start, end, useFloat)
{
    return get(end - start + 1, useFloat) + start;
}

/**
 * multiple random numbers between [start, end]
 * @param  {number} start
 * @param  {number} end
 * @param  {number} count
 * @param  {number} useFloat
 * @return {number[]}
 */
function rangeMultiple(start, end, count, useFloat)
{
    var array = [];
    for (var i = 0; i < count; i++)
    {
        array.push(range(start, end, useFloat));
    }
    return array;
}

/**
 * multiple random numbers between [middle - range, middle + range]
 * @param  {number} middle
 * @param  {number} range
 * @param  {number} count
 * @return {number[]}
 */
function middleMultiple(middle, range, count, useFloat)
{
    var array = [];
    for (var i = 0; i < count; i++)
    {
        array.push(plusMinus(middle, range, useFloat));
    }
    return array;
}

/**
 * returns a uniform random integer using the generator between [0, ceiling - 1]
 * @param  {number} ceiling
 * @return {number} random number
 */
function uniform(ceiling)
{
    return Math.floor(generator() * ceiling);
}

/**
 * returns random sign
 * @returns {number} either +1 or -1
 */
function sign()
{
    return generator() < 0.5 ? 1 : -1;
}

/**
 * tells you whether a random chance was achieved; defaults to 50%
 * @param {number} percent (either [0-1] or [0 - 100]), use 1.001 for 1% chance
 * @return {boolean} true or false based on the change percentage
 */
function chance(percent)
{
    percent = percent || 0.5;
    percent = percent > 1 ? percent / 100 : percent;
    return generator() < percent;
}

/**
 * returns a random angle in radians [0 - 2 * Math.PI)
 */
function angle()
{
    return get(Math.PI * 2, true);
}

/**
 * creates simple 1D noise generator
 * 	from http://www.scratchapixel.com/old/lessons/3d-advanced-lessons/noise-part-1/creating-a-simple-1d-noise/
 * 	via http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
 *
 *  usage:
 *    var noise = new Random.simple1DNoise();
 *    noise.getVal(n) // returns the value based on n (usually incremented along an axis)
 *    noise.setAmplitude(amplitude) // changes amplitude of noise function
 *    noise.setScale(scale) // sets scale of noise function
 */
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

/**
 * Shuffle array from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param  {array} array
 * @return {array} copy of the array shuffled
 */
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
        randomIndex = int(currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/** picks a random element from an array
 * @param  {array} array
 * @return {*} element from array
 */
function pick(array)
{
    return array[get(array.length)];
}

/**
 * returns a random property from an object
 * from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
 * @param  {object} obj
 * @return {*}
 */
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

/**
 * create a random set
 * @param {number} min number to include in set
 * @param {number} max number to include in set
 * @return {array}
 */
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

/**
 * returns a set of numbers with a randomly even distribution (i.e., no overlapping and filling the space)
 * @param  {number} start position
 * @param  {number} end position
 * @param  {number} count of non-start/end points
 * @param  {boolean} includeStart point (increases count by 1)
 * @param  {boolean} includeEnd point (increases count by 2)
 * @return {number[]}
 */
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

/**
 * taken from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
 * @param {number} min minimum value
 * @param {number} max maximum value
 * @param {target} target for average value
 * @param {stddev} stddev standard deviation
 * @return {number} a random number based on weighted probability
 */
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