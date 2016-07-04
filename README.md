## random.js
a javascript random number API with seeded support. not cryptographically sound. useful for games

## Code Example

    // returns a random integer from 0 - 9
    Random.get(10);

    // returns a random float for 0 - 2
    Random.get(2, true);

    // changes the generator from Math.random() to a seeded random function
    Random.seed(100)

    // returns a random integer from 5 - 20
    // this will return the same number each time
    Random.range(5, 20) returns a random integer from 5 - 20

## Installation
include random.js in your project or add to your workflow

    <script src="random.js"></script>

## API Reference

#### Random.seed(seed)
changes the generator to use a seeded random function

#### Random.reset()
resets the random number generator to Math.random()

#### Random.get(ceiling, useFloat)
returns a random number using the generator between [0, ceiling - 1]

#### Random.middle(middle, range, useFloat)
random int number [middle - range, middle + range]

#### Random.range(start, end, useFloat)
random int number [start, end]

#### Random.rangeMultiple(start, end, count, useFloat)
an array of random numbers between [start, end]

#### Random.middleMultiple(middle, range, count, useFloat)
an array of random numbers between [middle - range, middle + range]

#### Random.uniform(ceiling)
returns a uniform distribution random integer using the generator between [0, ceiling - 1]

#### Random.sign()
returns random sign (either +1 or -1)

#### Random.chance(percent)
tells you whether a random chance was achieved; defaults to 0.5

#### Random.angle()
returns a random angle in radians [0 - 2 * Math.PI)

#### Random.simple1DNoise()
creates simple 1D noise generator
usage:
* var noise = new Random.simple1DNoise();
* noise.getVal(n) returns the value based on n (usually incremented along an axis)
* noise.setAmplitude(amplitude) changes amplitude of noise function
* noise.setScale(scale) sets scale of noise function

#### Random.shuffle(array)
Shuffle array and returns a copy of the shuffled array (not in place shuffling)

#### Random.pick(array)
picks a random element from an array

#### Random.property(obj)
returns a random property from an object

#### Random.set(min, max, amount)
create a random set
* min number to include in set
* max number to include in set

#### Random.distribution(start, end, count, includeStart, includeEnd, useFloat)
returns a set of numbers with a randomly even distribution (i.e., no overlapping and filling the space)
* start position
* end position
* count of non-start/end points
* includeStart point (increases count by 1)
* includeEnd point (increases count by 2)

#### Random.weightedProbabilityInt(min, max, target, stddev)
returns a random number based on weighted probability
* min minimum value
* max maximum value
* target for average value
* stddev standard deviation

## License
MIT License (MIT)