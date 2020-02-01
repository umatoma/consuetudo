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

    setName(name: string): Habit {
        return new Habit({ ...this, name })
    }

    pushRecord(record: HabitRecord): Habit {
        if (this.recordList.find(r => r.isEqual(record))) {
            throw new Error('Failed to pushRecord()')
        }

        const recordList = [...this.recordList, record]
        return new Habit({ ...this, recordList })
    }

    removeRecord(record: HabitRecord): Habit {
        const recordList = this.recordList.filter(r => !r.isEqual(record))
        return new Habit({ ...this, recordList })
    }

    isRecordedOn(recordDate: HabitRecordDate): boolean {
        return !!this.recordList.find((record: HabitRecord) => record.isRecordedOn(recordDate))
    }

    isEqual(target: Habit): boolean {
        return target.id === this.id
    }
}