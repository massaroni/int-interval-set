# Integer Interval Set

A simple interval set for integers.  This may be easier to work with than [interval-tree-1d](https://www.npmjs.com/package/interval-tree-1d), for integer-only use cases like timestamps and sequential id numbers.  All functions are synchronous.  All boundaries are always closed (inclusive).

<br/>

Note that this library is missing some important set operations, and I will add them as I come to need them for my own use.  Please feel free to add more set operations and submit a pull request.

## Installation

```shell
npm install --save int-interval-set
```

## API
### Union
Add an interval to an empty set.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet();
console.log(set.isEmpty());
// true

set.union(2, 4);
console.log(set.intervals);
// [{lower: 2, upper: 4}]
```

Use fluent functions to add a bunch of intervals.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet().union(2, 4).union(5, 7).union(10, 20);
console.log(set.intervals);
// [{lower: 2, upper: 7}, {lower: 10, upper: 20}]
```

### Union All
Add an array of intervals to an empty set.  They can be out of order and overlapping.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet();
set.unionAll([
  {lower: 2, upper: 4},
  {lower: 10, upper: 20},
  {lower: 5, upper: 7}
]);
console.log(set.intervals);
// [{lower: 2, upper: 7}, {lower: 10, upper: 20}]
```

### Clone
Copy a set.
```javascript
const IntIntervalSet = require('int-interval-set');
let set1 = new IntIntervalSet([{lower: 1, upper: 5}]);
let set2 = set1.clone().union(3, 20);

console.log(set2.intervals);
// [{lower: 1, upper: 20}]

console.log(set1.intervals);
// [{lower: 1, upper: 5}]
```

### Span
Get the smallest interval that contains the entire set.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet([{lower: 2, upper: 10}, {lower: 30, upper: 50}]);
console.log(set.span());
// {lower: 2, upper: 50}
```

### Intersection
Get the intersection of a set with a given interval.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet([{lower: 2, upper: 10}]);
let intersection = set.intersection(8, 20);
console.log(intersection.intervals);
// [{lower: 8, upper: 10}]

console.log(set.intervals);
// [{lower: 2, upper: 10}]
```

### Complement
Get the complement of a set. This spans the whole number line, from the minimum to maximum safe integers.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet([{lower: 2, upper: 10}]);
let complement = set.complement();

console.log(complement.intervals);
// [{lower: -9007199254740991, upper: 1}, {lower: 11, upper: 9007199254740991}]

console.log(set.intervals);
// [{lower: 2, upper: 10}]
```

## TODO

### todo: Remove
Remove a point.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet([{lower: 4, upper: 10}]);
set.remove(7);
console.log(set.intervals);
// [{lower: 4, upper: 6}, {lower: 8, upper: 10}]
```

Remove an interval.
```javascript
const IntIntervalSet = require('int-interval-set');
let set = new IntIntervalSet([{lower: 4, upper: 10}]);
set.remove(6, 8);
console.log(set.intervals);
// [{lower: 4, upper: 5}, {lower: 9, upper: 10}]
```

### todo: performance
... and improve performance with a tree data structure, under the hood?
