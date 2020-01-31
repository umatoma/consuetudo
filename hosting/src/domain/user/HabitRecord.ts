import { Comparable } from '../Comparable'
import { HabitRecordDate } from './HabitRecordDate'

export class HabitRecord implements Comparable {
    readonly habitId: string
    readonly recordDate: HabitRecordDate

    constructor(params: { habitId: string, recordDate: HabitRecordDate }) {
        this.habitId = params.habitId
        this.recordDate = new HabitRecordDate(params.recordDate)
    }

    isRecordedOn(recordDate: HabitRecordDate) {
        return recordDate.isSameRecordDate(this.recordDate)
    }

    isEqual(target: HabitRecord): boolean {
        return (
            target.habitId === this.habitId &&
            target.recordDate.isEqual(this.recordDate)
        )
    }
}