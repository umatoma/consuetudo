import * as firebase from 'firebase'
import { Habit, User } from './UserEntities'

export interface UserRepository {
    postUserHabit(userId: string, habit: Habit): Promise<void>
    getUserHabitList(userId: string): Promise<Habit[]>
    deleteUserHabit(userId: string, habit: Habit): Promise<void>
}

export class FirebaseUserRepository implements UserRepository {
    async postUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.set(habit.toObject())
    }

    async getUserHabitList(userId: string): Promise<Habit[]> {
        const db = firebase.firestore()

        const habitListRef = db
            .collection('users').doc(userId)
            .collection('habits')
        const querySnapshot = await habitListRef.get()

        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            return new Habit(doc.id, data.name)
        })
    }

    async deleteUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.delete()
    }
}