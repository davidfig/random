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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB5eS1yYW5kb21cbi8vIGJ5IERhdmlkIEZpZ2F0bmVyXG4vLyBNSVQgbGljZW5zZVxuLy8gY29weXJpZ2h0IFlPUEVZIFlPUEVZIExMQyAyMDE2LTE3XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRmaWcvcmFuZG9tXG5cbmNvbnN0IHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJylcblxuY2xhc3MgUmFuZG9tXG57XG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBNYXRoLnJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdlbmVyYXRlcyBhIHNlZWRlZCBudW1iZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW1BSTkc9XCJhbGVhXCJdIC0gbmFtZSBvZiBhbGdvcml0aG0sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRiYXUvc2VlZHJhbmRvbVxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58c3RyaW5nKX0gW3N0YXRlXSAtIGNhbiBpbmNsdWRlIHRoZSBzdGF0ZSByZXR1cm5lZCBmcm9tIHNhdmUoKVxuICAgICAqL1xuICAgIHNlZWQoc2VlZCwgb3B0aW9ucylcbiAgICB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVtvcHRpb25zLlBSTkcgfHwgJ2FsZWEnXShzZWVkLCB7IHN0YXRlOiBvcHRpb25zLnN0YXRlIH0pXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzYXZlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcbiAgICAgKiBjYW4gb25seSBiZSB1c2VkIGFmdGVyIFJhbmRvbS5zZWVkKCkgaXMgY2FsbGVkIHdpdGggb3B0aW9ucy5zdGF0ZSA9IHRydWVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHNhdmUoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdG9yICE9PSBNYXRoLnJhbmRvbSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yLnN0YXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc3RvcmVzIHRoZSBzdGF0ZSBvZiB0aGUgcmFuZG9tIGdlbmVyYXRvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHJlc3RvcmUoc3RhdGUpXG4gICAge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IHNlZWRyYW5kb21bdGhpcy5vcHRpb25zLlBSTkcgfHwgJ2FsZWEnXSgnJywgeyBzdGF0ZSB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoYW5nZXMgdGhlIGdlbmVyYXRvciB0byB1c2UgdGhlIG9sZCBNYXRoLnNpbi1iYXNlZCByYW5kb20gZnVuY3Rpb25cbiAgICAgKiBiYXNlZCBvbiA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTIxMjk1L2phdmFzY3JpcHQtcmFuZG9tLXNlZWRzXG4gICAgICogKGRlcHJlY2F0ZWQpIFVzZSBvbmx5IGZvciBjb21wYXRpYmlsaXR5IHB1cnBvc2VzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKi9cbiAgICBzZWVkT2xkKHNlZWQpXG4gICAge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguc2luKHNlZWQrKykgKiAxMDAwMFxuICAgICAgICAgICAgcmV0dXJuIHggLSBNYXRoLmZsb29yKHgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYSBzZXBhcmF0ZSByYW5kb20gZ2VuZXJhdG9yIHVzaW5nIHRoZSBzZWVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgc2VwYXJhdGVTZWVkKHNlZWQpXG4gICAge1xuICAgICAgICBjb25zdCByYW5kb20gPSBuZXcgUmFuZG9tKClcbiAgICAgICAgcmFuZG9tLnNlZWQoc2VlZClcbiAgICAgICAgcmV0dXJuIHJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc2V0cyB0aGUgcmFuZG9tIG51bWJlciB0aGlzLmdlbmVyYXRvciB0byBNYXRoLnJhbmRvbSgpXG4gICAgICovXG4gICAgcmVzZXQoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBNYXRoLnJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIHVzaW5nIHRoZSB0aGlzLmdlbmVyYXRvciBiZXR3ZWVuIFswLCBjZWlsaW5nIC0gMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY2VpbGluZ1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQoY2VpbGluZywgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICBjb25zdCBuZWdhdGl2ZSA9IGNlaWxpbmcgPCAwID8gLTEgOiAxXG4gICAgICAgIGNlaWxpbmcgKj0gbmVnYXRpdmVcbiAgICAgICAgbGV0IHJlc3VsdFxuICAgICAgICBpZiAodXNlRmxvYXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQgKiBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRIdWdlKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByYW5kb20gbnVtYmVyIFttaWRkbGUgLSByYW5nZSwgbWlkZGxlICsgcmFuZ2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pZGRsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBtaWRkbGUobWlkZGxlLCBkZWx0YSwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICBjb25zdCBoYWxmID0gZGVsdGEgLyAyXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmdlKG1pZGRsZSAtIGhhbGYsIG1pZGRsZSArIGhhbGYsIHVzZUZsb2F0KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJhbmRvbSBudW1iZXIgW3N0YXJ0LCBlbmRdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXSBpZiB0cnVlLCB0aGVuIHJhbmdlIGlzIChzdGFydCwgZW5kKS0taS5lLiwgbm90IGluY2x1c2l2ZSB0byBzdGFydCBhbmQgZW5kXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIHJhbmdlKHN0YXJ0LCBlbmQsIHVzZUZsb2F0KVxuICAgIHtcbiAgICAgICAgLy8gY2FzZSB3aGVyZSB0aGVyZSBpcyBubyByYW5nZVxuICAgICAgICBpZiAoZW5kID09PSBzdGFydClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGVuZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUZsb2F0KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoZW5kIC0gc3RhcnQsIHRydWUpICsgc3RhcnRcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCByYW5nZVxuICAgICAgICAgICAgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gLXN0YXJ0ICsgZW5kICsgMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzdGFydCAtIDFcbiAgICAgICAgICAgICAgICBzdGFydCA9IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gZW5kIC0gc3RhcnQgLSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiByYW5nZSkgKyBzdGFydFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgcmFuZ2VNdWx0aXBsZShzdGFydCwgZW5kLCBjb3VudCwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy5yYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbbWlkZGxlIC0gcmFuZ2UsIG1pZGRsZSArIHJhbmdlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBtaWRkbGVNdWx0aXBsZShtaWRkbGUsIHJhbmdlLCBjb3VudCwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICBjb25zdCBhcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgYXJyYXkucHVzaChtaWRkbGUobWlkZGxlLCByYW5nZSwgdXNlRmxvYXQpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY2hhbmNlPTAuNV1cbiAgICAgKiByZXR1cm5zIHJhbmRvbSBzaWduIChlaXRoZXIgKzEgb3IgLTEpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNpZ24oY2hhbmNlKVxuICAgIHtcbiAgICAgICAgY2hhbmNlID0gY2hhbmNlIHx8IDAuNVxuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IGNoYW5jZSA/IDEgOiAtMVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbGxzIHlvdSB3aGV0aGVyIGEgcmFuZG9tIGNoYW5jZSB3YXMgYWNoaWV2ZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3BlcmNlbnQ9MC41XVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2hhbmNlKHBlcmNlbnQpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IChwZXJjZW50IHx8IDAuNSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIGFuZ2xlIGluIHJhZGlhbnMgWzAgLSAyICogTWF0aC5QSSlcbiAgICAgKi9cbiAgICBhbmdsZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoTWF0aC5QSSAqIDIsIHRydWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2h1ZmZsZSBhcnJheSAoZWl0aGVyIGluIHBsYWNlIG9yIGNvcGllZClcbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjb3B5PWZhbHNlXSB3aGV0aGVyIHRvIHNodWZmbGUgaW4gcGxhY2UgKGRlZmF1bHQpIG9yIHJldHVybiBhIG5ldyBzaHVmZmxlZCBhcnJheVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhIHNodWZmbGVkIGFycmF5XG4gICAgICovXG4gICAgc2h1ZmZsZShhcnJheSwgY29weSlcbiAgICB7XG4gICAgICAgIGlmIChjb3B5KVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5LnNsaWNlKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleFxuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSB0aGlzLmdldChjdXJyZW50SW5kZXgpXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMVxuXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF1cbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF1cbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGlja3MgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIHBpY2soYXJyYXksIHJlbW92ZSlcbiAgICB7XG4gICAgICAgIGlmICghcmVtb3ZlKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbdGhpcy5nZXQoYXJyYXkubGVuZ3RoKV1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHBpY2sgPSB0aGlzLmdldChhcnJheS5sZW5ndGgpXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyYXlbcGlja11cbiAgICAgICAgICAgIGFycmF5LnNwbGljZShwaWNrLCAxKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gcHJvcGVydHkgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjUzMjIxOC9waWNrLXJhbmRvbS1wcm9wZXJ0eS1mcm9tLWEtamF2YXNjcmlwdC1vYmplY3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBwcm9wZXJ0eShvYmopXG4gICAge1xuICAgICAgICB2YXIgcmVzdWx0XG4gICAgICAgIHZhciBjb3VudCA9IDBcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5jZSgxIC8gKytjb3VudCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcHJvcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGVzIGEgcmFuZG9tIHNldCB3aGVyZSBlYWNoIGVudHJ5IGlzIGEgdmFsdWUgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW1vdW50IG9mIG51bWJlcnMgaW4gc2V0XG4gICAgICogQHBhcmFtIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBzZXQobWluLCBtYXgsIGFtb3VudClcbiAgICB7XG4gICAgICAgIHZhciBzZXQgPSBbXSwgYWxsID0gW10sIGlcbiAgICAgICAgZm9yIChpID0gbWluOyBpIDwgbWF4OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFsbC5wdXNoKGkpXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYW1vdW50OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZ2V0KGFsbC5sZW5ndGgpXG4gICAgICAgICAgICBzZXQucHVzaChhbGxbZm91bmRdKVxuICAgICAgICAgICAgYWxsLnNwbGljZShmb3VuZCwgMSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgc2V0IG9mIG51bWJlcnMgd2l0aCBhIHJhbmRvbWx5IGV2ZW4gZGlzdHJpYnV0aW9uIChpLmUuLCBubyBvdmVybGFwcGluZyBhbmQgZmlsbGluZyB0aGUgc3BhY2UpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBvZiBub24tc3RhcnQvZW5kIHBvaW50c1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luY2x1ZGVTdGFydD1mYWxzZV0gaW5jbHVkZXMgc3RhcnQgcG9pbnQgKGNvdW50KyspXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZUVuZD1mYWxzZV0gaW5jbHVkZXMgZW5kIHBvaW50IChjb3VudCsrKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119XG4gICAgICovXG4gICAgZGlzdHJpYnV0aW9uKHN0YXJ0LCBlbmQsIGNvdW50LCBpbmNsdWRlU3RhcnQsIGluY2x1ZGVFbmQsIHVzZUZsb2F0KVxuICAgIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcigoZW5kIC0gc3RhcnQpIC8gY291bnQpXG4gICAgICAgIHZhciBoYWxmSW50ZXJ2YWwgPSBpbnRlcnZhbCAvIDJcbiAgICAgICAgdmFyIHF1YXJ0ZXJJbnRlcnZhbCA9IGludGVydmFsIC8gNFxuICAgICAgICB2YXIgc2V0ID0gW11cbiAgICAgICAgaWYgKGluY2x1ZGVTdGFydClcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0LnB1c2goc3RhcnQpXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXQucHVzaChzdGFydCArIGkgKiBpbnRlcnZhbCArIGhhbGZJbnRlcnZhbCArIHRoaXMucmFuZ2UoLXF1YXJ0ZXJJbnRlcnZhbCwgcXVhcnRlckludGVydmFsLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluY2x1ZGVFbmQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNldC5wdXNoKGVuZClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgYmFzZWQgb24gd2VpZ2h0ZWQgcHJvYmFiaWxpdHkgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIyNjU2MTI2L2phdmFzY3JpcHQtcmFuZG9tLW51bWJlci13aXRoLXdlaWdodGVkLXByb2JhYmlsaXR5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGFyZ2V0IGZvciBhdmVyYWdlIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZGRldiAtIHN0YW5kYXJkIGRldmlhdGlvblxuICAgICAqL1xuICAgIHdlaWdodGVkUHJvYmFiaWxpdHlJbnQobWluLCBtYXgsIHRhcmdldCwgc3RkZGV2KVxuICAgIHtcbiAgICAgICAgZnVuY3Rpb24gbm9ybVJhbmQoKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgeDEsIHgyLCByYWRcbiAgICAgICAgICAgIGRvXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgeDEgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgeDIgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDJcbiAgICAgICAgICAgIH0gd2hpbGUgKHJhZCA+PSAxIHx8IHJhZCA9PT0gMClcbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKVxuICAgICAgICAgICAgcmV0dXJuIHgxICogY1xuICAgICAgICB9XG5cbiAgICAgICAgc3RkZGV2ID0gc3RkZGV2IHx8IDFcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjgxNTQ2KVxuICAgICAgICB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYW1wbGUgPSAoKG5vcm1SYW5kKCkgKiBzdGRkZXYpICsgdGFyZ2V0KVxuICAgICAgICAgICAgICAgIGlmIChzYW1wbGUgPj0gbWluICYmIHNhbXBsZSA8PSBtYXgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2FtcGxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWluLCBtYXgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaGV4IGNvbG9yICgwIC0gMHhmZmZmZmYpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGNvbG9yKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgweGZmZmZmZilcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFJhbmRvbSgpIl19