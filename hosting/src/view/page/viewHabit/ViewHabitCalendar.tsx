import React from 'react'
import Calendar from "react-calendar"
import { Habit } from '../../../domain/user/Habit'
import { HabitRecordDate } from '../../../domain/user/HabitRecordDate'

interface ViewHabitCalendarProps {
    habit: Habit
}

const ViewHabitCalendar: React.FC<ViewHabitCalendarProps> = props => {
    return (
        <Calendar
            maxDetail="month"
            minDetail="month"
            tileClassName={({ date, view }) => {
                const recordDate = HabitRecordDate.fromDate(date)
                return props.habit.isRecordedOn(recordDate) ? 'react-calendar__tile--is-recorded' : ''
            }}
        />
    )
}

export default ViewHabitCalendar
