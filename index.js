'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// yy-random
// by David Figatner
// MIT license
// copyright YOPEY YOPEY LLC 2016-17
// https://github.com/davidfig/random

var seedrandom = require('seedrandom');

var Random = function () {
    function Random() {
        _classCallCheck(this, Random);

        this.generator = Math.random;
    }

    /**
     * generates a seeded number
     * @param {number} seed
     * @param {object} [options]
     * @param {string} [PRNG="alea"] - name of algorithm, see https://github.com/davidbau/seedrandom
     * @param {boolean} [save=true]
     */


    _createClass(Random, [{
        key: 'seed',
        value: function seed(_seed, options) {
            options = options || {};
            this.generator = seedrandom[options.PRNG || 'alea'](_seed, { state: options.state });
            this.options = options;
        }

        /**
         * saves the state of the random generator
         * can only be used after Random.seed() is called
         * @returns {number} state
         */

    }, {
        key: 'save',
        value: function save() {
            if (this.generator !== Math.random) {
                return this.generator.state();
            }
        }

        /**
         * restores the state of the random generator
         * @param {number} state
         */

    }, {
        key: 'restore',
        value: function restore(state) {
            this.generator = seedrandom[this.options.PRNG || 'alea']('', { state: state });
        }

        /**
         * changes the generator to use the old Math.sin-based random function
         * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
         * (deprecated) Use only for compatibility purposes
         * @param {number} seed
         */

    }, {
        key: 'seedOld',
        value: function seedOld(seed) {
            this.generator = function () {
                var x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };
        }

        /**
         * create a separate random generator using the seed
         * @param {number} seed
         * @return {object}
         */

    }, {
        key: 'separateSeed',
        value: function separateSeed(seed) {
            var random = new Random();
            random.seed(seed);
            return random;
        }

        /**
         * resets the random number this.generator to Math.random()
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.generator = Math.random;
        }

        /**
         * returns a random number using the this.generator between [0, ceiling - 1]
         * @param {number} ceiling
         * @param {boolean} [useFloat=false]
         * @return {number}
         */

    }, {
        key: 'get',
        value: function get(ceiling, useFloat) {
            var negative = ceiling < 0 ? -1 : 1;
            ceiling *= negative;
            var result = void 0;
            if (useFloat) {
                result = this.generator() * ceiling;
            } else {
                result = Math.floor(this.generator() * ceiling);
            }
            return result * negative;
        }

        /**
         * returns a random integer between 0 - Number.MAX_SAFE_INTEGER
         * @return {number}
         */

    }, {
        key: 'getHuge',
        value: function getHuge() {
            return this.get(Number.MAX_SAFE_INTEGER);
        }

        /**
         * random number [middle - range, middle + range]
         * @param {number} middle
         * @param {number} delta
         * @param {boolean} [useFloat=false]
         * @return {number}
         */

    }, {
        key: 'middle',
        value: function middle(_middle, delta, useFloat) {
            var half = delta / 2;
            return this.range(_middle - half, _middle + half, useFloat);
        }

        /**
         * random number [start, end]
         * @param {number} start
         * @param {number} end
         * @param {boolean} [useFloat=false] if true, then range is (start, end)--i.e., not inclusive to start and end
         * @return {number}
         */

    }, {
        key: 'range',
        value: function range(start, end, useFloat) {
            // case where there is no range
            if (end === start) {
                return end;
            }

            if (useFloat) {
                return this.get(end - start, true) + start;
            } else {
                var range = void 0;
                if (start < 0 && end > 0) {
                    range = -start + end + 1;
                } else if (start === 0 && end > 0) {
                    range = end + 1;
                } else if (start < 0 && end === 0) {
                    range = start - 1;
                    start = 1;
                } else if (start < 0 && end < 0) {
                    range = end - start - 1;
                } else {
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

    }, {
        key: 'rangeMultiple',
        value: function rangeMultiple(start, end, count, useFloat) {
            var array = [];
            for (var i = 0; i < count; i++) {
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

    }, {
        key: 'middleMultiple',
        value: function middleMultiple(middle, range, count, useFloat) {
            var array = [];
            for (var i = 0; i < count; i++) {
                array.push(middle(middle, range, useFloat));
            }
            return array;
        }

        /**
         * @param {number} [chance=0.5]
         * returns random sign (either +1 or -1)
         * @return {number}
         */

    }, {
        key: 'sign',
        value: function sign(chance) {
            chance = chance || 0.5;
            return this.generator() < chance ? 1 : -1;
        }

        /**
         * tells you whether a random chance was achieved
         * @param {number} [percent=0.5]
         * @return {boolean}
         */

    }, {
        key: 'chance',
        value: function chance(percent) {
            return this.generator() < (percent || 0.5);
        }

        /**
         * returns a random angle in radians [0 - 2 * Math.PI)
         */

    }, {
        key: 'angle',
        value: function angle() {
            return this.get(Math.PI * 2, true);
        }

        /**
         * Shuffle array (either in place or copied)
         * from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
         * @param {Array} array
         * @param {boolean} [copy=false] whether to shuffle in place (default) or return a new shuffled array
         * @return {Array} a shuffled array
         */

    }, {
        key: 'shuffle',
        value: function shuffle(array, copy) {
            if (copy) {
                array = array.slice();
            }
            if (array.length === 0) {
                return array;
            }

            var currentIndex = array.length,
                temporaryValue = void 0,
                randomIndex = void 0;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
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

    }, {
        key: 'pick',
        value: function pick(array, remove) {
            if (!remove) {
                return array[this.get(array.length)];
            } else {
                var pick = this.get(array.length);
                var temp = array[pick];
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

    }, {
        key: 'property',
        value: function property(obj) {
            var result;
            var count = 0;
            for (var prop in obj) {
                if (this.chance(1 / ++count)) {
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

    }, {
        key: 'set',
        value: function set(min, max, amount) {
            var set = [],
                all = [],
                i;
            for (i = min; i < max; i++) {
                all.push(i);
            }

            for (i = 0; i < amount; i++) {
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

    }, {
        key: 'distribution',
        value: function distribution(start, end, count, includeStart, includeEnd, useFloat) {
            var interval = Math.floor((end - start) / count);
            var halfInterval = interval / 2;
            var quarterInterval = interval / 4;
            var set = [];
            if (includeStart) {
                set.push(start);
            }
            for (var i = 0; i < count; i++) {
                set.push(start + i * interval + halfInterval + this.range(-quarterInterval, quarterInterval, useFloat));
            }
            if (includeEnd) {
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

    }, {
        key: 'weightedProbabilityInt',
        value: function weightedProbabilityInt(min, max, target, stddev) {
            function normRand() {
                var x1 = void 0,
                    x2 = void 0,
                    rad = void 0;
                do {
                    x1 = 2 * this.get(1, true) - 1;
                    x2 = 2 * this.get(1, true) - 1;
                    rad = x1 * x1 + x2 * x2;
                } while (rad >= 1 || rad === 0);
                var c = Math.sqrt(-2 * Math.log(rad) / rad);
                return x1 * c;
            }

            stddev = stddev || 1;
            if (Math.random() < 0.81546) {
                while (true) {
                    var sample = normRand() * stddev + target;
                    if (sample >= min && sample <= max) {
                        return sample;
                    }
                }
            } else {
                return this.range(min, max);
            }
        }

        /*
         * returns a random hex color (0 - 0xffffff)
         * @return {number}
         */

    }, {
        key: 'color',
        value: function color() {
            return this.get(0xffffff);
        }
    }]);

    return Random;
}();

module.exports = new Random();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB5eS1yYW5kb21cbi8vIGJ5IERhdmlkIEZpZ2F0bmVyXG4vLyBNSVQgbGljZW5zZVxuLy8gY29weXJpZ2h0IFlPUEVZIFlPUEVZIExMQyAyMDE2LTE3XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRmaWcvcmFuZG9tXG5cbmNvbnN0IHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJylcblxuY2xhc3MgUmFuZG9tXG57XG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBNYXRoLnJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdlbmVyYXRlcyBhIHNlZWRlZCBudW1iZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW1BSTkc9XCJhbGVhXCJdIC0gbmFtZSBvZiBhbGdvcml0aG0sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRiYXUvc2VlZHJhbmRvbVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NhdmU9dHJ1ZV1cbiAgICAgKi9cbiAgICBzZWVkKHNlZWQsIG9wdGlvbnMpXG4gICAge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IHNlZWRyYW5kb21bb3B0aW9ucy5QUk5HIHx8ICdhbGVhJ10oc2VlZCwgeyBzdGF0ZTogb3B0aW9ucy5zdGF0ZSB9KVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2F2ZXMgdGhlIHN0YXRlIG9mIHRoZSByYW5kb20gZ2VuZXJhdG9yXG4gICAgICogY2FuIG9ubHkgYmUgdXNlZCBhZnRlciBSYW5kb20uc2VlZCgpIGlzIGNhbGxlZFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHN0YXRlXG4gICAgICovXG4gICAgc2F2ZSgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5nZW5lcmF0b3IgIT09IE1hdGgucmFuZG9tKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3Iuc3RhdGUoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVzdG9yZXMgdGhlIHN0YXRlIG9mIHRoZSByYW5kb20gZ2VuZXJhdG9yXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXRlXG4gICAgICovXG4gICAgcmVzdG9yZShzdGF0ZSlcbiAgICB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVt0aGlzLm9wdGlvbnMuUFJORyB8fCAnYWxlYSddKCcnLCB7IHN0YXRlIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlcyB0aGUgZ2VuZXJhdG9yIHRvIHVzZSB0aGUgb2xkIE1hdGguc2luLWJhc2VkIHJhbmRvbSBmdW5jdGlvblxuICAgICAqIGJhc2VkIG9uIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvamF2YXNjcmlwdC1yYW5kb20tc2VlZHNcbiAgICAgKiAoZGVwcmVjYXRlZCkgVXNlIG9ubHkgZm9yIGNvbXBhdGliaWxpdHkgcHVycG9zZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqL1xuICAgIHNlZWRPbGQoc2VlZClcbiAgICB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5zaW4oc2VlZCsrKSAqIDEwMDAwXG4gICAgICAgICAgICByZXR1cm4geCAtIE1hdGguZmxvb3IoeClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIHNlcGFyYXRlIHJhbmRvbSBnZW5lcmF0b3IgdXNpbmcgdGhlIHNlZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBzZXBhcmF0ZVNlZWQoc2VlZClcbiAgICB7XG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IG5ldyBSYW5kb20oKVxuICAgICAgICByYW5kb20uc2VlZChzZWVkKVxuICAgICAgICByZXR1cm4gcmFuZG9tXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVzZXRzIHRoZSByYW5kb20gbnVtYmVyIHRoaXMuZ2VuZXJhdG9yIHRvIE1hdGgucmFuZG9tKClcbiAgICAgKi9cbiAgICByZXNldCgpXG4gICAge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IE1hdGgucmFuZG9tXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgdXNpbmcgdGhlIHRoaXMuZ2VuZXJhdG9yIGJldHdlZW4gWzAsIGNlaWxpbmcgLSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjZWlsaW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldChjZWlsaW5nLCB1c2VGbG9hdClcbiAgICB7XG4gICAgICAgIGNvbnN0IG5lZ2F0aXZlID0gY2VpbGluZyA8IDAgPyAtMSA6IDFcbiAgICAgICAgY2VpbGluZyAqPSBuZWdhdGl2ZVxuICAgICAgICBsZXQgcmVzdWx0XG4gICAgICAgIGlmICh1c2VGbG9hdClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmdcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdCAqIG5lZ2F0aXZlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldEh1Z2UoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJhbmRvbSBudW1iZXIgW21pZGRsZSAtIHJhbmdlLCBtaWRkbGUgKyByYW5nZV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWlkZGxlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIG1pZGRsZShtaWRkbGUsIGRlbHRhLCB1c2VGbG9hdClcbiAgICB7XG4gICAgICAgIGNvbnN0IGhhbGYgPSBkZWx0YSAvIDJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWlkZGxlIC0gaGFsZiwgbWlkZGxlICsgaGFsZiwgdXNlRmxvYXQpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmFuZG9tIG51bWJlciBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdIGlmIHRydWUsIHRoZW4gcmFuZ2UgaXMgKHN0YXJ0LCBlbmQpLS1pLmUuLCBub3QgaW5jbHVzaXZlIHRvIHN0YXJ0IGFuZCBlbmRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgcmFuZ2Uoc3RhcnQsIGVuZCwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICAvLyBjYXNlIHdoZXJlIHRoZXJlIGlzIG5vIHJhbmdlXG4gICAgICAgIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZW5kXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlRmxvYXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChlbmQgLSBzdGFydCwgdHJ1ZSkgKyBzdGFydFxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHJhbmdlXG4gICAgICAgICAgICBpZiAoc3RhcnQgPCAwICYmIGVuZCA+IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSAtc3RhcnQgKyBlbmQgKyAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gZW5kICsgMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA9PT0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IHN0YXJ0IC0gMVxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCAtIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0ICsgMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIHJhbmdlKSArIHN0YXJ0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhbiBhcnJheSBvZiByYW5kb20gbnVtYmVycyBiZXR3ZWVuIFtzdGFydCwgZW5kXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICByYW5nZU11bHRpcGxlKHN0YXJ0LCBlbmQsIGNvdW50LCB1c2VGbG9hdClcbiAgICB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnJhbmdlKHN0YXJ0LCBlbmQsIHVzZUZsb2F0KSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhbiBhcnJheSBvZiByYW5kb20gbnVtYmVycyBiZXR3ZWVuIFttaWRkbGUgLSByYW5nZSwgbWlkZGxlICsgcmFuZ2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pZGRsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYW5nZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcltdfVxuICAgICAqL1xuICAgIG1pZGRsZU11bHRpcGxlKG1pZGRsZSwgcmFuZ2UsIGNvdW50LCB1c2VGbG9hdClcbiAgICB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKG1pZGRsZShtaWRkbGUsIHJhbmdlLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjaGFuY2U9MC41XVxuICAgICAqIHJldHVybnMgcmFuZG9tIHNpZ24gKGVpdGhlciArMSBvciAtMSlcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2lnbihjaGFuY2UpXG4gICAge1xuICAgICAgICBjaGFuY2UgPSBjaGFuY2UgfHwgMC41XG4gICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvcigpIDwgY2hhbmNlID8gMSA6IC0xXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGVsbHMgeW91IHdoZXRoZXIgYSByYW5kb20gY2hhbmNlIHdhcyBhY2hpZXZlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcGVyY2VudD0wLjVdXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjaGFuY2UocGVyY2VudClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvcigpIDwgKHBlcmNlbnQgfHwgMC41KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gYW5nbGUgaW4gcmFkaWFucyBbMCAtIDIgKiBNYXRoLlBJKVxuICAgICAqL1xuICAgIGFuZ2xlKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChNYXRoLlBJICogMiwgdHJ1ZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaHVmZmxlIGFycmF5IChlaXRoZXIgaW4gcGxhY2Ugb3IgY29waWVkKVxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvcHk9ZmFsc2VdIHdoZXRoZXIgdG8gc2h1ZmZsZSBpbiBwbGFjZSAoZGVmYXVsdCkgb3IgcmV0dXJuIGEgbmV3IHNodWZmbGVkIGFycmF5XG4gICAgICogQHJldHVybiB7QXJyYXl9IGEgc2h1ZmZsZWQgYXJyYXlcbiAgICAgKi9cbiAgICBzaHVmZmxlKGFycmF5LCBjb3B5KVxuICAgIHtcbiAgICAgICAgaWYgKGNvcHkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkuc2xpY2UoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4XG5cbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IHRoaXMuZ2V0KGN1cnJlbnRJbmRleClcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxXG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XVxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XVxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwaWNrcyBhIHJhbmRvbSBlbGVtZW50IGZyb20gYW4gYXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgcGljayhhcnJheSwgcmVtb3ZlKVxuICAgIHtcbiAgICAgICAgaWYgKCFyZW1vdmUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVt0aGlzLmdldChhcnJheS5sZW5ndGgpXVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcGljayA9IHRoaXMuZ2V0KGFycmF5Lmxlbmd0aClcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJheVtwaWNrXVxuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKHBpY2ssIDEpXG4gICAgICAgICAgICByZXR1cm4gdGVtcFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdFxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNTMyMjE4L3BpY2stcmFuZG9tLXByb3BlcnR5LWZyb20tYS1qYXZhc2NyaXB0LW9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIHByb3BlcnR5KG9iailcbiAgICB7XG4gICAgICAgIHZhciByZXN1bHRcbiAgICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iailcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmNlKDEgLyArK2NvdW50KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBwcm9wXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZXMgYSByYW5kb20gc2V0IHdoZXJlIGVhY2ggZW50cnkgaXMgYSB2YWx1ZSBiZXR3ZWVuIFttaW4sIG1heF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbW91bnQgb2YgbnVtYmVycyBpbiBzZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfVxuICAgICAqL1xuICAgIHNldChtaW4sIG1heCwgYW1vdW50KVxuICAgIHtcbiAgICAgICAgdmFyIHNldCA9IFtdLCBhbGwgPSBbXSwgaVxuICAgICAgICBmb3IgKGkgPSBtaW47IGkgPCBtYXg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgYWxsLnB1c2goaSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbW91bnQ7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5nZXQoYWxsLmxlbmd0aClcbiAgICAgICAgICAgIHNldC5wdXNoKGFsbFtmb3VuZF0pXG4gICAgICAgICAgICBhbGwuc3BsaWNlKGZvdW5kLCAxKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSBzZXQgb2YgbnVtYmVycyB3aXRoIGEgcmFuZG9tbHkgZXZlbiBkaXN0cmlidXRpb24gKGkuZS4sIG5vIG92ZXJsYXBwaW5nIGFuZCBmaWxsaW5nIHRoZSBzcGFjZSlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IG9mIG5vbi1zdGFydC9lbmQgcG9pbnRzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZVN0YXJ0PWZhbHNlXSBpbmNsdWRlcyBzdGFydCBwb2ludCAoY291bnQrKylcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbmNsdWRlRW5kPWZhbHNlXSBpbmNsdWRlcyBlbmQgcG9pbnQgKGNvdW50KyspXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBkaXN0cmlidXRpb24oc3RhcnQsIGVuZCwgY291bnQsIGluY2x1ZGVTdGFydCwgaW5jbHVkZUVuZCwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKChlbmQgLSBzdGFydCkgLyBjb3VudClcbiAgICAgICAgdmFyIGhhbGZJbnRlcnZhbCA9IGludGVydmFsIC8gMlxuICAgICAgICB2YXIgcXVhcnRlckludGVydmFsID0gaW50ZXJ2YWwgLyA0XG4gICAgICAgIHZhciBzZXQgPSBbXVxuICAgICAgICBpZiAoaW5jbHVkZVN0YXJ0KVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXQucHVzaChzdGFydClcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNldC5wdXNoKHN0YXJ0ICsgaSAqIGludGVydmFsICsgaGFsZkludGVydmFsICsgdGhpcy5yYW5nZSgtcXVhcnRlckludGVydmFsLCBxdWFydGVySW50ZXJ2YWwsIHVzZUZsb2F0KSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5jbHVkZUVuZClcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0LnB1c2goZW5kKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciBiYXNlZCBvbiB3ZWlnaHRlZCBwcm9iYWJpbGl0eSBiZXR3ZWVuIFttaW4sIG1heF1cbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjI2NTYxMjYvamF2YXNjcmlwdC1yYW5kb20tbnVtYmVyLXdpdGgtd2VpZ2h0ZWQtcHJvYmFiaWxpdHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0YXJnZXQgZm9yIGF2ZXJhZ2UgdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RkZGV2IC0gc3RhbmRhcmQgZGV2aWF0aW9uXG4gICAgICovXG4gICAgd2VpZ2h0ZWRQcm9iYWJpbGl0eUludChtaW4sIG1heCwgdGFyZ2V0LCBzdGRkZXYpXG4gICAge1xuICAgICAgICBmdW5jdGlvbiBub3JtUmFuZCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCB4MSwgeDIsIHJhZFxuICAgICAgICAgICAgZG9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB4MSA9IDIgKiB0aGlzLmdldCgxLCB0cnVlKSAtIDFcbiAgICAgICAgICAgICAgICB4MiA9IDIgKiB0aGlzLmdldCgxLCB0cnVlKSAtIDFcbiAgICAgICAgICAgICAgICByYWQgPSB4MSAqIHgxICsgeDIgKiB4MlxuICAgICAgICAgICAgfSB3aGlsZSAocmFkID49IDEgfHwgcmFkID09PSAwKVxuICAgICAgICAgICAgY29uc3QgYyA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHJhZCkgLyByYWQpXG4gICAgICAgICAgICByZXR1cm4geDEgKiBjXG4gICAgICAgIH1cblxuICAgICAgICBzdGRkZXYgPSBzdGRkZXYgfHwgMVxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuODE1NDYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbXBsZSA9ICgobm9ybVJhbmQoKSAqIHN0ZGRldikgKyB0YXJnZXQpXG4gICAgICAgICAgICAgICAgaWYgKHNhbXBsZSA+PSBtaW4gJiYgc2FtcGxlIDw9IG1heClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzYW1wbGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yYW5nZShtaW4sIG1heClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBoZXggY29sb3IgKDAgLSAweGZmZmZmZilcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgY29sb3IoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KDB4ZmZmZmZmKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmFuZG9tKCkiXX0=