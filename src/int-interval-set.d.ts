declare module 'int-interval-set' {
    interface Interval {
        lower: number
        upper: number
    }

    class IntIntervalSet {
        public clone (): IntIntervalSet
        public union (lower: number, upper?: number): IntIntervalSet
        public contains (point: number): boolean
        public values (): Generator<number, void, void>
        public points (): Generator<number, void, void>
        public unionAll (intervals: Interval[])
        public complement (): IntIntervalSet
        public intersection (lower: number, upper: number): IntIntervalSet
        public isFull (): boolean
        public isEmpty (): boolean
        public span (): Interval
        public spanSet (): IntIntervalSet
    }

    export = IntIntervalSet
}
