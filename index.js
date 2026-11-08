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
        array.push(this.middle(middle, range, useFloat));
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
      var _this = this;
      var normRand = function normRand() {
        var x1, x2, rad;
        do {
          x1 = 2 * _this.get(1, true) - 1;
          x2 = 2 * _this.get(1, true) - 1;
          rad = x1 * x1 + x2 * x2;
        } while (rad >= 1 || rad === 0);
        var c = Math.sqrt(-2 * Math.log(rad) / rad);
        return x1 * c;
      };
      stddev = stddev || 1;
      if (this.get(1, true) < 0.81546) {
        while (true) {
          var sample = Math.round(normRand() * stddev + target);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJuYW1lcyI6WyJzZWVkcmFuZG9tIiwicmVxdWlyZSIsIlJhbmRvbSIsIl9jbGFzc0NhbGxDaGVjayIsImdlbmVyYXRvciIsIk1hdGgiLCJyYW5kb20iLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsInNlZWQiLCJvcHRpb25zIiwiUFJORyIsInN0YXRlIiwic2F2ZSIsInJlc3RvcmUiLCJzZWVkT2xkIiwieCIsInNpbiIsImZsb29yIiwic2VwYXJhdGVTZWVkIiwicmVzZXQiLCJnZXQiLCJjZWlsaW5nIiwidXNlRmxvYXQiLCJuZWdhdGl2ZSIsInJlc3VsdCIsImdldEh1Z2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwibWlkZGxlIiwiZGVsdGEiLCJoYWxmIiwicmFuZ2UiLCJzdGFydCIsImVuZCIsInJhbmdlTXVsdGlwbGUiLCJjb3VudCIsImFycmF5IiwiaSIsInB1c2giLCJtaWRkbGVNdWx0aXBsZSIsInNpZ24iLCJjaGFuY2UiLCJwZXJjZW50IiwiYW5nbGUiLCJQSSIsInNodWZmbGUiLCJjb3B5Iiwic2xpY2UiLCJsZW5ndGgiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwicGljayIsInJlbW92ZSIsInRlbXAiLCJzcGxpY2UiLCJzZWxlY3QiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJzZWxlY3RlZCIsImluZGV4IiwiYXBwbHkiLCJwcm9wZXJ0eSIsIm9iaiIsInByb3AiLCJzZXQiLCJtaW4iLCJtYXgiLCJhbW91bnQiLCJhbGwiLCJmb3VuZCIsImRpc3RyaWJ1dGlvbiIsImluY2x1ZGVTdGFydCIsImluY2x1ZGVFbmQiLCJpbnRlcnZhbCIsImhhbGZJbnRlcnZhbCIsInF1YXJ0ZXJJbnRlcnZhbCIsIndlaWdodGVkUHJvYmFiaWxpdHlJbnQiLCJ0YXJnZXQiLCJzdGRkZXYiLCJfdGhpcyIsIm5vcm1SYW5kIiwieDEiLCJ4MiIsInJhZCIsImMiLCJzcXJ0IiwibG9nIiwic2FtcGxlIiwicm91bmQiLCJjaXJjbGUiLCJ5IiwicmFkaXVzIiwiZmxvYXQiLCJ0IiwidSIsInIiLCJjb3MiLCJjb2xvciIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJyYW5kb20uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8geXktcmFuZG9tXG4vLyBieSBEYXZpZCBGaWdhdG5lclxuLy8gTUlUIGxpY2Vuc2Vcbi8vIGNvcHlyaWdodCBZT1BFWSBZT1BFWSBMTEMgMjAxNi0xN1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkZmlnL3JhbmRvbVxuXG5jb25zdCBzZWVkcmFuZG9tID0gcmVxdWlyZSgnc2VlZHJhbmRvbScpXG5cbmNsYXNzIFJhbmRvbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gTWF0aC5yYW5kb21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZW5lcmF0ZXMgYSBzZWVkZWQgbnVtYmVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtQUk5HPVwiYWxlYVwiXSAtIG5hbWUgb2YgYWxnb3JpdGhtLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkYmF1L3NlZWRyYW5kb21cbiAgICAgKiBAcGFyYW0geyhib29sZWFufHN0cmluZyl9IFtzdGF0ZV0gLSBjYW4gaW5jbHVkZSB0aGUgc3RhdGUgcmV0dXJuZWQgZnJvbSBzYXZlKClcbiAgICAgKi9cbiAgICBzZWVkKHNlZWQsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBzZWVkcmFuZG9tW29wdGlvbnMuUFJORyB8fCAnYWxlYSddKHNlZWQsIHsgc3RhdGU6IG9wdGlvbnMuc3RhdGUgfSlcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNhdmVzIHRoZSBzdGF0ZSBvZiB0aGUgcmFuZG9tIGdlbmVyYXRvclxuICAgICAqIGNhbiBvbmx5IGJlIHVzZWQgYWZ0ZXIgUmFuZG9tLnNlZWQoKSBpcyBjYWxsZWQgd2l0aCBvcHRpb25zLnN0YXRlID0gdHJ1ZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHN0YXRlXG4gICAgICovXG4gICAgc2F2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdG9yICE9PSBNYXRoLnJhbmRvbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yLnN0YXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc3RvcmVzIHRoZSBzdGF0ZSBvZiB0aGUgcmFuZG9tIGdlbmVyYXRvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHJlc3RvcmUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBzZWVkcmFuZG9tW3RoaXMub3B0aW9ucy5QUk5HIHx8ICdhbGVhJ10oJycsIHsgc3RhdGUgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGFuZ2VzIHRoZSBnZW5lcmF0b3IgdG8gdXNlIHRoZSBvbGQgTWF0aC5zaW4tYmFzZWQgcmFuZG9tIGZ1bmN0aW9uXG4gICAgICogYmFzZWQgb24gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyMTI5NS9qYXZhc2NyaXB0LXJhbmRvbS1zZWVkc1xuICAgICAqIChkZXByZWNhdGVkKSBVc2Ugb25seSBmb3IgY29tcGF0aWJpbGl0eSBwdXJwb3Nlc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkXG4gICAgICovXG4gICAgc2VlZE9sZChzZWVkKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5zaW4oc2VlZCsrKSAqIDEwMDAwXG4gICAgICAgICAgICByZXR1cm4geCAtIE1hdGguZmxvb3IoeClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIHNlcGFyYXRlIHJhbmRvbSBnZW5lcmF0b3IgdXNpbmcgdGhlIHNlZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBzZXBhcmF0ZVNlZWQoc2VlZCkge1xuICAgICAgICBjb25zdCByYW5kb20gPSBuZXcgUmFuZG9tKClcbiAgICAgICAgcmFuZG9tLnNlZWQoc2VlZClcbiAgICAgICAgcmV0dXJuIHJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc2V0cyB0aGUgcmFuZG9tIG51bWJlciB0aGlzLmdlbmVyYXRvciB0byBNYXRoLnJhbmRvbSgpXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gTWF0aC5yYW5kb21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciB1c2luZyB0aGUgdGhpcy5nZW5lcmF0b3IgYmV0d2VlbiBbMCwgY2VpbGluZyAtIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNlaWxpbmdcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0KGNlaWxpbmcsIHVzZUZsb2F0KSB7XG4gICAgICAgIGNvbnN0IG5lZ2F0aXZlID0gY2VpbGluZyA8IDAgPyAtMSA6IDFcbiAgICAgICAgY2VpbGluZyAqPSBuZWdhdGl2ZVxuICAgICAgICBsZXQgcmVzdWx0XG4gICAgICAgIGlmICh1c2VGbG9hdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIGNlaWxpbmcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdCAqIG5lZ2F0aXZlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gMCAtIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldEh1Z2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByYW5kb20gbnVtYmVyIFttaWRkbGUgLSByYW5nZSwgbWlkZGxlICsgcmFuZ2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pZGRsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBtaWRkbGUobWlkZGxlLCBkZWx0YSwgdXNlRmxvYXQpIHtcbiAgICAgICAgY29uc3QgaGFsZiA9IGRlbHRhIC8gMlxuICAgICAgICByZXR1cm4gdGhpcy5yYW5nZShtaWRkbGUgLSBoYWxmLCBtaWRkbGUgKyBoYWxmLCB1c2VGbG9hdClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByYW5kb20gbnVtYmVyIFtzdGFydCwgZW5kXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV0gaWYgdHJ1ZSwgdGhlbiByYW5nZSBpcyAoc3RhcnQsIGVuZCktLWkuZS4sIG5vdCBpbmNsdXNpdmUgdG8gc3RhcnQgYW5kIGVuZFxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICByYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdCkge1xuICAgICAgICAvLyBjYXNlIHdoZXJlIHRoZXJlIGlzIG5vIHJhbmdlXG4gICAgICAgIGlmIChlbmQgPT09IHN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlRmxvYXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChlbmQgLSBzdGFydCwgdHJ1ZSkgKyBzdGFydFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJhbmdlXG4gICAgICAgICAgICBpZiAoc3RhcnQgPCAwICYmIGVuZCA+IDApIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IC1zdGFydCArIGVuZCArIDFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID4gMCkge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gZW5kICsgMVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydCA8IDAgJiYgZW5kID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzdGFydCAtIDFcbiAgICAgICAgICAgICAgICBzdGFydCA9IDFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPCAwICYmIGVuZCA8IDApIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0IC0gMVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0ICsgMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZW5lcmF0b3IoKSAqIHJhbmdlKSArIHN0YXJ0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhbiBhcnJheSBvZiByYW5kb20gbnVtYmVycyBiZXR3ZWVuIFtzdGFydCwgZW5kXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICByYW5nZU11bHRpcGxlKHN0YXJ0LCBlbmQsIGNvdW50LCB1c2VGbG9hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy5yYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbbWlkZGxlIC0gcmFuZ2UsIG1pZGRsZSArIHJhbmdlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBtaWRkbGVNdWx0aXBsZShtaWRkbGUsIHJhbmdlLCBjb3VudCwgdXNlRmxvYXQpIHtcbiAgICAgICAgY29uc3QgYXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy5taWRkbGUobWlkZGxlLCByYW5nZSwgdXNlRmxvYXQpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY2hhbmNlPTAuNV1cbiAgICAgKiByZXR1cm5zIHJhbmRvbSBzaWduIChlaXRoZXIgKzEgb3IgLTEpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNpZ24oY2hhbmNlKSB7XG4gICAgICAgIGNoYW5jZSA9IGNoYW5jZSB8fCAwLjVcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yKCkgPCBjaGFuY2UgPyAxIDogLTFcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZWxscyB5b3Ugd2hldGhlciBhIHJhbmRvbSBjaGFuY2Ugd2FzIGFjaGlldmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtwZXJjZW50PTAuNV1cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIGNoYW5jZShwZXJjZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvcigpIDwgKHBlcmNlbnQgfHwgMC41KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gYW5nbGUgaW4gcmFkaWFucyBbMCAtIDIgKiBNYXRoLlBJKVxuICAgICAqL1xuICAgIGFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoTWF0aC5QSSAqIDIsIHRydWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2h1ZmZsZSBhcnJheSAoZWl0aGVyIGluIHBsYWNlIG9yIGNvcGllZClcbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjb3B5PWZhbHNlXSB3aGV0aGVyIHRvIHNodWZmbGUgaW4gcGxhY2UgKGRlZmF1bHQpIG9yIHJldHVybiBhIG5ldyBzaHVmZmxlZCBhcnJheVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhIHNodWZmbGVkIGFycmF5XG4gICAgICovXG4gICAgc2h1ZmZsZShhcnJheSwgY29weSkge1xuICAgICAgICBpZiAoY29weSkge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheS5zbGljZSgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXhcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gdGhpcy5nZXQoY3VycmVudEluZGV4KVxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDFcblxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBpY2tzIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhbiBhcnJheVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBwaWNrKGFycmF5LCByZW1vdmUpIHtcbiAgICAgICAgaWYgKCFyZW1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVt0aGlzLmdldChhcnJheS5sZW5ndGgpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGljayA9IHRoaXMuZ2V0KGFycmF5Lmxlbmd0aClcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJheVtwaWNrXVxuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKHBpY2ssIDEpXG4gICAgICAgICAgICByZXR1cm4gdGVtcFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2VsZWN0IGEgcmFuZG9tIGNvbGxlY3Rpb24gb2YgZWxlbWVudHMgZnJvbSBhbiBhcnJheVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgb2Ygc2VsZWN0ZWQgaXRlbXNcbiAgICAgKi9cbiAgICBzZWxlY3QoYXJyYXksIGNvdW50KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IFsuLi5hcnJheV1cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXQoc2VsZWN0Lmxlbmd0aClcbiAgICAgICAgICAgIHNlbGVjdGVkLnB1c2goLi4uc2VsZWN0LnNwbGljZShpbmRleCwgMSkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdFxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNTMyMjE4L3BpY2stcmFuZG9tLXByb3BlcnR5LWZyb20tYS1qYXZhc2NyaXB0LW9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIHByb3BlcnR5KG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0XG4gICAgICAgIHZhciBjb3VudCA9IDBcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5jZSgxIC8gKytjb3VudCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBwcm9wXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZXMgYSByYW5kb20gc2V0IHdoZXJlIGVhY2ggZW50cnkgaXMgYSB2YWx1ZSBiZXR3ZWVuIFttaW4sIG1heF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbW91bnQgb2YgbnVtYmVycyBpbiBzZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfVxuICAgICAqL1xuICAgIHNldChtaW4sIG1heCwgYW1vdW50KSB7XG4gICAgICAgIHZhciBzZXQgPSBbXSwgYWxsID0gW10sIGlcbiAgICAgICAgZm9yIChpID0gbWluOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgICAgIGFsbC5wdXNoKGkpXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZ2V0KGFsbC5sZW5ndGgpXG4gICAgICAgICAgICBzZXQucHVzaChhbGxbZm91bmRdKVxuICAgICAgICAgICAgYWxsLnNwbGljZShmb3VuZCwgMSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgc2V0IG9mIG51bWJlcnMgd2l0aCBhIHJhbmRvbWx5IGV2ZW4gZGlzdHJpYnV0aW9uIChpLmUuLCBubyBvdmVybGFwcGluZyBhbmQgZmlsbGluZyB0aGUgc3BhY2UpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBvZiBub24tc3RhcnQvZW5kIHBvaW50c1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luY2x1ZGVTdGFydD1mYWxzZV0gaW5jbHVkZXMgc3RhcnQgcG9pbnQgKGNvdW50KyspXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZUVuZD1mYWxzZV0gaW5jbHVkZXMgZW5kIHBvaW50IChjb3VudCsrKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119XG4gICAgICovXG4gICAgZGlzdHJpYnV0aW9uKHN0YXJ0LCBlbmQsIGNvdW50LCBpbmNsdWRlU3RhcnQsIGluY2x1ZGVFbmQsIHVzZUZsb2F0KSB7XG4gICAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3IoKGVuZCAtIHN0YXJ0KSAvIGNvdW50KVxuICAgICAgICB2YXIgaGFsZkludGVydmFsID0gaW50ZXJ2YWwgLyAyXG4gICAgICAgIHZhciBxdWFydGVySW50ZXJ2YWwgPSBpbnRlcnZhbCAvIDRcbiAgICAgICAgdmFyIHNldCA9IFtdXG4gICAgICAgIGlmIChpbmNsdWRlU3RhcnQpIHtcbiAgICAgICAgICAgIHNldC5wdXNoKHN0YXJ0KVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgc2V0LnB1c2goc3RhcnQgKyBpICogaW50ZXJ2YWwgKyBoYWxmSW50ZXJ2YWwgKyB0aGlzLnJhbmdlKC1xdWFydGVySW50ZXJ2YWwsIHF1YXJ0ZXJJbnRlcnZhbCwgdXNlRmxvYXQpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmNsdWRlRW5kKSB7XG4gICAgICAgICAgICBzZXQucHVzaChlbmQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIGJhc2VkIG9uIHdlaWdodGVkIHByb2JhYmlsaXR5IGJldHdlZW4gW21pbiwgbWF4XVxuICAgICAqIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMjY1NjEyNi9qYXZhc2NyaXB0LXJhbmRvbS1udW1iZXItd2l0aC13ZWlnaHRlZC1wcm9iYWJpbGl0eVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRhcmdldCBmb3IgYXZlcmFnZSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGRkZXYgLSBzdGFuZGFyZCBkZXZpYXRpb25cbiAgICAgKi9cbiAgICB3ZWlnaHRlZFByb2JhYmlsaXR5SW50KG1pbiwgbWF4LCB0YXJnZXQsIHN0ZGRldikge1xuICAgICAgICBjb25zdCBub3JtUmFuZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGxldCB4MSwgeDIsIHJhZFxuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHgxID0gMiAqIHRoaXMuZ2V0KDEsIHRydWUpIC0gMVxuICAgICAgICAgICAgICAgIHgyID0gMiAqIHRoaXMuZ2V0KDEsIHRydWUpIC0gMVxuICAgICAgICAgICAgICAgIHJhZCA9IHgxICogeDEgKyB4MiAqIHgyXG4gICAgICAgICAgICB9IHdoaWxlIChyYWQgPj0gMSB8fCByYWQgPT09IDApXG4gICAgICAgICAgICBjb25zdCBjID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocmFkKSAvIHJhZClcbiAgICAgICAgICAgIHJldHVybiB4MSAqIGNcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ZGRldiA9IHN0ZGRldiB8fCAxXG4gICAgICAgIGlmICh0aGlzLmdldCgxLCB0cnVlKSA8IDAuODE1NDYpIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtcGxlID0gTWF0aC5yb3VuZCgobm9ybVJhbmQoKSAqIHN0ZGRldikgKyB0YXJnZXQpXG4gICAgICAgICAgICAgICAgaWYgKHNhbXBsZSA+PSBtaW4gJiYgc2FtcGxlIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2FtcGxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWluLCBtYXgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciB3aXRoaW4gYSBjaXJjbGUgd2l0aCBhIG5vcm1hbCBkaXN0cmlidXRpb25cbiAgICAgKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM4MDU1LzE5NTU5OTdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7Ym9vbH0gW2Zsb2F0XVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gW3gsIHldXG4gICAgICovXG4gICAgY2lyY2xlKHgsIHksIHJhZGl1cywgZmxvYXQpIHtcbiAgICAgICAgY29uc3QgdCA9IHRoaXMuYW5nbGUoKVxuICAgICAgICBjb25zdCB1ID0gdGhpcy5nZXQoMSwgdHJ1ZSkgKyB0aGlzLmdldCgxLCB0cnVlKVxuICAgICAgICBjb25zdCByID0gdSA+IDEgPyAyIC0gdSA6IHVcbiAgICAgICAgaWYgKGZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gW3ggKyByICogTWF0aC5jb3ModCkgKiByYWRpdXMsIHkgKyByICogTWF0aC5zaW4odCkgKiByYWRpdXNdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW01hdGgucm91bmQoeCArIHIgKiBNYXRoLmNvcyh0KSAqIHJhZGl1cyksIE1hdGgucm91bmQoeSArIHIgKiBNYXRoLnNpbih0KSAqIHJhZGl1cyldXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaGV4IGNvbG9yICgwIC0gMHhmZmZmZmYpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGNvbG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoMHhmZmZmZmYpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSYW5kb20oKSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNQSxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFBQSxJQUVsQ0MsTUFBTTtFQUNSLFNBQUFBLE9BQUEsRUFBYztJQUFBQyxlQUFBLE9BQUFELE1BQUE7SUFDVixJQUFJLENBQUNFLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxNQUFNO0VBQ2hDOztFQUVBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBTkksT0FBQUMsWUFBQSxDQUFBTCxNQUFBO0lBQUFNLEdBQUE7SUFBQUMsS0FBQSxFQU9BLFNBQUFDLElBQUlBLENBQUNBLEtBQUksRUFBRUMsT0FBTyxFQUFFO01BQ2hCQSxPQUFPLEdBQUdBLE9BQU8sSUFBSSxDQUFDLENBQUM7TUFDdkIsSUFBSSxDQUFDUCxTQUFTLEdBQUdKLFVBQVUsQ0FBQ1csT0FBTyxDQUFDQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUNGLEtBQUksRUFBRTtRQUFFRyxLQUFLLEVBQUVGLE9BQU8sQ0FBQ0U7TUFBTSxDQUFDLENBQUM7TUFDbkYsSUFBSSxDQUFDRixPQUFPLEdBQUdBLE9BQU87SUFDMUI7O0lBRUE7QUFDSjtBQUNBO0FBQ0E7QUFDQTtFQUpJO0lBQUFILEdBQUE7SUFBQUMsS0FBQSxFQUtBLFNBQUFLLElBQUlBLENBQUEsRUFBRztNQUNILElBQUksSUFBSSxDQUFDVixTQUFTLEtBQUtDLElBQUksQ0FBQ0MsTUFBTSxFQUFF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