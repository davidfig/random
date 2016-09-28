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

    npm install yy-random

# API Reference
a javascript random number API with seeded support. not cryptographically sound. useful for games

**Kind**: global class  

* [Random](#Random)
    * [.seed(seed)](#Random+seed)
    * [.reset()](#Random+reset)
    * [.get(ceiling, [useFloat])](#Random+get) ⇒ <code>number</code>
    * [.getHuge()](#Random+getHuge) ⇒ <code>number</code>
    * [.middle(middle, delta, [useFloat])](#Random+middle) ⇒ <code>number</code>
    * [.range(start, end, [useFloat])](#Random+range) ⇒ <code>number</code>
    * [.rangeMultiple(start, end, count, [useFloat])](#Random+rangeMultiple) ⇒ <code>Array.&lt;number&gt;</code>
    * [.middleMultiple(middle, range, count, [useFloat])](#Random+middleMultiple) ⇒ <code>Array.&lt;number&gt;</code>
    * [.sign([chance])](#Random+sign) ⇒ <code>number</code>
    * [.chance([percent])](#Random+chance) ⇒ <code>boolean</code>
    * [.angle()](#Random+angle)
    * [.shuffle(array)](#Random+shuffle) ⇒ <code>Array</code>
    * [.pick(array)](#Random+pick) ⇒ <code>\*</code>
    * [.property(obj)](#Random+property) ⇒ <code>\*</code>
    * [.set(min, max, amount)](#Random+set)
    * [.distribution(start, end, count, [includeStart], [includeEnd], [useFloat])](#Random+distribution)
    * [.weightedProbabilityInt(min, max, target, stddev)](#Random+weightedProbabilityInt)

<a name="Random+seed"></a>

### random.seed(seed)
changes the generator to use a seeded random function
based on : http://stackoverflow.com/questions/521295/javascript-random-seeds

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type |
| --- | --- |
| seed | <code>number</code> | 

<a name="Random+reset"></a>

### random.reset()
resets the random number this.generator to Math.random()

**Kind**: instance method of <code>[Random](#Random)</code>  
<a name="Random+get"></a>

### random.get(ceiling, [useFloat]) ⇒ <code>number</code>
returns a random number using the this.generator between [0, ceiling - 1]

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default |
| --- | --- | --- |
| ceiling | <code>number</code> |  | 
| [useFloat] | <code>boolean</code> | <code>false</code> | 

<a name="Random+getHuge"></a>

### random.getHuge() ⇒ <code>number</code>
returns a random integer between 0 - Number.MAX_SAFE_INTEGER

**Kind**: instance method of <code>[Random](#Random)</code>  
<a name="Random+middle"></a>

### random.middle(middle, delta, [useFloat]) ⇒ <code>number</code>
random number [middle - range, middle + range]

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default |
| --- | --- | --- |
| middle | <code>number</code> |  | 
| delta | <code>number</code> |  | 
| [useFloat] | <code>boolean</code> | <code>false</code> | 

<a name="Random+range"></a>

### random.range(start, end, [useFloat]) ⇒ <code>number</code>
random number [start, end]

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>number</code> |  |  |
| end | <code>number</code> |  |  |
| [useFloat] | <code>boolean</code> | <code>false</code> | if true, then range is (start, end)--i.e., not inclusive to start and end |

<a name="Random+rangeMultiple"></a>

### random.rangeMultiple(start, end, count, [useFloat]) ⇒ <code>Array.&lt;number&gt;</code>
an array of random numbers between [start, end]

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default |
| --- | --- | --- |
| start | <code>number</code> |  | 
| end | <code>number</code> |  | 
| count | <code>number</code> |  | 
| [useFloat] | <code>boolean</code> | <code>false</code> | 

<a name="Random+middleMultiple"></a>

### random.middleMultiple(middle, range, count, [useFloat]) ⇒ <code>Array.&lt;number&gt;</code>
an array of random numbers between [middle - range, middle + range]

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default |
| --- | --- | --- |
| middle | <code>number</code> |  | 
| range | <code>number</code> |  | 
| count | <code>number</code> |  | 
| [useFloat] | <code>boolean</code> | <code>false</code> | 

<a name="Random+sign"></a>

### random.sign([chance]) ⇒ <code>number</code>
**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [chance] | <code>number</code> | <code>0.5</code> | returns random sign (either +1 or -1) |

<a name="Random+chance"></a>

### random.chance([percent]) ⇒ <code>boolean</code>
tells you whether a random chance was achieved

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [percent] | <code>number</code> | <code>0.5</code> | 

<a name="Random+angle"></a>

### random.angle()
returns a random angle in radians [0 - 2 * Math.PI)

**Kind**: instance method of <code>[Random](#Random)</code>  
<a name="Random+shuffle"></a>

### random.shuffle(array) ⇒ <code>Array</code>
Shuffle array from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

**Kind**: instance method of <code>[Random](#Random)</code>  
**Returns**: <code>Array</code> - copied and shuffled array  

| Param | Type |
| --- | --- |
| array | <code>Array</code> | 

<a name="Random+pick"></a>

### random.pick(array) ⇒ <code>\*</code>
picks a random element from an array

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type |
| --- | --- |
| array | <code>Array</code> | 

<a name="Random+property"></a>

### random.property(obj) ⇒ <code>\*</code>
returns a random property from an object
from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="Random+set"></a>

### random.set(min, max, amount)
creates a random set where each entry is a value between [min, max]

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>number</code> |  |
| max | <code>number</code> |  |
| amount | <code>number</code> | of numbers in set |
|  | <code>Array.&lt;number&gt;</code> |  |

<a name="Random+distribution"></a>

### random.distribution(start, end, count, [includeStart], [includeEnd], [useFloat])
returns a set of numbers with a randomly even distribution (i.e., no overlapping and filling the space)

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>number</code> |  | position |
| end | <code>number</code> |  | position |
| count | <code>number</code> |  | of non-start/end points |
| [includeStart] | <code>boolean</code> | <code>false</code> | includes start point (count++) |
| [includeEnd] | <code>boolean</code> | <code>false</code> | includes end point (count++) |
| [useFloat] | <code>boolean</code> | <code>false</code> |  |
|  | <code>Array.&lt;number&gt;</code> |  |  |

<a name="Random+weightedProbabilityInt"></a>

### random.weightedProbabilityInt(min, max, target, stddev)
returns a random number based on weighted probability between [min, max]
from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability

**Kind**: instance method of <code>[Random](#Random)</code>  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>number</code> | value |
| max | <code>number</code> | value |
| target | <code>number</code> | for average value |
| stddev | <code>number</code> | standard deviation |


* * *

Copyright (c) 2016 YOPEY YOPEY LLC - MIT License - Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)