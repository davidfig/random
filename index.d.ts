interface Options {
    PRNG: string;
    state: boolean | string;
}
export declare class Random {
    generator: any;
    options: Options;
    constructor();
    /**
     * generates a seeded number
     * @param {number} seed
     * @param {object} [options]
     * @param {string} [PRNG="alea"] - name of algorithm, see https://github.com/davidbau/SeedRandom
     * @param {(boolean|string)} [state] - can include the state returned from save()
     */
    seed(seed: any, options?: any): void;
    /**
     * saves the state of the random generator
     * can only be used after Random.seed() is called with options.state = true
     * @returns {number} state
     */
    save(): number;
    /**
     * restores the state of the random generator
     * @param {number} state
     */
    restore(state: any): void;
    /**
     * changes the generator to use the old Math.sin-based random function
     * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
     * (deprecated) Use only for compatibility purposes
     * @param {number} seed
     */
    seedOld(seed: any): void;
    /**
     * create a separate random generator using the seed
     * @param {number} seed
     * @return {object}
     */
    separateSeed(seed: any): Random;
    /**
     * resets the random number this.generator to Math.random()
     */
    reset(): void;
    /**
     * returns a random number using the this.generator between [0, ceiling - 1]
     * @param {number} ceiling
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    get(ceiling: any, useFloat?: any): number;
    /**
     * returns a random integer between 0 - Number.MAX_SAFE_INTEGER
     * @return {number}
     */
    getHuge(): number;
    /**
     * random number [middle - range, middle + range]
     * @param {number} middle
     * @param {number} delta
     * @param {boolean} [useFloat=false]
     * @return {number}
     */
    middle(middle: any, delta: any, useFloat?: any): number;
    /**
     * random number [start, end]
     * @param {number} start
     * @param {number} end
     * @param {boolean} [useFloat=false] if true, then range is (start, end)--i.e., not inclusive to start and end
     * @return {number}
     */
    range(start: any, end: any, useFloat?: any): number;
    /**
     * an array of random numbers between [start, end]
     * @param {number} start
     * @param {number} end
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    rangeMultiple(start: any, end: any, count: any, useFloat?: any): number[];
    /**
     * an array of random numbers between [middle - range, middle + range]
     * @param {number} middle
     * @param {number} range
     * @param {number} count
     * @param {boolean} [useFloat=false]
     * @return {number[]}
     */
    middleMultiple(middle: any, range: any, count: any, useFloat?: any): number[];
    /**
     * @param {number} [chance=0.5]
     * returns random sign (either +1 or -1)
     * @return {number}
     */
    sign(chance?: any): 1 | -1;
    /**
     * tells you whether a random chance was achieved
     * @param {number} [percent=0.5]
     * @return {boolean}
     */
    chance(percent?: any): boolean;
    /**
     * returns a random angle in radians [0 - 2 * Math.PI)
     */
    angle(): number;
    /**
     * Shuffle array (either in place or copied)
     * from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {Array} array
     * @param {boolean} [copy=false] whether to shuffle in place (default) or return a new shuffled array
     * @return {Array} a shuffled array
     */
    shuffle(array: any, copy: any): [];
    /**
     * picks a random element from an array
     * @param {Array} array
     * @return {*}
     */
    pick(array: any, remove: any): any;
    /**
     * returns a random property from an object
     * from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
     * @param {object} obj
     * @return {*}
     */
    property(obj: any): any;
    /**
     * creates a random set where each entry is a value between [min, max]
     * @param {number} min
     * @param {number} max
     * @param {number} amount of numbers in set
     * @param {number[]}
     */
    set(min: any, max: any, amount: any): number[];
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
    distribution(start: any, end: any, count: any, includeStart: any, includeEnd: any, useFloat?: any): number[];
    /**
     * returns a random number based on weighted probability between [min, max]
     * from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
     * @param {number} min value
     * @param {number} max value
     * @param {number} target for average value
     * @param {number} stddev - standard deviation
     * @return {number}
     */
    weightedProbabilityInt(min: any, max: any, target: any, stddev: any): number;
    color(): number;
}
declare const _default: Random;
export default _default;