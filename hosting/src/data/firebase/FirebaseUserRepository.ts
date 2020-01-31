import * as firebase from 'firebase'
import UserRepository from '../../store/user/UserRepository'
import { FirebaseHabit } from './FirebaseDataObjects'
import { Habit } from '../../domain/user/Habit'

export class FirebaseUserRepository implements UserRepository {
    async postUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.set(FirebaseHabit.fromHabitEntity(habit).toObject())
    }

    async putUserHabit(userId: string, habit: Habit): Promise<void> {
        const db = firebase.firestore()

        const habitRef = db
            .collection('users').doc(userId)
            .collection('habits').doc(habit.id)
        await habitRef.update(FirebaseHabit.fromHabitEntity(habit).toObject())
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
            return FirebaseHabit.fromDocumentData(doc.data()).toHabitEntity()
        })
    }
}