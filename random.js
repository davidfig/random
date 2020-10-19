// yy-random
// by David Figatner
// MIT license
// copyright YOPEY YOPEY LLC 2016-17
// https://github.com/davidfig/random

const seedrandom = require('seedrandom')

class Random {
    constructor() {
        this.generator = Math.random
    }

    /**
     * generates a seeded number
     * @param {number} seed
     * @param {object} [options]
     * @param {string} [PRNG="alea"] - name of algorithm, see https://github.com/davidbau/seedrandom
     * @param {(boolean|string)} [state] - can include the state returned from save()
     */
    seed(seed, options) {
        options = options || {}
        this.generator = seedrandom[options.PRNG || 'alea'](seed, { state: options.state })
        this.options = options
    }

    /**
     * saves the state of the random generator
     * can only be used after Random.seed() is called with options.state = true
     * @returns {number} state
     */
    save() {
        if (this.generator !== Math.random) {
            return this.generator.state()
        }
    }

    /**
     * restores the state of the random generator
     * @param {number} state
     */
    restore(state) {
        this.generator = seedrandom[this.options.PRNG || 'alea']('', { state })
    }

    /**
     * changes the generator to use the old Math.sin-based random function
     * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
     * (deprecated) Use only for compatibility purposes
     * @param {number} seed
     */
    seedOld(seed) {
        this.generator = function() {
            const x = Math.sin(seed++) * 10000
            return x - Math.floor(x)
        }
    }

    /**
     * create a separate random generator using the seed
     * @param {number} seed
     * @return {object}
     */
    separateSeed(seed) {
        const random = new Random()
        random.seed(seed)
        return random
    }

    /**
     * resets the random number this.generator to Math.random()
     */
    reset() {
        this.generator = Math.random
    }

    /**
     * returns a random number using the this.generator between [0, ceiling - 1]
     * @param {number} ceiling
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    get(ceiling, useFloat) {
        const negative = ceiling < 0 ? -1 : 1
        ceiling *= negative
        let result
        if (useFloat) {
            result = this.generator() * ceiling
        } else {
            result = Math.floor(this.generator() * ceiling)
        }
        return result * negative
    }

    /**
     * returns a random integer between 0 - Number.MAX_SAFE_INTEGER
     * @return {number}
     */
    getHuge() {
        return this.get(Number.MAX_SAFE_INTEGER)
    }

