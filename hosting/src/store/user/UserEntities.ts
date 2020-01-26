import uuidv4 from 'uuid/v4'

export interface Comparable {
    isEqual(target: Comparable): boolean
}

export class User {
    constructor(
        public habitList: Habit[]
    ) {
    }
}

export class Habit implements Comparable {
    readonly id: string
    readonly name: string
    readonly recordList: HabitRecord[]

    static newEntity(name: string): Habit {
        const id = uuidv4()
        return new Habit({ id, name, recordList: [] })
    }

    constructor(params: { id: string, name: string, recordList?: HabitRecord[] }) {
        this.id = params.id
        this.name = params.name
        this.recordList = params.recordList || []
    }

    pushRecord(record: HabitRecord): Habit {
        if (this.recordList.find(r => r.isEqual(record))) {
            throw new Error('Failed to pushRecord()')
        }

        return new Habit({
            id: this.id,
            name: this.name,
            recordList: [...this.recordList, record]
        })
    }

    removeRecord(record: HabitRecord): Habit {
        const recordList = this.recordList.filter(r => !r.isEqual(record))

        return new Habit({
            id: this.id,
            name: this.name,
            recordList: recordList
        })
    }

    isRecordedOn(year: number, month: number, date: number): boolean {
        return !!this.recordList.find((record: HabitRecord) => record.isRecordedOn(year, month, date))
    }

    toObject(): object {
        return Object.assign({}, this)
    }

    isEqual(target: Habit): boolean {
        return target.id === this.id
    }
}

export class HabitRecord implements Comparable {
    readonly habitId: string
    readonly year: number
    readonly month: number
    readonly date: number

    constructor(params: { habitId: string, year: number, month: number, date: number }) {
        this.habitId = params.habitId
        this.year = params.year
        this.month = params.month
        this.date = params.date
    }

    isRecordedOn(year: number, month: number, date: number) {
        return (
            year === this.year &&
            month === this.month &&
            date === this.date
        )
    }

    isEqual(target: HabitRecord): boolean {
        return (
            target.habitId === this.habitId &&
            target.year === this.year &&
            target.month === this.month &&
            target.date === this.date
        )
    }
}
