## yy-random
yet another javascript random number API with seeded number support

## Code Example

    const Random = require('yy-random')

    // returns a random integer from 0 - 9
    Random.get(10)

    // returns a random float for 0 - 2
    Random.get(2, true)

    // changes the generator from Math.random() to a seeded random function
    Random.seed(100)

    // returns a random integer between 5 - 20 (including 5 and 20)
    // this will return the same number each time because of the Random.seed(100) call
    Random.range(5, 20) 

## Installation
include yy-random in your project or add to your workflow

    npm i yy-random

## Rationale
I use lots of random numbers in my game. I created this library to make it easier to generate the perfect number for as many scenarios as possible. The library has almost complete test code coverage.

## API
```js
    /**
     * generates a seeded number
     * @param {number} seed
     * @param {object} [options]
     * @param {string} [PRNG="alea"] - name of algorithm, see https://github.com/davidbau/seedrandom
     * @param {(boolean|string)} [state] - can include the state returned from save()
     */
    seed(seed, options) {

    /**
     * saves the state of the random generator
     * can only be used after Random.seed() is called with options.state = true
     * @returns {number} state
     */
    save() {

    /**
     * restores the state of the random generator
     * @param {number} state
     */
    restore(state) {

    /**
     * changes the generator to use the old Math.sin-based random function
     * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
     * (deprecated) Use only for compatibility purposes
     * @param {number} seed
     */
    seedOld(seed) {

    /**
     * create a separate random generator using the seed
     * @param {number} seed
     * @return {object}
     */
    separateSeed(seed) {

    /**
     * resets the random number this.generator to Math.random()
     */
    reset() {

    /**
     * returns a random number using the this.generator between [0, ceiling - 1]
     * @param {number} ceiling
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    get(ceiling, useFloat) {

    /**
     * returns a random integer between 0 - Number.MAX_SAFE_INTEGER
     * @return {number}
     */
    getHuge() {

    /**
     * random number [middle - range, middle + range]
     * @param {number} middle
     * @param {number} delta
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    middle(middle, delta, useFloat) {

    /**
     * random number [start, end]
     * @param {number} start
     * @param {number} end
     * @param {boolean} [useFloat=false] if true, then range is (start, end)--i.e., not inclusive to start and end
     * @return {number}
     */
    range(start, end, useFloat) {

    /**
     * an array of random numbers between [start, end]
     * @param {number} start
     * @param {number} end
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    rangeMultiple(start, end, count, useFloat) {

    /**
     * an array of random numbers between [middle - range, middle + range]
     * @param {number} middle
     * @param {number} range
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    middleMultiple(middle, range, count, useFloat) {

    /**
     * @param {number} [chance=0.5]
     * returns random sign (either +1 or -1)
     * @return {number}
     */
    sign(chance) {

    /**
     * tells you whether a random chance was achieved
     * @param {number} [percent=0.5]
     * @return {boolean}
     */
    chance(percent) {

    /**
     * returns a random angle in radians [0 - 2 * Math.PI)
     */
    angle() {

    /**
     * Shuffle array (either in place or copied)
     * from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {Array} array
     * @param {boolean} [copy=false] whether to shuffle in place (default) or return a new shuffled array
     * @return {Array} a shuffled array
     */
    shuffle(array, copy) {

    /**
     * picks a random element from an array
     * @param {Array} array
     * @return {*}
     */
    pick(array, remove) {

    /**
     * returns a random property from an object
     * from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
     * @param {object} obj
     * @return {*}
     */
    property(obj) {

    /**
     * creates a random set where each entry is a value between [min, max]
     * @param {number} min
     * @param {number} max
     * @param {number} amount of numbers in set
     * @param {number[]}
     */
    set(min, max, amount) {

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

    /**
     * returns a random number based on weighted probability between [min, max]
     * from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
     * @param {number} min value
     * @param {number} max value
     * @param {number} target for average value
     * @param {number} stddev - standard deviation
     */
    weightedProbabilityInt(min, max, target, stddev) {

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

```
## License  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
