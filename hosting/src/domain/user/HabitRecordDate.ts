import { Comparable } from '../Comparable'

export class HabitRecordDate implements Comparable {
    static fromDate(date: Date): HabitRecordDate {
        return new HabitRecordDate({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate()
        })
    }

    readonly year: number
    readonly month: number
    readonly date: number

    constructor(params: { year: number, month: number, date: number }) {
        this.year = params.year
        this.month = params.month
        this.date = params.date
    }

    nextDate(): HabitRecordDate {
        const date = new Date(this.year, this.month - 1, this.date)
        date.setDate(date.getDate() + 1)
        return HabitRecordDate.fromDate(date)
    }

    prevDate(): HabitRecordDate {
        const date = new Date(this.year, this.month - 1, this.date)
        date.setDate(date.getDate() - 1)
        return HabitRecordDate.fromDate(date)
    }

    isSameRecordDate(recordDate: HabitRecordDate): boolean {
        return (
            recordDate.year === this.year &&
            recordDate.month === this.month &&
            recordDate.date === this.date
        )
    }

    isEqual(target: HabitRecordDate): boolean {
        return (
            target.year === this.year &&
            target.month === this.month &&
            target.date === this.date
        )
    }
}