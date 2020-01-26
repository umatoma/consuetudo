import * as firebase from 'firebase'
import { Habit } from './UserEntities'

function toPlainObject(obj: any): object {
    return JSON.parse(JSON.stringify(obj))
}

export interface UserRepository {
    postUserHabit(userId: string, habit: Habit): Promise<void>
    putUserHabit(userId: string, habit: Habit): Promise<void>
    deleteUserHabit(userId: string, habit: Habit): Promise<void>
    getUserHabitList(userId: string): Promise<Habit[]>
}

export class FirebaseUserRepository implements UserRepository {
    async postUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.set(toPlainObject(habit))
    }

    async putUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.update(toPlainObject(habit))
    }

    async deleteUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.delete()
    }

    async getUserHabitList(userId: string): Promise<Habit[]> {
        const db = firebase.firestore()

        const habitListRef = db
            .collection('users').doc(userId)
            .collection('habits')
        const querySnapshot = await habitListRef.get()

        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            return new Habit({ id: data.id, name: data.name, recordList: data.recordList })
        })
    }
}