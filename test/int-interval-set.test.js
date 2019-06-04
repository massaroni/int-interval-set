var chai = require('chai');
var expect = chai.expect;

const IntIntervalSet = require('../src/int-interval-set');

describe('Int Interval Set', function () {

  it('should add non overlapping intervals', function () {
    let set = new IntIntervalSet();
    set.union(2, 4).union(8, 9);
    expect(set.intervals.length).to.equal(2);
    expect(set.intervals[0].lower).to.equal(2);
    expect(set.intervals[0].upper).to.equal(4);
    expect(set.intervals[1].lower).to.equal(8);
    expect(set.intervals[1].upper).to.equal(9);
  });

  it('should add overlapping intervals', function () {
    let set = new IntIntervalSet();
    set.union(2, 4);
    set.union(3, 9);
    expect(set.intervals.length).to.equal(1);
    expect(set.intervals[0].lower).to.equal(2);
    expect(set.intervals[0].upper).to.equal(9);
  });

  it('should merge overlapping intervals', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 2},
      {lower: 4, upper: 5},
      {lower: 8, upper: 9}
    ];
    set.union(2, 10);
    expect(set.intervals.length).to.equal(1);
    expect(set.intervals[0].lower).to.equal(1);
    expect(set.intervals[0].upper).to.equal(10);
  });

  it('should merge intervals on a point', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 2},
      {lower: 4, upper: 5}
    ];
    set.union(3);
    expect(set.intervals.length).to.equal(1);
    expect(set.intervals[0].lower).to.equal(1);
    expect(set.intervals[0].upper).to.equal(5);
  });

  it('should find cut points', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 3},
      {lower: 5, upper: 7},
      {lower: 11, upper: 12}
    ];

    let cut = set._findCutPoint(-1);
    expect(!!cut.connected).to.equal(false);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(0);

    cut = set._findCutPoint(0);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(0);

    cut = set._findCutPoint(1);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(0);

    cut = set._findCutPoint(2);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(0);

    cut = set._findCutPoint(3);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(0);

    cut = set._findCutPoint(4);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(1);

    cut = set._findCutPoint(5);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(1);

    cut = set._findCutPoint(6);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(1);

    cut = set._findCutPoint(7);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(1);

    cut = set._findCutPoint(8);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(1);

    cut = set._findCutPoint(9);
    expect(!!cut.connected).to.equal(false);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(2);

    cut = set._findCutPoint(10);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(2);

    cut = set._findCutPoint(11);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(2);

    cut = set._findCutPoint(12);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(true);
    expect(cut.index).to.equal(2);

    cut = set._findCutPoint(13);
    expect(!!cut.connected).to.equal(true);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(2);

    cut = set._findCutPoint(14);
    expect(!!cut.connected).to.equal(false);
    expect(!!cut.contained).to.equal(false);
    expect(cut.index).to.equal(3);
  });

  it('should know if a point is contained', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 2},
      {lower: 4, upper: 5},
      {lower: 8, upper: 9}
    ];
    
    expect(set.contains(0)).to.equal(false);
    expect(set.contains(1)).to.equal(true);
    expect(set.contains(2)).to.equal(true);
    expect(set.contains(3)).to.equal(false);
    expect(set.contains(4)).to.equal(true);
    expect(set.contains(5)).to.equal(true);
    expect(set.contains(6)).to.equal(false);
    expect(set.contains(7)).to.equal(false);
    expect(set.contains(8)).to.equal(true);
    expect(set.contains(9)).to.equal(true);
    expect(set.contains(10)).to.equal(false);
  });

  it('should generate the complement of this interval set', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 2},
      {lower: 4, upper: 5},
      {lower: 8, upper: 9}
    ];

    let actual = set.complement();
    let expected = [
      {lower: -Number.MAX_SAFE_INTEGER, upper: 0},
      {lower: 3, upper: 3},
      {lower: 6, upper: 7},
      {lower: 10, upper: Number.MAX_SAFE_INTEGER}
    ];

    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));
  });


  it('should generate an empty set as the complement of the full set', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 2},
      {lower: 4, upper: 5},
      {lower: 8, upper: 9}
    ];

    let actual = set.complement();
    let expected = [
      {lower: -Number.MAX_SAFE_INTEGER, upper: 0},
      {lower: 3, upper: 3},
      {lower: 6, upper: 7},
      {lower: 10, upper: Number.MAX_SAFE_INTEGER}
    ];

    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));
  });


  it('should generate a bounded clone of the interval set', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: 1, upper: 3},
      {lower: 5, upper: 7},
      {lower: 9, upper: 10}
    ];

    let actual = set.intersection(-5, 0);
    let expected = [];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(0, 1);
    expected = [{lower: 1, upper: 1}];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(1, 1);
    expected = [{lower: 1, upper: 1}];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(0, 2);
    expected = [{lower: 1, upper: 2}];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(2, 3);
    expected = [{lower: 2, upper: 3}];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(2, 6);
    expected = [
      {lower: 2, upper: 3},
      {lower: 5, upper: 6}];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(2, 15);
    expected = [
      {lower: 2, upper: 3},
      {lower: 5, upper: 7},
      {lower: 9, upper: 10}
    ];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(5, 7);
    expected = [{lower: 5, upper: 7}];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(7, 9);
    expected = [
      {lower: 7, upper: 7},
      {lower: 9, upper: 9}
    ];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));

    actual = set.intersection(10, 12);
    expected = [
      {lower: 10, upper: 10}
    ];
    expect(JSON.stringify(actual.intervals)).to.equal(JSON.stringify(expected));
  });


  it('should find the cut point with a hint', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: -9007199254740991, upper: 1549067879},
      {lower: 1550623081, upper: 1552865879},
      {lower:1558543081, upper: 9007199254740991}
    ];

    const lower = 1549756800;
    const upper = 1550448000;

    const lowerCutpoint = set._findCutPoint(lower);
    expect(lowerCutpoint.index).to.equal(1);
    expect(!!lowerCutpoint.connected).to.be.false;
    expect(!!lowerCutpoint.contained).to.be.false;

    const upperCutpoint = set._findCutPoint(upper);
    expect(upperCutpoint.index).to.equal(1);
    expect(!!upperCutpoint.connected).to.be.false;
    expect(!!upperCutpoint.contained).to.be.false;

    const upperCutpointHint = set._findCutPoint(upper, 1);
    expect(upperCutpointHint.index).to.equal(1);
    expect(!!upperCutpointHint.connected).to.be.false;
    expect(!!upperCutpointHint.contained).to.be.false;

    const intersection = set.intersection(lower, upper);
    expect(intersection.isEmpty()).to.be.true;
  });


  it('should find the cut point in an internal gap', function () {
    let set = new IntIntervalSet();
    set.intervals = [
      {lower: -9007199254740991, upper: 1541378279},
      {lower: 1542818281, upper: 1549067879},
      {lower: 1550623081, upper: 1551832679},
      {lower: 1558543081, upper: 9007199254740991}
    ];

    const lower = 1549756800;

    const lowerCutpoint = set._findCutPoint(lower);
    expect(lowerCutpoint.index).to.equal(2);
    expect(!!lowerCutpoint.connected).to.be.false;
    expect(!!lowerCutpoint.contained).to.be.false;
  });


});
