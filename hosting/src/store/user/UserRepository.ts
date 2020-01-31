import { Habit } from '../../domain/user/Habit'

export default interface UserRepository {
    postUserHabit(userId: string, habit: Habit): Promise<void>
    putUserHabit(userId: string, habit: Habit): Promise<void>
    deleteUserHabit(userId: string, habit: Habit): Promise<void>
    getUserHabitList(userId: string): Promise<Habit[]>
}
