import User from '../../domain/user/User'
import { Habit } from '../../domain/user/Habit'

interface UserState {
    user: User | null,
    habitList: Habit[]
}

export default UserState
