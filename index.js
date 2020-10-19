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
            var u = this.get() + this.get();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLElBQUksS0FBSyxLQUFMLEVBQVY7QUFDQSxnQkFBTSxJQUFJLEtBQUssR0FBTCxLQUFhLEtBQUssR0FBTCxFQUF2QjtBQUNBLGdCQUFNLElBQUksSUFBSSxDQUFKLEdBQVEsSUFBSSxDQUFaLEdBQWdCLENBQTFCO0FBQ0EsZ0JBQUksS0FBSixFQUFXO0FBQ1AsdUJBQU8sQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFKLEdBQWtCLE1BQXZCLEVBQStCLElBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQUosR0FBa0IsTUFBckQsQ0FBUDtBQUNILGFBRkQsTUFFTztBQUNILHVCQUFPLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBSSxJQUFJLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBSixHQUFrQixNQUFqQyxDQUFELEVBQTJDLEtBQUssS0FBTCxDQUFXLElBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQUosR0FBa0IsTUFBakMsQ0FBM0MsQ0FBUDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Z0NBSVE7QUFDSixtQkFBTyxLQUFLLEdBQUwsQ0FBUyxRQUFULENBQVA7QUFDSDs7Ozs7O0FBR0wsT0FBTyxPQUFQLEdBQWlCLElBQUksTUFBSixFQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHl5LXJhbmRvbVxuLy8gYnkgRGF2aWQgRmlnYXRuZXJcbi8vIE1JVCBsaWNlbnNlXG4vLyBjb3B5cmlnaHQgWU9QRVkgWU9QRVkgTExDIDIwMTYtMTdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGZpZy9yYW5kb21cblxuY29uc3Qgc2VlZHJhbmRvbSA9IHJlcXVpcmUoJ3NlZWRyYW5kb20nKVxuXG5jbGFzcyBSYW5kb20ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IE1hdGgucmFuZG9tXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2VuZXJhdGVzIGEgc2VlZGVkIG51bWJlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbUFJORz1cImFsZWFcIl0gLSBuYW1lIG9mIGFsZ29yaXRobSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGJhdS9zZWVkcmFuZG9tXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxzdHJpbmcpfSBbc3RhdGVdIC0gY2FuIGluY2x1ZGUgdGhlIHN0YXRlIHJldHVybmVkIGZyb20gc2F2ZSgpXG4gICAgICovXG4gICAgc2VlZChzZWVkLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVtvcHRpb25zLlBSTkcgfHwgJ2FsZWEnXShzZWVkLCB7IHN0YXRlOiBvcHRpb25zLnN0YXRlIH0pXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzYXZlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcbiAgICAgKiBjYW4gb25seSBiZSB1c2VkIGFmdGVyIFJhbmRvbS5zZWVkKCkgaXMgY2FsbGVkIHdpdGggb3B0aW9ucy5zdGF0ZSA9IHRydWVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHNhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdlbmVyYXRvciAhPT0gTWF0aC5yYW5kb20pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvci5zdGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXN0b3JlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdGVcbiAgICAgKi9cbiAgICByZXN0b3JlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVt0aGlzLm9wdGlvbnMuUFJORyB8fCAnYWxlYSddKCcnLCB7IHN0YXRlIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlcyB0aGUgZ2VuZXJhdG9yIHRvIHVzZSB0aGUgb2xkIE1hdGguc2luLWJhc2VkIHJhbmRvbSBmdW5jdGlvblxuICAgICAqIGJhc2VkIG9uIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvamF2YXNjcmlwdC1yYW5kb20tc2VlZHNcbiAgICAgKiAoZGVwcmVjYXRlZCkgVXNlIG9ubHkgZm9yIGNvbXBhdGliaWxpdHkgcHVycG9zZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqL1xuICAgIHNlZWRPbGQoc2VlZCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguc2luKHNlZWQrKykgKiAxMDAwMFxuICAgICAgICAgICAgcmV0dXJuIHggLSBNYXRoLmZsb29yKHgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYSBzZXBhcmF0ZSByYW5kb20gZ2VuZXJhdG9yIHVzaW5nIHRoZSBzZWVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgc2VwYXJhdGVTZWVkKHNlZWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tID0gbmV3IFJhbmRvbSgpXG4gICAgICAgIHJhbmRvbS5zZWVkKHNlZWQpXG4gICAgICAgIHJldHVybiByYW5kb21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXNldHMgdGhlIHJhbmRvbSBudW1iZXIgdGhpcy5nZW5lcmF0b3IgdG8gTWF0aC5yYW5kb20oKVxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IE1hdGgucmFuZG9tXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgdXNpbmcgdGhlIHRoaXMuZ2VuZXJhdG9yIGJldHdlZW4gWzAsIGNlaWxpbmcgLSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjZWlsaW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldChjZWlsaW5nLCB1c2VGbG9hdCkge1xuICAgICAgICBjb25zdCBuZWdhdGl2ZSA9IGNlaWxpbmcgPCAwID8gLTEgOiAxXG4gICAgICAgIGNlaWxpbmcgKj0gbmVnYXRpdmVcbiAgICAgICAgbGV0IHJlc3VsdFxuICAgICAgICBpZiAodXNlRmxvYXQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQgKiBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRIdWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmFuZG9tIG51bWJlciBbbWlkZGxlIC0gcmFuZ2UsIG1pZGRsZSArIHJhbmdlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVsdGFcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgbWlkZGxlKG1pZGRsZSwgZGVsdGEsIHVzZUZsb2F0KSB7XG4gICAgICAgIGNvbnN0IGhhbGYgPSBkZWx0YSAvIDJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWlkZGxlIC0gaGFsZiwgbWlkZGxlICsgaGFsZiwgdXNlRmxvYXQpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmFuZG9tIG51bWJlciBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdIGlmIHRydWUsIHRoZW4gcmFuZ2UgaXMgKHN0YXJ0LCBlbmQpLS1pLmUuLCBub3QgaW5jbHVzaXZlIHRvIHN0YXJ0IGFuZCBlbmRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgcmFuZ2Uoc3RhcnQsIGVuZCwgdXNlRmxvYXQpIHtcbiAgICAgICAgLy8gY2FzZSB3aGVyZSB0aGVyZSBpcyBubyByYW5nZVxuICAgICAgICBpZiAoZW5kID09PSBzdGFydCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoZW5kIC0gc3RhcnQsIHRydWUpICsgc3RhcnRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByYW5nZVxuICAgICAgICAgICAgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSAtc3RhcnQgKyBlbmQgKyAxXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA+IDApIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCArIDFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gc3RhcnQgLSAxXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAxXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCAtIDFcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiByYW5nZSkgKyBzdGFydFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgcmFuZ2VNdWx0aXBsZShzdGFydCwgZW5kLCBjb3VudCwgdXNlRmxvYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMucmFuZ2Uoc3RhcnQsIGVuZCwgdXNlRmxvYXQpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFuIGFycmF5IG9mIHJhbmRvbSBudW1iZXJzIGJldHdlZW4gW21pZGRsZSAtIHJhbmdlLCBtaWRkbGUgKyByYW5nZV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWlkZGxlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhbmdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgbWlkZGxlTXVsdGlwbGUobWlkZGxlLCByYW5nZSwgY291bnQsIHVzZUZsb2F0KSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKG1pZGRsZShtaWRkbGUsIHJhbmdlLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjaGFuY2U9MC41XVxuICAgICAqIHJldHVybnMgcmFuZG9tIHNpZ24gKGVpdGhlciArMSBvciAtMSlcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2lnbihjaGFuY2UpIHtcbiAgICAgICAgY2hhbmNlID0gY2hhbmNlIHx8IDAuNVxuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IGNoYW5jZSA/IDEgOiAtMVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbGxzIHlvdSB3aGV0aGVyIGEgcmFuZG9tIGNoYW5jZSB3YXMgYWNoaWV2ZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3BlcmNlbnQ9MC41XVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2hhbmNlKHBlcmNlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yKCkgPCAocGVyY2VudCB8fCAwLjUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBhbmdsZSBpbiByYWRpYW5zIFswIC0gMiAqIE1hdGguUEkpXG4gICAgICovXG4gICAgYW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChNYXRoLlBJICogMiwgdHJ1ZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaHVmZmxlIGFycmF5IChlaXRoZXIgaW4gcGxhY2Ugb3IgY29waWVkKVxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvcHk9ZmFsc2VdIHdoZXRoZXIgdG8gc2h1ZmZsZSBpbiBwbGFjZSAoZGVmYXVsdCkgb3IgcmV0dXJuIGEgbmV3IHNodWZmbGVkIGFycmF5XG4gICAgICogQHJldHVybiB7QXJyYXl9IGEgc2h1ZmZsZWQgYXJyYXlcbiAgICAgKi9cbiAgICBzaHVmZmxlKGFycmF5LCBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5KSB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5LnNsaWNlKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleFxuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSB0aGlzLmdldChjdXJyZW50SW5kZXgpXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMVxuXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF1cbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF1cbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGlja3MgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIHBpY2soYXJyYXksIHJlbW92ZSkge1xuICAgICAgICBpZiAoIXJlbW92ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5W3RoaXMuZ2V0KGFycmF5Lmxlbmd0aCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwaWNrID0gdGhpcy5nZXQoYXJyYXkubGVuZ3RoKVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGFycmF5W3BpY2tdXG4gICAgICAgICAgICBhcnJheS5zcGxpY2UocGljaywgMSlcbiAgICAgICAgICAgIHJldHVybiB0ZW1wXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0XG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI1MzIyMTgvcGljay1yYW5kb20tcHJvcGVydHktZnJvbS1hLWphdmFzY3JpcHQtb2JqZWN0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9ialxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgcHJvcGVydHkob2JqKSB7XG4gICAgICAgIHZhciByZXN1bHRcbiAgICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmNlKDEgLyArK2NvdW50KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHByb3BcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlcyBhIHJhbmRvbSBzZXQgd2hlcmUgZWFjaCBlbnRyeSBpcyBhIHZhbHVlIGJldHdlZW4gW21pbiwgbWF4XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFtb3VudCBvZiBudW1iZXJzIGluIHNldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119XG4gICAgICovXG4gICAgc2V0KG1pbiwgbWF4LCBhbW91bnQpIHtcbiAgICAgICAgdmFyIHNldCA9IFtdLCBhbGwgPSBbXSwgaVxuICAgICAgICBmb3IgKGkgPSBtaW47IGkgPCBtYXg7IGkrKykge1xuICAgICAgICAgICAgYWxsLnB1c2goaSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbW91bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5nZXQoYWxsLmxlbmd0aClcbiAgICAgICAgICAgIHNldC5wdXNoKGFsbFtmb3VuZF0pXG4gICAgICAgICAgICBhbGwuc3BsaWNlKGZvdW5kLCAxKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSBzZXQgb2YgbnVtYmVycyB3aXRoIGEgcmFuZG9tbHkgZXZlbiBkaXN0cmlidXRpb24gKGkuZS4sIG5vIG92ZXJsYXBwaW5nIGFuZCBmaWxsaW5nIHRoZSBzcGFjZSlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IG9mIG5vbi1zdGFydC9lbmQgcG9pbnRzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZVN0YXJ0PWZhbHNlXSBpbmNsdWRlcyBzdGFydCBwb2ludCAoY291bnQrKylcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbmNsdWRlRW5kPWZhbHNlXSBpbmNsdWRlcyBlbmQgcG9pbnQgKGNvdW50KyspXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBkaXN0cmlidXRpb24oc3RhcnQsIGVuZCwgY291bnQsIGluY2x1ZGVTdGFydCwgaW5jbHVkZUVuZCwgdXNlRmxvYXQpIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcigoZW5kIC0gc3RhcnQpIC8gY291bnQpXG4gICAgICAgIHZhciBoYWxmSW50ZXJ2YWwgPSBpbnRlcnZhbCAvIDJcbiAgICAgICAgdmFyIHF1YXJ0ZXJJbnRlcnZhbCA9IGludGVydmFsIC8gNFxuICAgICAgICB2YXIgc2V0ID0gW11cbiAgICAgICAgaWYgKGluY2x1ZGVTdGFydCkge1xuICAgICAgICAgICAgc2V0LnB1c2goc3RhcnQpXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBzZXQucHVzaChzdGFydCArIGkgKiBpbnRlcnZhbCArIGhhbGZJbnRlcnZhbCArIHRoaXMucmFuZ2UoLXF1YXJ0ZXJJbnRlcnZhbCwgcXVhcnRlckludGVydmFsLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluY2x1ZGVFbmQpIHtcbiAgICAgICAgICAgIHNldC5wdXNoKGVuZClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgYmFzZWQgb24gd2VpZ2h0ZWQgcHJvYmFiaWxpdHkgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIyNjU2MTI2L2phdmFzY3JpcHQtcmFuZG9tLW51bWJlci13aXRoLXdlaWdodGVkLXByb2JhYmlsaXR5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGFyZ2V0IGZvciBhdmVyYWdlIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZGRldiAtIHN0YW5kYXJkIGRldmlhdGlvblxuICAgICAqL1xuICAgIHdlaWdodGVkUHJvYmFiaWxpdHlJbnQobWluLCBtYXgsIHRhcmdldCwgc3RkZGV2KSB7XG4gICAgICAgIGZ1bmN0aW9uIG5vcm1SYW5kKCkge1xuICAgICAgICAgICAgbGV0IHgxLCB4MiwgcmFkXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgeDEgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgeDIgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDJcbiAgICAgICAgICAgIH0gd2hpbGUgKHJhZCA+PSAxIHx8IHJhZCA9PT0gMClcbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKVxuICAgICAgICAgICAgcmV0dXJuIHgxICogY1xuICAgICAgICB9XG5cbiAgICAgICAgc3RkZGV2ID0gc3RkZGV2IHx8IDFcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjgxNTQ2KSB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbXBsZSA9ICgobm9ybVJhbmQoKSAqIHN0ZGRldikgKyB0YXJnZXQpXG4gICAgICAgICAgICAgICAgaWYgKHNhbXBsZSA+PSBtaW4gJiYgc2FtcGxlIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2FtcGxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWluLCBtYXgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciB3aXRoaW4gYSBjaXJjbGUgd2l0aCBhIG5vcm1hbCBkaXN0cmlidXRpb25cbiAgICAgKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM4MDU1LzE5NTU5OTdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7Ym9vbH0gW2Zsb2F0XVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gW3gsIHldXG4gICAgICovXG4gICAgY2lyY2xlKHgsIHksIHJhZGl1cywgZmxvYXQpIHtcbiAgICAgICAgY29uc3QgdCA9IHRoaXMuYW5nbGUoKVxuICAgICAgICBjb25zdCB1ID0gdGhpcy5nZXQoKSArIHRoaXMuZ2V0KClcbiAgICAgICAgY29uc3QgciA9IHUgPiAxID8gMiAtIHUgOiB1XG4gICAgICAgIGlmIChmbG9hdCkge1xuICAgICAgICAgICAgcmV0dXJuIFt4ICsgciAqIE1hdGguY29zKHQpICogcmFkaXVzLCB5ICsgciAqIE1hdGguc2luKHQpICogcmFkaXVzXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtNYXRoLnJvdW5kKHggKyByICogTWF0aC5jb3ModCkgKiByYWRpdXMpLCBNYXRoLnJvdW5kKHkgKyByICogTWF0aC5zaW4odCkgKiByYWRpdXMpXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIGhleCBjb2xvciAoMCAtIDB4ZmZmZmZmKVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBjb2xvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KDB4ZmZmZmZmKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmFuZG9tKCkiXX0=