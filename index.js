'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
     * @param {(boolean|string)} [state] - can include the state returned from save()
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
         * can only be used after Random.seed() is called with options.state = true
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
         * select a random collection of elements from an array
         * @param {Array} array
         * @param {number} count
         * @param {Array} array of selected items
         */

    }, {
        key: 'select',
        value: function select(array, count) {
            var select = [].concat(_toConsumableArray(array));
            var selected = [];
            for (var i = 0; i < count; i++) {
                var index = this.get(select.length);
                selected.push.apply(selected, _toConsumableArray(select.splice(index, 1)));
            }
            return selected;
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

        /**
         * returns a random number within a circle with a normal distribution
         * from https://stackoverflow.com/a/5838055/1955997
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {bool} [float]
         * @returns {number[]} [x, y]
         */

    }, {
        key: 'circle',
        value: function circle(x, y, radius, float) {
            var t = this.angle();
            var u = this.get(1, true) + this.get(1, true);
            var r = u > 1 ? 2 - u : u;
            if (float) {
                return [x + r * Math.cos(t) * radius, y + r * Math.sin(t) * radius];
            } else {
                return [Math.round(x + r * Math.cos(t) * radius), Math.round(y + r * Math.sin(t) * radius)];
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cmNlc0NvbnRlbnQiOlsiLy8geXktcmFuZG9tXG4vLyBieSBEYXZpZCBGaWdhdG5lclxuLy8gTUlUIGxpY2Vuc2Vcbi8vIGNvcHlyaWdodCBZT1BFWSBZT1BFWSBMTEMgMjAxNi0xN1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkZmlnL3JhbmRvbVxuXG5jb25zdCBzZWVkcmFuZG9tID0gcmVxdWlyZSgnc2VlZHJhbmRvbScpXG5cbmNsYXNzIFJhbmRvbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gTWF0aC5yYW5kb21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZW5lcmF0ZXMgYSBzZWVkZWQgbnVtYmVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtQUk5HPVwiYWxlYVwiXSAtIG5hbWUgb2YgYWxnb3JpdGhtLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkYmF1L3NlZWRyYW5kb21cbiAgICAgKiBAcGFyYW0geyhib29sZWFufHN0cmluZyl9IFtzdGF0ZV0gLSBjYW4gaW5jbHVkZSB0aGUgc3RhdGUgcmV0dXJuZWQgZnJvbSBzYXZlKClcbiAgICAgKi9cbiAgICBzZWVkKHNlZWQsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBzZWVkcmFuZG9tW29wdGlvbnMuUFJORyB8fCAnYWxlYSddKHNlZWQsIHsgc3RhdGU6IG9wdGlvbnMuc3RhdGUgfSlcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNhdmVzIHRoZSBzdGF0ZSBvZiB0aGUgcmFuZG9tIGdlbmVyYXRvclxuICAgICAqIGNhbiBvbmx5IGJlIHVzZWQgYWZ0ZXIgUmFuZG9tLnNlZWQoKSBpcyBjYWxsZWQgd2l0aCBvcHRpb25zLnN0YXRlID0gdHJ1ZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHN0YXRlXG4gICAgICovXG4gICAgc2F2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdG9yICE9PSBNYXRoLnJhbmRvbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yLnN0YXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc3RvcmVzIHRoZSBzdGF0ZSBvZiB0aGUgcmFuZG9tIGdlbmVyYXRvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHJlc3RvcmUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBzZWVkcmFuZG9tW3RoaXMub3B0aW9ucy5QUk5HIHx8ICdhbGVhJ10oJycsIHsgc3RhdGUgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGFuZ2VzIHRoZSBnZW5lcmF0b3IgdG8gdXNlIHRoZSBvbGQgTWF0aC5zaW4tYmFzZWQgcmFuZG9tIGZ1bmN0aW9uXG4gICAgICogYmFzZWQgb24gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9qYXZhc2NyaXB0LXJhbmRvbS1zZWVkc1xuICAgICAqIChkZXByZWNhdGVkKSBVc2Ugb25seSBmb3IgY29tcGF0aWJpbGl0eSBwdXJwb3Nlc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkXG4gICAgICovXG4gICAgc2VlZE9sZChzZWVkKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5zaW4oc2VlZCsrKSAqIDEwMDAwXG4gICAgICAgICAgICByZXR1cm4geCAtIE1hdGguZmxvb3IoeClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIHNlcGFyYXRlIHJhbmRvbSBnZW5lcmF0b3IgdXNpbmcgdGhlIHNlZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBzZXBhcmF0ZVNlZWQoc2VlZCkge1xuICAgICAgICBjb25zdCByYW5kb20gPSBuZXcgUmFuZG9tKClcbiAgICAgICAgcmFuZG9tLnNlZWQoc2VlZClcbiAgICAgICAgcmV0dXJuIHJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc2V0cyB0aGUgcmFuZG9tIG51bWJlciB0aGlzLmdlbmVyYXRvciB0byBNYXRoLnJhbmRvbSgpXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gTWF0aC5yYW5kb21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciB1c2luZyB0aGUgdGhpcy5nZW5lcmF0b3IgYmV0d2VlbiBbMCwgY2VpbGluZyAtIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNlaWxpbmdcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0KGNlaWxpbmcsIHVzZUZsb2F0KSB7XG4gICAgICAgIGNvbnN0IG5lZ2F0aXZlID0gY2VpbGluZyA8IDAgPyAtMSA6IDFcbiAgICAgICAgY2VpbGluZyAqPSBuZWdhdGl2ZVxuICAgICAgICBsZXQgcmVzdWx0XG4gICAgICAgIGlmICh1c2VGbG9hdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdCAqIG5lZ2F0aXZlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldEh1Z2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByYW5kb20gbnVtYmVyIFttaWRkbGUgLSByYW5nZSwgbWlkZGxlICsgcmFuZ2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pZGRsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBtaWRkbGUobWlkZGxlLCBkZWx0YSwgdXNlRmxvYXQpIHtcbiAgICAgICAgY29uc3QgaGFsZiA9IGRlbHRhIC8gMlxuICAgICAgICByZXR1cm4gdGhpcy5yYW5nZShtaWRkbGUgLSBoYWxmLCBtaWRkbGUgKyBoYWxmLCB1c2VGbG9hdClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByYW5kb20gbnVtYmVyIFtzdGFydCwgZW5kXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV0gaWYgdHJ1ZSwgdGhlbiByYW5nZSBpcyAoc3RhcnQsIGVuZCktLWkuZS4sIG5vdCBpbmNsdXNpdmUgdG8gc3RhcnQgYW5kIGVuZFxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICByYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdCkge1xuICAgICAgICAvLyBjYXNlIHdoZXJlIHRoZXJlIGlzIG5vIHJhbmdlXG4gICAgICAgIGlmIChlbmQgPT09IHN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlRmxvYXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChlbmQgLSBzdGFydCwgdHJ1ZSkgKyBzdGFydFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJhbmdlXG4gICAgICAgICAgICBpZiAoc3RhcnQgPCAwICYmIGVuZCA+IDApIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IC1zdGFydCArIGVuZCArIDFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID4gMCkge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gZW5kICsgMVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydCA8IDAgJiYgZW5kID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzdGFydCAtIDFcbiAgICAgICAgICAgICAgICBzdGFydCA9IDFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA8IDApIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0IC0gMVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0ICsgMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIHJhbmdlKSArIHN0YXJ0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhbiBhcnJheSBvZiByYW5kb20gbnVtYmVycyBiZXR3ZWVuIFtzdGFydCwgZW5kXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICByYW5nZU11bHRpcGxlKHN0YXJ0LCBlbmQsIGNvdW50LCB1c2VGbG9hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy5yYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbbWlkZGxlIC0gcmFuZ2UsIG1pZGRsZSArIHJhbmdlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBtaWRkbGVNdWx0aXBsZShtaWRkbGUsIHJhbmdlLCBjb3VudCwgdXNlRmxvYXQpIHtcbiAgICAgICAgY29uc3QgYXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2gobWlkZGxlKG1pZGRsZSwgcmFuZ2UsIHVzZUZsb2F0KSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2NoYW5jZT0wLjVdXG4gICAgICogcmV0dXJucyByYW5kb20gc2lnbiAoZWl0aGVyICsxIG9yIC0xKVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBzaWduKGNoYW5jZSkge1xuICAgICAgICBjaGFuY2UgPSBjaGFuY2UgfHwgMC41XG4gICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvcigpIDwgY2hhbmNlID8gMSA6IC0xXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGVsbHMgeW91IHdoZXRoZXIgYSByYW5kb20gY2hhbmNlIHdhcyBhY2hpZXZlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcGVyY2VudD0wLjVdXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjaGFuY2UocGVyY2VudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IChwZXJjZW50IHx8IDAuNSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIGFuZ2xlIGluIHJhZGlhbnMgWzAgLSAyICogTWF0aC5QSSlcbiAgICAgKi9cbiAgICBhbmdsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KE1hdGguUEkgKiAyLCB0cnVlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNodWZmbGUgYXJyYXkgKGVpdGhlciBpbiBwbGFjZSBvciBjb3BpZWQpXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0NTA5NTQvaG93LXRvLXJhbmRvbWl6ZS1zaHVmZmxlLWEtamF2YXNjcmlwdC1hcnJheVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY29weT1mYWxzZV0gd2hldGhlciB0byBzaHVmZmxlIGluIHBsYWNlIChkZWZhdWx0KSBvciByZXR1cm4gYSBuZXcgc2h1ZmZsZWQgYXJyYXlcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYSBzaHVmZmxlZCBhcnJheVxuICAgICAqL1xuICAgIHNodWZmbGUoYXJyYXksIGNvcHkpIHtcbiAgICAgICAgaWYgKGNvcHkpIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkuc2xpY2UoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4XG5cbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IHRoaXMuZ2V0KGN1cnJlbnRJbmRleClcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxXG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XVxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XVxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwaWNrcyBhIHJhbmRvbSBlbGVtZW50IGZyb20gYW4gYXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgcGljayhhcnJheSwgcmVtb3ZlKSB7XG4gICAgICAgIGlmICghcmVtb3ZlKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbdGhpcy5nZXQoYXJyYXkubGVuZ3RoKV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBpY2sgPSB0aGlzLmdldChhcnJheS5sZW5ndGgpXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyYXlbcGlja11cbiAgICAgICAgICAgIGFycmF5LnNwbGljZShwaWNrLCAxKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNlbGVjdCBhIHJhbmRvbSBjb2xsZWN0aW9uIG9mIGVsZW1lbnRzIGZyb20gYW4gYXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IG9mIHNlbGVjdGVkIGl0ZW1zXG4gICAgICovXG4gICAgc2VsZWN0KGFycmF5LCBjb3VudCkge1xuICAgICAgICBjb25zdCBzZWxlY3QgPSBbLi4uYXJyYXldXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0KHNlbGVjdC5sZW5ndGgpXG4gICAgICAgICAgICBzZWxlY3RlZC5wdXNoKC4uLnNlbGVjdC5zcGxpY2UoaW5kZXgsIDEpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxlY3RlZFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gcHJvcGVydHkgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjUzMjIxOC9waWNrLXJhbmRvbS1wcm9wZXJ0eS1mcm9tLWEtamF2YXNjcmlwdC1vYmplY3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBwcm9wZXJ0eShvYmopIHtcbiAgICAgICAgdmFyIHJlc3VsdFxuICAgICAgICB2YXIgY291bnQgPSAwXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGFuY2UoMSAvICsrY291bnQpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcHJvcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGVzIGEgcmFuZG9tIHNldCB3aGVyZSBlYWNoIGVudHJ5IGlzIGEgdmFsdWUgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW1vdW50IG9mIG51bWJlcnMgaW4gc2V0XG4gICAgICogQHBhcmFtIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBzZXQobWluLCBtYXgsIGFtb3VudCkge1xuICAgICAgICB2YXIgc2V0ID0gW10sIGFsbCA9IFtdLCBpXG4gICAgICAgIGZvciAoaSA9IG1pbjsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgICAgICBhbGwucHVzaChpKVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFtb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmdldChhbGwubGVuZ3RoKVxuICAgICAgICAgICAgc2V0LnB1c2goYWxsW2ZvdW5kXSlcbiAgICAgICAgICAgIGFsbC5zcGxpY2UoZm91bmQsIDEpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHNldCBvZiBudW1iZXJzIHdpdGggYSByYW5kb21seSBldmVuIGRpc3RyaWJ1dGlvbiAoaS5lLiwgbm8gb3ZlcmxhcHBpbmcgYW5kIGZpbGxpbmcgdGhlIHNwYWNlKVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgb2Ygbm9uLXN0YXJ0L2VuZCBwb2ludHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbmNsdWRlU3RhcnQ9ZmFsc2VdIGluY2x1ZGVzIHN0YXJ0IHBvaW50IChjb3VudCsrKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luY2x1ZGVFbmQ9ZmFsc2VdIGluY2x1ZGVzIGVuZCBwb2ludCAoY291bnQrKylcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcGFyYW0ge251bWJlcltdfVxuICAgICAqL1xuICAgIGRpc3RyaWJ1dGlvbihzdGFydCwgZW5kLCBjb3VudCwgaW5jbHVkZVN0YXJ0LCBpbmNsdWRlRW5kLCB1c2VGbG9hdCkge1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKChlbmQgLSBzdGFydCkgLyBjb3VudClcbiAgICAgICAgdmFyIGhhbGZJbnRlcnZhbCA9IGludGVydmFsIC8gMlxuICAgICAgICB2YXIgcXVhcnRlckludGVydmFsID0gaW50ZXJ2YWwgLyA0XG4gICAgICAgIHZhciBzZXQgPSBbXVxuICAgICAgICBpZiAoaW5jbHVkZVN0YXJ0KSB7XG4gICAgICAgICAgICBzZXQucHVzaChzdGFydClcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHNldC5wdXNoKHN0YXJ0ICsgaSAqIGludGVydmFsICsgaGFsZkludGVydmFsICsgdGhpcy5yYW5nZSgtcXVhcnRlckludGVydmFsLCBxdWFydGVySW50ZXJ2YWwsIHVzZUZsb2F0KSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5jbHVkZUVuZCkge1xuICAgICAgICAgICAgc2V0LnB1c2goZW5kKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciBiYXNlZCBvbiB3ZWlnaHRlZCBwcm9iYWJpbGl0eSBiZXR3ZWVuIFttaW4sIG1heF1cbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjI2NTYxMjYvamF2YXNjcmlwdC1yYW5kb20tbnVtYmVyLXdpdGgtd2VpZ2h0ZWQtcHJvYmFiaWxpdHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0YXJnZXQgZm9yIGF2ZXJhZ2UgdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RkZGV2IC0gc3RhbmRhcmQgZGV2aWF0aW9uXG4gICAgICovXG4gICAgd2VpZ2h0ZWRQcm9iYWJpbGl0eUludChtaW4sIG1heCwgdGFyZ2V0LCBzdGRkZXYpIHtcbiAgICAgICAgZnVuY3Rpb24gbm9ybVJhbmQoKSB7XG4gICAgICAgICAgICBsZXQgeDEsIHgyLCByYWRcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICB4MSA9IDIgKiB0aGlzLmdldCgxLCB0cnVlKSAtIDFcbiAgICAgICAgICAgICAgICB4MiA9IDIgKiB0aGlzLmdldCgxLCB0cnVlKSAtIDFcbiAgICAgICAgICAgICAgICByYWQgPSB4MSAqIHgxICsgeDIgKiB4MlxuICAgICAgICAgICAgfSB3aGlsZSAocmFkID49IDEgfHwgcmFkID09PSAwKVxuICAgICAgICAgICAgY29uc3QgYyA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHJhZCkgLyByYWQpXG4gICAgICAgICAgICByZXR1cm4geDEgKiBjXG4gICAgICAgIH1cblxuICAgICAgICBzdGRkZXYgPSBzdGRkZXYgfHwgMVxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuODE1NDYpIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtcGxlID0gKChub3JtUmFuZCgpICogc3RkZGV2KSArIHRhcmdldClcbiAgICAgICAgICAgICAgICBpZiAoc2FtcGxlID49IG1pbiAmJiBzYW1wbGUgPD0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzYW1wbGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yYW5nZShtaW4sIG1heClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIHdpdGhpbiBhIGNpcmNsZSB3aXRoIGEgbm9ybWFsIGRpc3RyaWJ1dGlvblxuICAgICAqIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4MzgwNTUvMTk1NTk5N1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzXG4gICAgICogQHBhcmFtIHtib29sfSBbZmxvYXRdXG4gICAgICogQHJldHVybnMge251bWJlcltdfSBbeCwgeV1cbiAgICAgKi9cbiAgICBjaXJjbGUoeCwgeSwgcmFkaXVzLCBmbG9hdCkge1xuICAgICAgICBjb25zdCB0ID0gdGhpcy5hbmdsZSgpXG4gICAgICAgIGNvbnN0IHUgPSB0aGlzLmdldCgxLCB0cnVlKSArIHRoaXMuZ2V0KDEsIHRydWUpXG4gICAgICAgIGNvbnN0IHIgPSB1ID4gMSA/IDIgLSB1IDogdVxuICAgICAgICBpZiAoZmxvYXQpIHtcbiAgICAgICAgICAgIHJldHVybiBbeCArIHIgKiBNYXRoLmNvcyh0KSAqIHJhZGl1cywgeSArIHIgKiBNYXRoLnNpbih0KSAqIHJhZGl1c11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbTWF0aC5yb3VuZCh4ICsgciAqIE1hdGguY29zKHQpICogcmFkaXVzKSwgTWF0aC5yb3VuZCh5ICsgciAqIE1hdGguc2luKHQpICogcmFkaXVzKV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBoZXggY29sb3IgKDAgLSAweGZmZmZmZilcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgY29sb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgweGZmZmZmZilcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFJhbmRvbSgpIl19