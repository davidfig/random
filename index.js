"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
// yy-random
// by David Figatner
// MIT license
// copyright YOPEY YOPEY LLC 2016-17
// https://github.com/davidfig/random

var seedrandom = require('seedrandom');
var Random = /*#__PURE__*/function () {
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
  return _createClass(Random, [{
    key: "seed",
    value: function seed(_seed, options) {
      options = options || {};
      this.generator = seedrandom[options.PRNG || 'alea'](_seed, {
        state: options.state
      });
      this.options = options;
    }

    /**
     * saves the state of the random generator
     * can only be used after Random.seed() is called with options.state = true
     * @returns {number} state
     */
  }, {
    key: "save",
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
    key: "restore",
    value: function restore(state) {
      this.generator = seedrandom[this.options.PRNG || 'alea']('', {
        state: state
      });
    }

    /**
     * changes the generator to use the old Math.sin-based random function
     * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
     * (deprecated) Use only for compatibility purposes
     * @param {number} seed
     */
  }, {
    key: "seedOld",
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
    key: "separateSeed",
    value: function separateSeed(seed) {
      var random = new Random();
      random.seed(seed);
      return random;
    }

    /**
     * resets the random number this.generator to Math.random()
     */
  }, {
    key: "reset",
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
    key: "get",
    value: function get(ceiling, useFloat) {
      var negative = ceiling < 0 ? -1 : 1;
      ceiling *= negative;
      var result;
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
    key: "getHuge",
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
    key: "middle",
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
    key: "range",
    value: function range(start, end, useFloat) {
      // case where there is no range
      if (end === start) {
        return end;
      }
      if (useFloat) {
        return this.get(end - start, true) + start;
      } else {
        var _range;
        if (start < 0 && end > 0) {
          _range = -start + end + 1;
        } else if (start === 0 && end > 0) {
          _range = end + 1;
        } else if (start < 0 && end === 0) {
          _range = start - 1;
          start = 1;
        } else if (start < 0 && end < 0) {
          _range = end - start - 1;
        } else {
          _range = end - start + 1;
        }
        return Math.floor(this.generator() * _range) + start;
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
    key: "rangeMultiple",
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
    key: "middleMultiple",
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
    key: "sign",
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
    key: "chance",
    value: function chance(percent) {
      return this.generator() < (percent || 0.5);
    }

    /**
     * returns a random angle in radians [0 - 2 * Math.PI)
     */
  }, {
    key: "angle",
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
    key: "shuffle",
    value: function shuffle(array, copy) {
      if (copy) {
        array = array.slice();
      }
      if (array.length === 0) {
        return array;
      }
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

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
    key: "pick",
    value: function pick(array, remove) {
      if (!remove) {
        return array[this.get(array.length)];
      } else {
        var _pick = this.get(array.length);
        var temp = array[_pick];
        array.splice(_pick, 1);
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
    key: "select",
    value: function select(array, count) {
      var select = _toConsumableArray(array);
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
    key: "property",
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
    key: "set",
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
    key: "distribution",
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
    key: "weightedProbabilityInt",
    value: function weightedProbabilityInt(min, max, target, stddev) {
      function normRand() {
        var x1, x2, rad;
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
    key: "circle",
    value: function circle(x, y, radius, _float) {
      var t = this.angle();
      var u = this.get(1, true) + this.get(1, true);
      var r = u > 1 ? 2 - u : u;
      if (_float) {
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
    key: "color",
    value: function color() {
      return this.get(0xffffff);
    }
  }]);
}();
module.exports = new Random();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJuYW1lcyI6WyJzZWVkcmFuZG9tIiwicmVxdWlyZSIsIlJhbmRvbSIsIl9jbGFzc0NhbGxDaGVjayIsImdlbmVyYXRvciIsIk1hdGgiLCJyYW5kb20iLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsInNlZWQiLCJvcHRpb25zIiwiUFJORyIsInN0YXRlIiwic2F2ZSIsInJlc3RvcmUiLCJzZWVkT2xkIiwieCIsInNpbiIsImZsb29yIiwic2VwYXJhdGVTZWVkIiwicmVzZXQiLCJnZXQiLCJjZWlsaW5nIiwidXNlRmxvYXQiLCJuZWdhdGl2ZSIsInJlc3VsdCIsImdldEh1Z2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwibWlkZGxlIiwiZGVsdGEiLCJoYWxmIiwicmFuZ2UiLCJzdGFydCIsImVuZCIsInJhbmdlTXVsdGlwbGUiLCJjb3VudCIsImFycmF5IiwiaSIsInB1c2giLCJtaWRkbGVNdWx0aXBsZSIsInNpZ24iLCJjaGFuY2UiLCJwZXJjZW50IiwiYW5nbGUiLCJQSSIsInNodWZmbGUiLCJjb3B5Iiwic2xpY2UiLCJsZW5ndGgiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwicGljayIsInJlbW92ZSIsInRlbXAiLCJzcGxpY2UiLCJzZWxlY3QiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJzZWxlY3RlZCIsImluZGV4IiwiYXBwbHkiLCJwcm9wZXJ0eSIsIm9iaiIsInByb3AiLCJzZXQiLCJtaW4iLCJtYXgiLCJhbW91bnQiLCJhbGwiLCJmb3VuZCIsImRpc3RyaWJ1dGlvbiIsImluY2x1ZGVTdGFydCIsImluY2x1ZGVFbmQiLCJpbnRlcnZhbCIsImhhbGZJbnRlcnZhbCIsInF1YXJ0ZXJJbnRlcnZhbCIsIndlaWdodGVkUHJvYmFiaWxpdHlJbnQiLCJ0YXJnZXQiLCJzdGRkZXYiLCJub3JtUmFuZCIsIngxIiwieDIiLCJyYWQiLCJjIiwic3FydCIsImxvZyIsInNhbXBsZSIsImNpcmNsZSIsInkiLCJyYWRpdXMiLCJmbG9hdCIsInQiLCJ1IiwiciIsImNvcyIsInJvdW5kIiwiY29sb3IiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsicmFuZG9tLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHl5LXJhbmRvbVxuLy8gYnkgRGF2aWQgRmlnYXRuZXJcbi8vIE1JVCBsaWNlbnNlXG4vLyBjb3B5cmlnaHQgWU9QRVkgWU9QRVkgTExDIDIwMTYtMTdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGZpZy9yYW5kb21cblxuY29uc3Qgc2VlZHJhbmRvbSA9IHJlcXVpcmUoJ3NlZWRyYW5kb20nKVxuXG5jbGFzcyBSYW5kb20ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IE1hdGgucmFuZG9tXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2VuZXJhdGVzIGEgc2VlZGVkIG51bWJlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbUFJORz1cImFsZWFcIl0gLSBuYW1lIG9mIGFsZ29yaXRobSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGJhdS9zZWVkcmFuZG9tXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxzdHJpbmcpfSBbc3RhdGVdIC0gY2FuIGluY2x1ZGUgdGhlIHN0YXRlIHJldHVybmVkIGZyb20gc2F2ZSgpXG4gICAgICovXG4gICAgc2VlZChzZWVkLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVtvcHRpb25zLlBSTkcgfHwgJ2FsZWEnXShzZWVkLCB7IHN0YXRlOiBvcHRpb25zLnN0YXRlIH0pXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzYXZlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcbiAgICAgKiBjYW4gb25seSBiZSB1c2VkIGFmdGVyIFJhbmRvbS5zZWVkKCkgaXMgY2FsbGVkIHdpdGggb3B0aW9ucy5zdGF0ZSA9IHRydWVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHNhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdlbmVyYXRvciAhPT0gTWF0aC5yYW5kb20pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvci5zdGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXN0b3JlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdGVcbiAgICAgKi9cbiAgICByZXN0b3JlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVt0aGlzLm9wdGlvbnMuUFJORyB8fCAnYWxlYSddKCcnLCB7IHN0YXRlIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlcyB0aGUgZ2VuZXJhdG9yIHRvIHVzZSB0aGUgb2xkIE1hdGguc2luLWJhc2VkIHJhbmRvbSBmdW5jdGlvblxuICAgICAqIGJhc2VkIG9uIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjEyOTUvamF2YXNjcmlwdC1yYW5kb20tc2VlZHNcbiAgICAgKiAoZGVwcmVjYXRlZCkgVXNlIG9ubHkgZm9yIGNvbXBhdGliaWxpdHkgcHVycG9zZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqL1xuICAgIHNlZWRPbGQoc2VlZCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguc2luKHNlZWQrKykgKiAxMDAwMFxuICAgICAgICAgICAgcmV0dXJuIHggLSBNYXRoLmZsb29yKHgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYSBzZXBhcmF0ZSByYW5kb20gZ2VuZXJhdG9yIHVzaW5nIHRoZSBzZWVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgc2VwYXJhdGVTZWVkKHNlZWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tID0gbmV3IFJhbmRvbSgpXG4gICAgICAgIHJhbmRvbS5zZWVkKHNlZWQpXG4gICAgICAgIHJldHVybiByYW5kb21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXNldHMgdGhlIHJhbmRvbSBudW1iZXIgdGhpcy5nZW5lcmF0b3IgdG8gTWF0aC5yYW5kb20oKVxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IE1hdGgucmFuZG9tXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgdXNpbmcgdGhlIHRoaXMuZ2VuZXJhdG9yIGJldHdlZW4gWzAsIGNlaWxpbmcgLSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjZWlsaW5nXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldChjZWlsaW5nLCB1c2VGbG9hdCkge1xuICAgICAgICBjb25zdCBuZWdhdGl2ZSA9IGNlaWxpbmcgPCAwID8gLTEgOiAxXG4gICAgICAgIGNlaWxpbmcgKj0gbmVnYXRpdmVcbiAgICAgICAgbGV0IHJlc3VsdFxuICAgICAgICBpZiAodXNlRmxvYXQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQgKiBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRIdWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmFuZG9tIG51bWJlciBbbWlkZGxlIC0gcmFuZ2UsIG1pZGRsZSArIHJhbmdlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVsdGFcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgbWlkZGxlKG1pZGRsZSwgZGVsdGEsIHVzZUZsb2F0KSB7XG4gICAgICAgIGNvbnN0IGhhbGYgPSBkZWx0YSAvIDJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWlkZGxlIC0gaGFsZiwgbWlkZGxlICsgaGFsZiwgdXNlRmxvYXQpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmFuZG9tIG51bWJlciBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdIGlmIHRydWUsIHRoZW4gcmFuZ2UgaXMgKHN0YXJ0LCBlbmQpLS1pLmUuLCBub3QgaW5jbHVzaXZlIHRvIHN0YXJ0IGFuZCBlbmRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgcmFuZ2Uoc3RhcnQsIGVuZCwgdXNlRmxvYXQpIHtcbiAgICAgICAgLy8gY2FzZSB3aGVyZSB0aGVyZSBpcyBubyByYW5nZVxuICAgICAgICBpZiAoZW5kID09PSBzdGFydCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoZW5kIC0gc3RhcnQsIHRydWUpICsgc3RhcnRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByYW5nZVxuICAgICAgICAgICAgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSAtc3RhcnQgKyBlbmQgKyAxXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA+IDApIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCArIDFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gc3RhcnQgLSAxXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAxXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCAtIDFcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiByYW5nZSkgKyBzdGFydFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgcmFuZ2VNdWx0aXBsZShzdGFydCwgZW5kLCBjb3VudCwgdXNlRmxvYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMucmFuZ2Uoc3RhcnQsIGVuZCwgdXNlRmxvYXQpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFuIGFycmF5IG9mIHJhbmRvbSBudW1iZXJzIGJldHdlZW4gW21pZGRsZSAtIHJhbmdlLCBtaWRkbGUgKyByYW5nZV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWlkZGxlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhbmdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgbWlkZGxlTXVsdGlwbGUobWlkZGxlLCByYW5nZSwgY291bnQsIHVzZUZsb2F0KSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKG1pZGRsZShtaWRkbGUsIHJhbmdlLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjaGFuY2U9MC41XVxuICAgICAqIHJldHVybnMgcmFuZG9tIHNpZ24gKGVpdGhlciArMSBvciAtMSlcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2lnbihjaGFuY2UpIHtcbiAgICAgICAgY2hhbmNlID0gY2hhbmNlIHx8IDAuNVxuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IGNoYW5jZSA/IDEgOiAtMVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbGxzIHlvdSB3aGV0aGVyIGEgcmFuZG9tIGNoYW5jZSB3YXMgYWNoaWV2ZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3BlcmNlbnQ9MC41XVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2hhbmNlKHBlcmNlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yKCkgPCAocGVyY2VudCB8fCAwLjUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBhbmdsZSBpbiByYWRpYW5zIFswIC0gMiAqIE1hdGguUEkpXG4gICAgICovXG4gICAgYW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChNYXRoLlBJICogMiwgdHJ1ZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaHVmZmxlIGFycmF5IChlaXRoZXIgaW4gcGxhY2Ugb3IgY29waWVkKVxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvcHk9ZmFsc2VdIHdoZXRoZXIgdG8gc2h1ZmZsZSBpbiBwbGFjZSAoZGVmYXVsdCkgb3IgcmV0dXJuIGEgbmV3IHNodWZmbGVkIGFycmF5XG4gICAgICogQHJldHVybiB7QXJyYXl9IGEgc2h1ZmZsZWQgYXJyYXlcbiAgICAgKi9cbiAgICBzaHVmZmxlKGFycmF5LCBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5KSB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5LnNsaWNlKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleFxuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSB0aGlzLmdldChjdXJyZW50SW5kZXgpXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMVxuXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF1cbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF1cbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGlja3MgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIHBpY2soYXJyYXksIHJlbW92ZSkge1xuICAgICAgICBpZiAoIXJlbW92ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5W3RoaXMuZ2V0KGFycmF5Lmxlbmd0aCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwaWNrID0gdGhpcy5nZXQoYXJyYXkubGVuZ3RoKVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGFycmF5W3BpY2tdXG4gICAgICAgICAgICBhcnJheS5zcGxpY2UocGljaywgMSlcbiAgICAgICAgICAgIHJldHVybiB0ZW1wXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZWxlY3QgYSByYW5kb20gY29sbGVjdGlvbiBvZiBlbGVtZW50cyBmcm9tIGFuIGFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBvZiBzZWxlY3RlZCBpdGVtc1xuICAgICAqL1xuICAgIHNlbGVjdChhcnJheSwgY291bnQpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ID0gWy4uLmFycmF5XVxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdldChzZWxlY3QubGVuZ3RoKVxuICAgICAgICAgICAgc2VsZWN0ZWQucHVzaCguLi5zZWxlY3Quc3BsaWNlKGluZGV4LCAxKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0XG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI1MzIyMTgvcGljay1yYW5kb20tcHJvcGVydHktZnJvbS1hLWphdmFzY3JpcHQtb2JqZWN0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9ialxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgcHJvcGVydHkob2JqKSB7XG4gICAgICAgIHZhciByZXN1bHRcbiAgICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmNlKDEgLyArK2NvdW50KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHByb3BcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlcyBhIHJhbmRvbSBzZXQgd2hlcmUgZWFjaCBlbnRyeSBpcyBhIHZhbHVlIGJldHdlZW4gW21pbiwgbWF4XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFtb3VudCBvZiBudW1iZXJzIGluIHNldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119XG4gICAgICovXG4gICAgc2V0KG1pbiwgbWF4LCBhbW91bnQpIHtcbiAgICAgICAgdmFyIHNldCA9IFtdLCBhbGwgPSBbXSwgaVxuICAgICAgICBmb3IgKGkgPSBtaW47IGkgPCBtYXg7IGkrKykge1xuICAgICAgICAgICAgYWxsLnB1c2goaSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbW91bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5nZXQoYWxsLmxlbmd0aClcbiAgICAgICAgICAgIHNldC5wdXNoKGFsbFtmb3VuZF0pXG4gICAgICAgICAgICBhbGwuc3BsaWNlKGZvdW5kLCAxKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSBzZXQgb2YgbnVtYmVycyB3aXRoIGEgcmFuZG9tbHkgZXZlbiBkaXN0cmlidXRpb24gKGkuZS4sIG5vIG92ZXJsYXBwaW5nIGFuZCBmaWxsaW5nIHRoZSBzcGFjZSlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IG9mIG5vbi1zdGFydC9lbmQgcG9pbnRzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZVN0YXJ0PWZhbHNlXSBpbmNsdWRlcyBzdGFydCBwb2ludCAoY291bnQrKylcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpbmNsdWRlRW5kPWZhbHNlXSBpbmNsdWRlcyBlbmQgcG9pbnQgKGNvdW50KyspXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBkaXN0cmlidXRpb24oc3RhcnQsIGVuZCwgY291bnQsIGluY2x1ZGVTdGFydCwgaW5jbHVkZUVuZCwgdXNlRmxvYXQpIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcigoZW5kIC0gc3RhcnQpIC8gY291bnQpXG4gICAgICAgIHZhciBoYWxmSW50ZXJ2YWwgPSBpbnRlcnZhbCAvIDJcbiAgICAgICAgdmFyIHF1YXJ0ZXJJbnRlcnZhbCA9IGludGVydmFsIC8gNFxuICAgICAgICB2YXIgc2V0ID0gW11cbiAgICAgICAgaWYgKGluY2x1ZGVTdGFydCkge1xuICAgICAgICAgICAgc2V0LnB1c2goc3RhcnQpXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBzZXQucHVzaChzdGFydCArIGkgKiBpbnRlcnZhbCArIGhhbGZJbnRlcnZhbCArIHRoaXMucmFuZ2UoLXF1YXJ0ZXJJbnRlcnZhbCwgcXVhcnRlckludGVydmFsLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluY2x1ZGVFbmQpIHtcbiAgICAgICAgICAgIHNldC5wdXNoKGVuZClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgYmFzZWQgb24gd2VpZ2h0ZWQgcHJvYmFiaWxpdHkgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIyNjU2MTI2L2phdmFzY3JpcHQtcmFuZG9tLW51bWJlci13aXRoLXdlaWdodGVkLXByb2JhYmlsaXR5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGFyZ2V0IGZvciBhdmVyYWdlIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZGRldiAtIHN0YW5kYXJkIGRldmlhdGlvblxuICAgICAqL1xuICAgIHdlaWdodGVkUHJvYmFiaWxpdHlJbnQobWluLCBtYXgsIHRhcmdldCwgc3RkZGV2KSB7XG4gICAgICAgIGZ1bmN0aW9uIG5vcm1SYW5kKCkge1xuICAgICAgICAgICAgbGV0IHgxLCB4MiwgcmFkXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgeDEgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgeDIgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDJcbiAgICAgICAgICAgIH0gd2hpbGUgKHJhZCA+PSAxIHx8IHJhZCA9PT0gMClcbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKVxuICAgICAgICAgICAgcmV0dXJuIHgxICogY1xuICAgICAgICB9XG5cbiAgICAgICAgc3RkZGV2ID0gc3RkZGV2IHx8IDFcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjgxNTQ2KSB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbXBsZSA9ICgobm9ybVJhbmQoKSAqIHN0ZGRldikgKyB0YXJnZXQpXG4gICAgICAgICAgICAgICAgaWYgKHNhbXBsZSA+PSBtaW4gJiYgc2FtcGxlIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2FtcGxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWluLCBtYXgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciB3aXRoaW4gYSBjaXJjbGUgd2l0aCBhIG5vcm1hbCBkaXN0cmlidXRpb25cbiAgICAgKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM4MDU1LzE5NTU5OTdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7Ym9vbH0gW2Zsb2F0XVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gW3gsIHldXG4gICAgICovXG4gICAgY2lyY2xlKHgsIHksIHJhZGl1cywgZmxvYXQpIHtcbiAgICAgICAgY29uc3QgdCA9IHRoaXMuYW5nbGUoKVxuICAgICAgICBjb25zdCB1ID0gdGhpcy5nZXQoMSwgdHJ1ZSkgKyB0aGlzLmdldCgxLCB0cnVlKVxuICAgICAgICBjb25zdCByID0gdSA+IDEgPyAyIC0gdSA6IHVcbiAgICAgICAgaWYgKGZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gW3ggKyByICogTWF0aC5jb3ModCkgKiByYWRpdXMsIHkgKyByICogTWF0aC5zaW4odCkgKiByYWRpdXNdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW01hdGgucm91bmQoeCArIHIgKiBNYXRoLmNvcyh0KSAqIHJhZGl1cyksIE1hdGgucm91bmQoeSArIHIgKiBNYXRoLnNpbih0KSAqIHJhZGl1cyldXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaGV4IGNvbG9yICgwIC0gMHhmZmZmZmYpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGNvbG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoMHhmZmZmZmYpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSYW5kb20oKSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNQSxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFBQSxJQUVsQ0MsTUFBTTtFQUNSLFNBQUFBLE9BQUEsRUFBYztJQUFBQyxlQUFBLE9BQUFELE1BQUE7SUFDVixJQUFJLENBQUNFLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxNQUFNO0VBQ2hDOztFQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBTkksT0FBQUMsWUFBQSxDQUFBTCxNQUFBO0lBQUFNLEdBQUE7SUFBQUMsS0FBQSxFQU9BLFNBQUFDLElBQUlBLENBQUNBLEtBQUksRUFBRUMsT0FBTyxFQUFFO01BQ2hCQSxPQUFPLEdBQUdBLE9BQU8sSUFBSSxDQUFDLENBQUM7TUFDdkIsSUFBSSxDQUFDUCxTQUFTLEdBQUdKLFVBQVUsQ0FBQ1csT0FBTyxDQUFDQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUNGLEtBQUksRUFBRTtRQUFFRyxLQUFLLEVBQUVGLE9BQU8sQ0FBQ0U7TUFBTSxDQUFDLENBQUM7TUFDbkYsSUFBSSxDQUFDRixPQUFPLEdBQUdBLE9BQU87SUFDMUI7O0lBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTtFQUpJO0lBQUFILEdBQUE7SUFBQUMsS0FBQSxFQUtBLFNBQUFLLElBQUlBLENBQUEsRUFBRztNQUNILElBQUksSUFBSSxDQUFDVixTQUFTLEtBQUtDLElBQUksQ0FBQ0MsTUFBTSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxDQUFDRixTQUFTLENB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