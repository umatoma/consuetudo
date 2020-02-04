import firebase from 'firebase/app'
import { Habit } from '../../domain/user/Habit'
import { HabitRecord } from '../../domain/user/HabitRecord'
import { HabitRecordDate } from '../../domain/user/HabitRecordDate'

export class FirebaseHabit {
    static fromHabitEntity(habit: Habit): FirebaseHabit {
        return new FirebaseHabit(
            habit.id,
            habit.name,
            habit.recordList
        )
    }

    static fromDocumentData(data: firebase.firestore.DocumentData): FirebaseHabit {
        return new FirebaseHabit(
            data.id,
            data.name,
            data.recordList
        )
    }

    constructor(
        readonly id: string,
        readonly name: string,
        readonly recordList: {
            habitId: string,
            recordDate: {
                year: number,
                month: number,
                date: number
            }
        }[]
    ) {
    }

    toObject(): object {
        return JSON.parse(JSON.stringify(this))
    }

    toHabitEntity(): Habit {
        return new Habit({
            id: this.id,
            name: this.name,
            recordList: this.recordList.map(record => {
                return new HabitRecord({
                    habitId: record.habitId,
                    recordDate: new HabitRecordDate(record.recordDate)
                })
            })
        })
    }
}
