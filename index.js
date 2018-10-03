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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB5eS1yYW5kb21cclxuLy8gYnkgRGF2aWQgRmlnYXRuZXJcclxuLy8gTUlUIGxpY2Vuc2VcclxuLy8gY29weXJpZ2h0IFlPUEVZIFlPUEVZIExMQyAyMDE2LTE3XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGZpZy9yYW5kb21cclxuXHJcbmNvbnN0IHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJylcclxuXHJcbmNsYXNzIFJhbmRvbVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBNYXRoLnJhbmRvbVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2VuZXJhdGVzIGEgc2VlZGVkIG51bWJlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbUFJORz1cImFsZWFcIl0gLSBuYW1lIG9mIGFsZ29yaXRobSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGJhdS9zZWVkcmFuZG9tXHJcbiAgICAgKiBAcGFyYW0geyhib29sZWFufHN0cmluZyl9IFtzdGF0ZV0gLSBjYW4gaW5jbHVkZSB0aGUgc3RhdGUgcmV0dXJuZWQgZnJvbSBzYXZlKClcclxuICAgICAqL1xyXG4gICAgc2VlZChzZWVkLCBvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBzZWVkcmFuZG9tW29wdGlvbnMuUFJORyB8fCAnYWxlYSddKHNlZWQsIHsgc3RhdGU6IG9wdGlvbnMuc3RhdGUgfSlcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzYXZlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcclxuICAgICAqIGNhbiBvbmx5IGJlIHVzZWQgYWZ0ZXIgUmFuZG9tLnNlZWQoKSBpcyBjYWxsZWQgd2l0aCBvcHRpb25zLnN0YXRlID0gdHJ1ZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gc3RhdGVcclxuICAgICAqL1xyXG4gICAgc2F2ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdG9yICE9PSBNYXRoLnJhbmRvbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvci5zdGF0ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVzdG9yZXMgdGhlIHN0YXRlIG9mIHRoZSByYW5kb20gZ2VuZXJhdG9yXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdGVcclxuICAgICAqL1xyXG4gICAgcmVzdG9yZShzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IHNlZWRyYW5kb21bdGhpcy5vcHRpb25zLlBSTkcgfHwgJ2FsZWEnXSgnJywgeyBzdGF0ZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2hhbmdlcyB0aGUgZ2VuZXJhdG9yIHRvIHVzZSB0aGUgb2xkIE1hdGguc2luLWJhc2VkIHJhbmRvbSBmdW5jdGlvblxyXG4gICAgICogYmFzZWQgb24gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9qYXZhc2NyaXB0LXJhbmRvbS1zZWVkc1xyXG4gICAgICogKGRlcHJlY2F0ZWQpIFVzZSBvbmx5IGZvciBjb21wYXRpYmlsaXR5IHB1cnBvc2VzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxyXG4gICAgICovXHJcbiAgICBzZWVkT2xkKHNlZWQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5zaW4oc2VlZCsrKSAqIDEwMDAwXHJcbiAgICAgICAgICAgIHJldHVybiB4IC0gTWF0aC5mbG9vcih4KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHNlcGFyYXRlIHJhbmRvbSBnZW5lcmF0b3IgdXNpbmcgdGhlIHNlZWRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKi9cclxuICAgIHNlcGFyYXRlU2VlZChzZWVkKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IG5ldyBSYW5kb20oKVxyXG4gICAgICAgIHJhbmRvbS5zZWVkKHNlZWQpXHJcbiAgICAgICAgcmV0dXJuIHJhbmRvbVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVzZXRzIHRoZSByYW5kb20gbnVtYmVyIHRoaXMuZ2VuZXJhdG9yIHRvIE1hdGgucmFuZG9tKClcclxuICAgICAqL1xyXG4gICAgcmVzZXQoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gTWF0aC5yYW5kb21cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIHVzaW5nIHRoZSB0aGlzLmdlbmVyYXRvciBiZXR3ZWVuIFswLCBjZWlsaW5nIC0gMV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjZWlsaW5nXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0KGNlaWxpbmcsIHVzZUZsb2F0KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IG5lZ2F0aXZlID0gY2VpbGluZyA8IDAgPyAtMSA6IDFcclxuICAgICAgICBjZWlsaW5nICo9IG5lZ2F0aXZlXHJcbiAgICAgICAgbGV0IHJlc3VsdFxyXG4gICAgICAgIGlmICh1c2VGbG9hdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQgKiBuZWdhdGl2ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldEh1Z2UoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJhbmRvbSBudW1iZXIgW21pZGRsZSAtIHJhbmdlLCBtaWRkbGUgKyByYW5nZV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIG1pZGRsZShtaWRkbGUsIGRlbHRhLCB1c2VGbG9hdClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBoYWxmID0gZGVsdGEgLyAyXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWlkZGxlIC0gaGFsZiwgbWlkZGxlICsgaGFsZiwgdXNlRmxvYXQpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByYW5kb20gbnVtYmVyIFtzdGFydCwgZW5kXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV0gaWYgdHJ1ZSwgdGhlbiByYW5nZSBpcyAoc3RhcnQsIGVuZCktLWkuZS4sIG5vdCBpbmNsdXNpdmUgdG8gc3RhcnQgYW5kIGVuZFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICByYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdClcclxuICAgIHtcclxuICAgICAgICAvLyBjYXNlIHdoZXJlIHRoZXJlIGlzIG5vIHJhbmdlXHJcbiAgICAgICAgaWYgKGVuZCA9PT0gc3RhcnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZW5kXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlRmxvYXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoZW5kIC0gc3RhcnQsIHRydWUpICsgc3RhcnRcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJhbmdlXHJcbiAgICAgICAgICAgIGlmIChzdGFydCA8IDAgJiYgZW5kID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSAtc3RhcnQgKyBlbmQgKyAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgKyAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA9PT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzdGFydCAtIDFcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0IC0gMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCArIDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdlbmVyYXRvcigpICogcmFuZ2UpICsgc3RhcnRcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhbiBhcnJheSBvZiByYW5kb20gbnVtYmVycyBiZXR3ZWVuIFtzdGFydCwgZW5kXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxyXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XHJcbiAgICAgKi9cclxuICAgIHJhbmdlTXVsdGlwbGUoc3RhcnQsIGVuZCwgY291bnQsIHVzZUZsb2F0KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBhcnJheSA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnJhbmdlKHN0YXJ0LCBlbmQsIHVzZUZsb2F0KSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhbiBhcnJheSBvZiByYW5kb20gbnVtYmVycyBiZXR3ZWVuIFttaWRkbGUgLSByYW5nZSwgbWlkZGxlICsgcmFuZ2VdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWlkZGxlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2VcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cclxuICAgICAqL1xyXG4gICAgbWlkZGxlTXVsdGlwbGUobWlkZGxlLCByYW5nZSwgY291bnQsIHVzZUZsb2F0KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKG1pZGRsZShtaWRkbGUsIHJhbmdlLCB1c2VGbG9hdCkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjaGFuY2U9MC41XVxyXG4gICAgICogcmV0dXJucyByYW5kb20gc2lnbiAoZWl0aGVyICsxIG9yIC0xKVxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzaWduKGNoYW5jZSlcclxuICAgIHtcclxuICAgICAgICBjaGFuY2UgPSBjaGFuY2UgfHwgMC41XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yKCkgPCBjaGFuY2UgPyAxIDogLTFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRlbGxzIHlvdSB3aGV0aGVyIGEgcmFuZG9tIGNoYW5jZSB3YXMgYWNoaWV2ZWRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcGVyY2VudD0wLjVdXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBjaGFuY2UocGVyY2VudClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IChwZXJjZW50IHx8IDAuNSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSByYW5kb20gYW5nbGUgaW4gcmFkaWFucyBbMCAtIDIgKiBNYXRoLlBJKVxyXG4gICAgICovXHJcbiAgICBhbmdsZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2h1ZmZsZSBhcnJheSAoZWl0aGVyIGluIHBsYWNlIG9yIGNvcGllZClcclxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjb3B5PWZhbHNlXSB3aGV0aGVyIHRvIHNodWZmbGUgaW4gcGxhY2UgKGRlZmF1bHQpIG9yIHJldHVybiBhIG5ldyBzaHVmZmxlZCBhcnJheVxyXG4gICAgICogQHJldHVybiB7QXJyYXl9IGEgc2h1ZmZsZWQgYXJyYXlcclxuICAgICAqL1xyXG4gICAgc2h1ZmZsZShhcnJheSwgY29weSlcclxuICAgIHtcclxuICAgICAgICBpZiAoY29weSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkuc2xpY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXhcclxuXHJcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cclxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gdGhpcy5nZXQoY3VycmVudEluZGV4KVxyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMVxyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF1cclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XVxyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHBpY2tzIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhbiBhcnJheVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcclxuICAgICAqIEByZXR1cm4geyp9XHJcbiAgICAgKi9cclxuICAgIHBpY2soYXJyYXksIHJlbW92ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIXJlbW92ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheVt0aGlzLmdldChhcnJheS5sZW5ndGgpXVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwaWNrID0gdGhpcy5nZXQoYXJyYXkubGVuZ3RoKVxyXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyYXlbcGlja11cclxuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKHBpY2ssIDEpXHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdFxyXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI1MzIyMTgvcGljay1yYW5kb20tcHJvcGVydHktZnJvbS1hLWphdmFzY3JpcHQtb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqXHJcbiAgICAgKiBAcmV0dXJuIHsqfVxyXG4gICAgICovXHJcbiAgICBwcm9wZXJ0eShvYmopXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlc3VsdFxyXG4gICAgICAgIHZhciBjb3VudCA9IDBcclxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5jZSgxIC8gKytjb3VudCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHByb3BcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGVzIGEgcmFuZG9tIHNldCB3aGVyZSBlYWNoIGVudHJ5IGlzIGEgdmFsdWUgYmV0d2VlbiBbbWluLCBtYXhdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW1vdW50IG9mIG51bWJlcnMgaW4gc2V0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfVxyXG4gICAgICovXHJcbiAgICBzZXQobWluLCBtYXgsIGFtb3VudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2V0ID0gW10sIGFsbCA9IFtdLCBpXHJcbiAgICAgICAgZm9yIChpID0gbWluOyBpIDwgbWF4OyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhbGwucHVzaChpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFtb3VudDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5nZXQoYWxsLmxlbmd0aClcclxuICAgICAgICAgICAgc2V0LnB1c2goYWxsW2ZvdW5kXSlcclxuICAgICAgICAgICAgYWxsLnNwbGljZShmb3VuZCwgMSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNldFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSBzZXQgb2YgbnVtYmVycyB3aXRoIGEgcmFuZG9tbHkgZXZlbiBkaXN0cmlidXRpb24gKGkuZS4sIG5vIG92ZXJsYXBwaW5nIGFuZCBmaWxsaW5nIHRoZSBzcGFjZSlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IG9mIG5vbi1zdGFydC9lbmQgcG9pbnRzXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbmNsdWRlU3RhcnQ9ZmFsc2VdIGluY2x1ZGVzIHN0YXJ0IHBvaW50IChjb3VudCsrKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZUVuZD1mYWxzZV0gaW5jbHVkZXMgZW5kIHBvaW50IChjb3VudCsrKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfVxyXG4gICAgICovXHJcbiAgICBkaXN0cmlidXRpb24oc3RhcnQsIGVuZCwgY291bnQsIGluY2x1ZGVTdGFydCwgaW5jbHVkZUVuZCwgdXNlRmxvYXQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcigoZW5kIC0gc3RhcnQpIC8gY291bnQpXHJcbiAgICAgICAgdmFyIGhhbGZJbnRlcnZhbCA9IGludGVydmFsIC8gMlxyXG4gICAgICAgIHZhciBxdWFydGVySW50ZXJ2YWwgPSBpbnRlcnZhbCAvIDRcclxuICAgICAgICB2YXIgc2V0ID0gW11cclxuICAgICAgICBpZiAoaW5jbHVkZVN0YXJ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2V0LnB1c2goc3RhcnQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNldC5wdXNoKHN0YXJ0ICsgaSAqIGludGVydmFsICsgaGFsZkludGVydmFsICsgdGhpcy5yYW5nZSgtcXVhcnRlckludGVydmFsLCBxdWFydGVySW50ZXJ2YWwsIHVzZUZsb2F0KSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGluY2x1ZGVFbmQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZXQucHVzaChlbmQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIGJhc2VkIG9uIHdlaWdodGVkIHByb2JhYmlsaXR5IGJldHdlZW4gW21pbiwgbWF4XVxyXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIyNjU2MTI2L2phdmFzY3JpcHQtcmFuZG9tLW51bWJlci13aXRoLXdlaWdodGVkLXByb2JhYmlsaXR5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGFyZ2V0IGZvciBhdmVyYWdlIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RkZGV2IC0gc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHdlaWdodGVkUHJvYmFiaWxpdHlJbnQobWluLCBtYXgsIHRhcmdldCwgc3RkZGV2KVxyXG4gICAge1xyXG4gICAgICAgIGZ1bmN0aW9uIG5vcm1SYW5kKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB4MSwgeDIsIHJhZFxyXG4gICAgICAgICAgICBkb1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4MSA9IDIgKiB0aGlzLmdldCgxLCB0cnVlKSAtIDFcclxuICAgICAgICAgICAgICAgIHgyID0gMiAqIHRoaXMuZ2V0KDEsIHRydWUpIC0gMVxyXG4gICAgICAgICAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDJcclxuICAgICAgICAgICAgfSB3aGlsZSAocmFkID49IDEgfHwgcmFkID09PSAwKVxyXG4gICAgICAgICAgICBjb25zdCBjID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocmFkKSAvIHJhZClcclxuICAgICAgICAgICAgcmV0dXJuIHgxICogY1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RkZGV2ID0gc3RkZGV2IHx8IDFcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuODE1NDYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtcGxlID0gKChub3JtUmFuZCgpICogc3RkZGV2KSArIHRhcmdldClcclxuICAgICAgICAgICAgICAgIGlmIChzYW1wbGUgPj0gbWluICYmIHNhbXBsZSA8PSBtYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhbXBsZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmdlKG1pbiwgbWF4KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBoZXggY29sb3IgKDAgLSAweGZmZmZmZilcclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgY29sb3IoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldCgweGZmZmZmZilcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmFuZG9tKCkiXX0=