    /**
     * random number [middle - range, middle + range]
     * @param {number} middle
     * @param {number} delta
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    middle(middle, delta, useFloat) {
        const half = delta / 2
        return this.range(middle - half, middle + half, useFloat)
    }

    /**
     * random number [start, end]
     * @param {number} start
     * @param {number} end
     * @param {boolean} [useFloat=false] if true, then range is (start, end)--i.e., not inclusive to start and end
     * @return {number}
     */
    range(start, end, useFloat) {
        // case where there is no range
        if (end === start) {
            return end
        }

        if (useFloat) {
            return this.get(end - start, true) + start
        } else {
            let range
            if (start < 0 && end > 0) {
                range = -start + end + 1
            } else if (start === 0 && end > 0) {
                range = end + 1
            } else if (start < 0 && end === 0) {
                range = start - 1
                start = 1
            } else if (start < 0 && end < 0) {
                range = end - start - 1
            } else {
                range = end - start + 1
            }
            return Math.floor(this.generator() * range) + start
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
    rangeMultiple(start, end, count, useFloat) {
        var array = []
        for (let i = 0; i < count; i++) {
            array.push(this.range(start, end, useFloat))
        }
        return array
    }

    /**
     * an array of random numbers between [middle - range, middle + range]
     * @param {number} middle
     * @param {number} range
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    middleMultiple(middle, range, count, useFloat) {
        const array = []
        for (let i = 0; i < count; i++) {
            array.push(middle(middle, range, useFloat))
        }
        return array
    }

    /**
     * @param {number} [chance=0.5]
     * returns random sign (either +1 or -1)
     * @return {number}
     */
    sign(chance) {
        chance = chance || 0.5
        return this.generator() < chance ? 1 : -1
    }

    /**
     * tells you whether a random chance was achieved
     * @param {number} [percent=0.5]
     * @return {boolean}
     */
    chance(percent) {
        return this.generator() < (percent || 0.5)
    }

    /**
     * returns a random angle in radians [0 - 2 * Math.PI)
     */
    angle() {
        return this.get(Math.PI * 2, true)
    }

    /**
     * Shuffle array (either in place or copied)
     * from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {Array} array
     * @param {boolean} [copy=false] whether to shuffle in place (default) or return a new shuffled array
     * @return {Array} a shuffled array
     */
    shuffle(array, copy) {
        if (copy) {
            array = array.slice()
        }
        if (array.length === 0) {
            return array
        }

        let currentIndex = array.length, temporaryValue, randomIndex

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = this.get(currentIndex)
            currentIndex -= 1

            // And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }
        return array
    }

    /**
     * picks a random element from an array
     * @param {Array} array
     * @return {*}
     */
    pick(array, remove) {
        if (!remove) {
            return array[this.get(array.length)]
        } else {
            const pick = this.get(array.length)
            const temp = array[pick]
            array.splice(pick, 1)
            return temp
        }
    }

    /**
     * returns a random property from an object
     * from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
     * @param {object} obj
     * @return {*}
     */
    property(obj) {
        var result
        var count = 0
        for (var prop in obj) {
            if (this.chance(1 / ++count)) {
                result = prop
            }
        }
        return result
    }

    /**
     * creates a random set where each entry is a value between [min, max]
     * @param {number} min
     * @param {number} max
     * @param {number} amount of numbers in set
     * @param {number[]}
     */
    set(min, max, amount) {
        var set = [], all = [], i
        for (i = min; i < max; i++) {
            all.push(i)
        }

        for (i = 0; i < amount; i++) {
            var found = this.get(all.length)
            set.push(all[found])
            all.splice(found, 1)
        }
        return set
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
    distribution(start, end, count, includeStart, includeEnd, useFloat) {
        var interval = Math.floor((end - start) / count)
        var halfInterval = interval / 2
        var quarterInterval = interval / 4
        var set = []
        if (includeStart) {
            set.push(start)
        }
        for (var i = 0; i < count; i++) {
            set.push(start + i * interval + halfInterval + this.range(-quarterInterval, quarterInterval, useFloat))
        }
        if (includeEnd) {
            set.push(end)
        }
        return set
    }

    /**
     * returns a random number based on weighted probability between [min, max]
     * from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
     * @param {number} min value
     * @param {number} max value
     * @param {number} target for average value
     * @param {number} stddev - standard deviation
     */
    weightedProbabilityInt(min, max, target, stddev) {
        function normRand() {
            let x1, x2, rad
            do {
                x1 = 2 * this.get(1, true) - 1
                x2 = 2 * this.get(1, true) - 1
                rad = x1 * x1 + x2 * x2
            } while (rad >= 1 || rad === 0)
            const c = Math.sqrt(-2 * Math.log(rad) / rad)
            return x1 * c
        }

        stddev = stddev || 1
        if (Math.random() < 0.81546) {
            while (true) {
                const sample = ((normRand() * stddev) + target)
                if (sample >= min && sample <= max) {
                    return sample
                }
            }
        } else {
            return this.range(min, max)
        }
    }

    /**
     * returns a random number within a circle with a normal distribution
     * from https://stackoverflow.com/a/5838055/1955997
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {bool} [float]
     * @returns {number[]} [x, y]
     */
    circle(x, y, radius, float) {
        const t = this.angle()
        const u = this.get() + this.get()
        const r = u > 1 ? 2 - u : u
        if (float) {
            return [x + r * Math.cos(t) * radius, y + r * Math.sin(t) * radius]
        } else {
            return [Math.round(x + r * Math.cos(t) * radius), Math.round(y + r * Math.sin(t) * radius)]
        }
    }

    /*
     * returns a random hex color (0 - 0xffffff)
     * @return {number}
     */
    color() {
        return this.get(0xffffff)
    }
}

module.exports = new Random()