const _ = require('lodash');

/**
 * Simple mutable interval set for integers.
 * All boundaries are always closed (inclusive).
 * Note that this set is backed by an array, so the add/remove operations will underperform compared to a tree-based data structure. However, this won't matter if most of your intervals overlap.
 */
class IntIntervalSet {
  constructor(intervals = []) {
    this.intervals = intervals;
  }

  clone() {
    return new IntIntervalSet(_.cloneDeep(this.intervals));
  }

  /**
   * Add the interval to this set. This modifies the state of this set.
   * 
   * @param {*} lower 
   * @param {*} upper 
   */
  union(lower, upper) {
    if (_.isUndefined(upper)) {
      upper = lower;
    }
    checkInterval(lower, upper);

    let lowerPoint = this._findCutPoint(lower);
    let upperPoint = upper === lower ? lowerPoint : this._findCutPoint(upper, lowerPoint.index);

    let intervals = this.intervals;
    let interval = {lower: lower, upper: upper};
    if (lowerPoint.index >= intervals.length) {
      intervals.push(interval);
    } else if (upperPoint.index <= 0 && !upperPoint.connected) {
      intervals.unshift(interval);
    } else if (lowerPoint.index === upperPoint.index && !lowerPoint.connected && !upperPoint.connected) {
      intervals.splice(lowerPoint.index, 0, interval);
    } else {
      let deletes = (upperPoint.index - lowerPoint.index) || (upperPoint.connected ? 1 : 0);
      let startIndex = lowerPoint.index;
      if (lowerPoint.connected) {
        interval.lower = Math.min(interval.lower, intervals[lowerPoint.index].lower);
      }
      if (lower !== upper && upperPoint.connected) {
        deletes++;
        interval.upper = Math.max(interval.upper, intervals[upperPoint.index].upper);
      }
      if (lower === upper &&
          upperPoint.index < intervals.length-1 &&
          intervals[upperPoint.index+1].lower-1 <= upper) {
        deletes++;
        interval.upper = Math.max(interval.upper, intervals[upperPoint.index+1].upper);
      }
      intervals.splice(startIndex, deletes, interval);
    }

    return this;
  }

  _findCutPoint(point, minHint, maxHint) {
    if (this.intervals.length < 1) {
      return { index: 0 };
    }

    let min = _.isInteger(minHint) ? Math.max(0, minHint - 1) : 0;
    let max = _.isInteger(maxHint) ? maxHint : this.intervals.length - 1;
    let mid;
    
    while (min <= max) {
      mid = Math.floor((min + max) / 2);
      let middle = this.intervals[mid];
      let contiguous = middle.lower - 1 === point || middle.upper + 1 === point;
      
      if (middle.lower < point) {
        if (middle.upper >= point) {
          return { contained: 1, index: mid, connected: 1 };
        }
        
        if (min === max || contiguous) {
          if (contiguous) {
            return { index: mid, connected: contiguous };
          }
          return { index: mid + 1 };
        }

        min = mid + 1;
      } else if (middle.lower === point) {
        return { contained: 1, index: mid, connected: 1 };
      } else if (min === max) {
        return { index: mid, connected: contiguous };
      } else if (contiguous) {
        return { index: mid, connected: 1 };
      } else if (mid === 0) {
        return { index: 0 };
      } else if (min === max - 1) {
        return { index: min };
      } else {
        max = mid - 1;
      }
    }
  }

  contains(point) {
    checkPoint(point);
    return !!this._findCutPoint(point).contained;
  }

  /**
   * Add many intervals to this set. This modifies the state of this set.
   */
  unionAll(intervals = []) {
    for (let interval of intervals) {
      this.union(interval.lower, interval.upper);
    }
    return this;
  }

  remove(lower, upper) {
    checkInterval(lower, upper);
    throw 'Not Yet Implemented';
  }

  complement() {
    let complement = [];

    let lower = -Number.MAX_SAFE_INTEGER;
    for (let interval of this.intervals) {
      if (lower < interval.lower) {
        complement.push({
          lower: lower,
          upper: interval.lower - 1
        });

        if (interval.upper === Number.MAX_SAFE_INTEGER) {
          lower = Number.MAX_SAFE_INTEGER;
          break;
        }
        lower = interval.upper + 1;
      }
    }

    if (lower < Number.MAX_SAFE_INTEGER) {
      complement.push({
        lower: lower,
        upper: Number.MAX_SAFE_INTEGER
      });
    }

    let r = new IntIntervalSet();
    r.intervals = complement;
    return r;
  }

  /**
   * Returns a new set representing the intersection of this set with the given interval.
   */
  intersection(lower, upper) {
    checkInterval(lower, upper);
    let bounded = new IntIntervalSet();
    const intervals = this.intervals;

    if (intervals.length < 1) {
      return bounded;
    }

    let lowerPoint = this._findCutPoint(lower);
    let upperPoint = upper === lower ? lowerPoint : this._findCutPoint(upper, lowerPoint.index);

    if (lowerPoint.index >= intervals.length ||
        (upperPoint.index <= 0 && !upperPoint.contained) ||
        (lowerPoint.index === upperPoint.index && !lowerPoint.contained && !upperPoint.contained)) {
      return bounded;
    }

    let tailIndex = lowerPoint.index;
    let headIndex = upperPoint.contained ? upperPoint.index : upperPoint.index - 1;

    let subintervals = intervals.slice(tailIndex, headIndex + 1);
    let tail = subintervals[0];
    if (tail.lower < lower) {
      subintervals[0] = { lower: lower, upper: tail.upper };
    }

    let head = subintervals[subintervals.length - 1];
    if (head.upper > upper) {
      subintervals[subintervals.length - 1] = { lower: head.lower, upper: upper };
    }

    bounded.intervals = subintervals;
    return bounded;
  }

  isFull() {
    return this.intervals.length === 1 && this.intervals[0].lower === -Number.MAX_SAFE_INTEGER && this.intervals[0].upper === Number.MAX_SAFE_INTEGER;
  }

  isEmpty() {
    return this.intervals.length < 1;
  }

  span() {
    const intervals = this.intervals;
    if (intervals.length === 1) {
      return intervals[0];
    } else if (intervals.length < 1) {
      return;
    }

    const min = intervals[0];
    const max = intervals[intervals.length - 1];

    return {
      lower: min.lower,
      upper: max.upper
    };
  }
}

module.exports = IntIntervalSet;

function checkInterval(lower, upper) {
  if (!_.isInteger(lower) || !_.isInteger(upper) || lower > upper) {
    throw 'Invalid interval: [' + lower + ',' + upper + ']';
  }
}

function checkPoint(point) {
  if (!_.isInteger(point)) {
    throw 'Invalid point: ' + point;
  }
}