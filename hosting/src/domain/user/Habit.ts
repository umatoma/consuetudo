import { Comparable } from '../Comparable'
import uuidv4 from 'uuid/v4'
import { HabitRecord } from './HabitRecord'
import { HabitRecordDate } from './HabitRecordDate'

export class Habit implements Comparable {
    readonly id: string
    readonly name: string
    readonly recordList: HabitRecord[]

    static newInstance(name: string): Habit {
        const id = uuidv4()
        return new Habit({ id, name, recordList: [] })
    }

    constructor(params: { id: string, name: string, recordList?: HabitRecord[] }) {
        this.id = params.id
        this.name = params.name
        this.recordList = params.recordList?.map(record => new HabitRecord(record)) || []
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

    isRecordedOn(recordDate: HabitRecordDate): boolean {
        return !!this.recordList.find((record: HabitRecord) => record.isRecordedOn(recordDate))
    }

    isEqual(target: Habit): boolean {
        return target.id === this.id
    }
}