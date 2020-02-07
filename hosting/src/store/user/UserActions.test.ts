import sinon from 'sinon'
import { createStore } from '../index'
import { UserActions } from './UserActions'
import UserRepository from './UserRepository'
import UserState from './UserState'
import { Habit } from '../../domain/user/Habit'
import User from '../../domain/user/User'
import ThunkStore from '../ThunkStore'
import StoreState from '../StoreState'
import { HabitRecord } from '../../domain/user/HabitRecord'
import { HabitRecordDate } from '../../domain/user/HabitRecordDate'


describe('UserActions', () => {

    const sandbox = sinon.createSandbox()

    let store: ThunkStore<StoreState>
    let userRepository: UserRepository
    let userActions: UserActions
    let stubGetUserHabitList: sinon.SinonStub<[string], Promise<Habit[]>>
    let stubPostUserHabit: sinon.SinonStub<[string, Habit], Promise<void>>
    let stubPutUserHabit: sinon.SinonStub<[string, Habit], Promise<void>>
    let stubDeleteUserHabit: sinon.SinonStub<[string, Habit], Promise<void>>

    const getUserState = (): UserState => {
        return store.getState().user
    }

    const testUser = new User({
        id: 'user-id'
    })
    const testHabitList = [
        new Habit({
            id: 'habit-id-1',
            name: 'habit-name-1',
            recordList: [
                new HabitRecord({
                    habitId: 'habit-id-1',
                    recordDate: new HabitRecordDate({ year: 2999, month: 1, date: 23 })
                }),
                new HabitRecord({
                    habitId: 'habit-id-1',
                    recordDate: new HabitRecordDate({ year: 2999, month: 5, date: 18 })
                }),
            ],
        }),
        new Habit({
            id: 'habit-id-2',
            name: 'habit-name-2',
            recordList: [],
        }),
    ]

    beforeEach(() => {
        store = createStore()
        userRepository = new StubUserRepository()
        userActions = new UserActions(store.dispatch, userRepository)

        stubGetUserHabitList = sandbox.stub(userRepository, 'getUserHabitList')
        stubPostUserHabit = sandbox.stub(userRepository, 'postUserHabit')
        stubPutUserHabit = sandbox.stub(userRepository, 'putUserHabit')
        stubDeleteUserHabit = sandbox.stub(userRepository, 'deleteUserHabit')
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('when user state is provided', () => {

        beforeEach(() => {
            userActions.setUser(testUser)
        })

        describe('loadUserState', () => {

            beforeEach(() => {
                stubGetUserHabitList.resolves(testHabitList)
            })

            it('should update habitList state', async () => {
                expect(getUserState().habitList).toStrictEqual([])

                await userActions.loadUserState()

                expect(getUserState().habitList).toStrictEqual(testHabitList)
            })
        })

        describe('postUserHabit', () => {

            const newHabitList = [
                ...testHabitList,
                new Habit({
                    id: 'habit-id-3',
                    name: 'new-habit-name'
                })
            ]

            beforeEach(() => {
                stubPostUserHabit.resolves()
                stubGetUserHabitList.resolves(newHabitList)
            })

            it('should call repository#postUserHabit', async () => {
                await userActions.postUserHabit('new-habit-name')

                expect(stubPostUserHabit.calledOnce).toBeTruthy()
                expect(stubPostUserHabit.firstCall.args[0]).toBe(testUser.id)
                expect(stubPostUserHabit.firstCall.args[1]).toMatchObject({
                    name: 'new-habit-name'
                })
            })

            it('should update habitList state', async () => {
                expect(getUserState().habitList).toStrictEqual([])

                await userActions.postUserHabit('new-habit-name')

                expect(getUserState().habitList).toStrictEqual(newHabitList)
            })
        })

        describe('putUserHabit', () => {

            const newHabit = new Habit({
                id: 'habit-id-new',
                name: 'habit-name-new'
            })

            const newHabitList = [
                ...testHabitList,
                newHabit
            ]

            beforeEach(() => {
                stubPutUserHabit.resolves()
                stubGetUserHabitList.resolves(newHabitList)
            })

            it('should call repository#putUserHabit', async () => {
                await userActions.putUserHabit(newHabit)

                expect(stubPutUserHabit.calledOnce).toBeTruthy()
                expect(stubPutUserHabit.firstCall.args[0]).toBe(testUser.id)
                expect(stubPutUserHabit.firstCall.args[1]).toMatchObject(newHabit)
            })

            it('should update habitList state', async () => {
                expect(getUserState().habitList).toStrictEqual([])

                await userActions.putUserHabit(newHabit)

                expect(getUserState().habitList).toStrictEqual(newHabitList)
            })
        })

        describe('deleteUserHabit', () => {

            const targetHabit = new Habit({
                id: 'habit-id-new',
                name: 'habit-name-new'
            })

            const newHabitList = [
                ...testHabitList
            ]

            beforeEach(() => {
                stubDeleteUserHabit.resolves()
                stubGetUserHabitList.resolves(newHabitList)
            })

            it('should call repository#deleteUserHabit', async () => {
                await userActions.deleteUserHabit(targetHabit)

                expect(stubDeleteUserHabit.calledOnce).toBeTruthy()
                expect(stubDeleteUserHabit.firstCall.args[0]).toBe(testUser.id)
                expect(stubDeleteUserHabit.firstCall.args[1]).toMatchObject(targetHabit)
            })

            it('should update habitList state', async () => {
                expect(getUserState().habitList).toStrictEqual([])

                await userActions.deleteUserHabit(targetHabit)

                expect(getUserState().habitList).toStrictEqual(newHabitList)
            })
        })

        describe('pushUserHabitRecord', () => {

            const targetHabit = testHabitList[0]
            const targetHabitRecord = new HabitRecord({
                habitId: targetHabit.id,
                recordDate: new HabitRecordDate({ year: 2999, month: 11, date: 11 })
            })
            const expectedHabit = new Habit({
                id: targetHabit.id,
                name: targetHabit.name,
                recordList: [
                    ...targetHabit.recordList,
                    targetHabitRecord
                ]
            })

            const newHabitList = [
                expectedHabit,
                testHabitList[1]
            ]

            beforeEach(() => {
                stubPutUserHabit.resolves()
                stubGetUserHabitList.resolves(newHabitList)
                store.getState().user.habitList = testHabitList
            })

            it('should call repository#putUserHabitRecord', async () => {
                await userActions.pushUserHabitRecord(targetHabitRecord)

                expect(stubPutUserHabit.calledOnce).toBeTruthy()
                expect(stubPutUserHabit.firstCall.args[0]).toBe(testUser.id)
                expect(stubPutUserHabit.firstCall.args[1]).toMatchObject(expectedHabit)
            })

            it('should update habitList state', async () => {
                expect(getUserState().habitList).toStrictEqual(testHabitList)

                await userActions.pushUserHabitRecord(targetHabitRecord)

                expect(getUserState().habitList).toStrictEqual(newHabitList)
            })

            describe('when the habit does not exist', () => {

                const targetHabitRecord = new HabitRecord({
                    habitId: 'habit-id-XXX',
                    recordDate: new HabitRecordDate({ year: 9999, month: 12, date: 31 })
                })

                it('should throw error', async () => {
                    await expect(
                        userActions.pushUserHabitRecord(targetHabitRecord)
                    ).rejects.toThrow()
                })
            })
        })

        describe('removeUserHabitRecord', () => {

            const targetHabit = testHabitList[0]
            const targetHabitRecord = new HabitRecord({
                habitId: targetHabit.id,
                recordDate: new HabitRecordDate({ year: 2999, month: 1, date: 23 })
            })
            const expectedHabit = new Habit({
                id: targetHabit.id,
                name: targetHabit.name,
                recordList: [
                    new HabitRecord({
                        habitId: targetHabit.id,
                        recordDate: new HabitRecordDate({ year: 2999, month: 5, date: 18 })
                    }),
                ]
            })

            const newHabitList = [
                expectedHabit,
                testHabitList[1]
            ]

            beforeEach(() => {
                stubPutUserHabit.resolves()
                stubGetUserHabitList.resolves(newHabitList)
                store.getState().user.habitList = testHabitList
            })

            it('should call repository#putUserHabitRecord', async () => {
                await userActions.removeUserHabitRecord(targetHabitRecord)

                expect(stubPutUserHabit.calledOnce).toBeTruthy()
                expect(stubPutUserHabit.firstCall.args[0]).toBe(testUser.id)
                expect(stubPutUserHabit.firstCall.args[1]).toMatchObject(expectedHabit)
            })

            it('should update habitList state', async () => {
                expect(getUserState().habitList).toStrictEqual(testHabitList)

                await userActions.removeUserHabitRecord(targetHabitRecord)

                expect(getUserState().habitList).toStrictEqual(newHabitList)
            })

            describe('when the habit does not exist', () => {

                const targetHabitRecord = new HabitRecord({
                    habitId: 'habit-id-XXX',
                    recordDate: new HabitRecordDate({ year: 9999, month: 12, date: 31 })
                })

                it('should throw error', async () => {
                    await expect(
                        userActions.removeUserHabitRecord(targetHabitRecord)
                    ).rejects.toThrow()
                })
            })
        })
    })
})

class StubUserRepository implements UserRepository {
    deleteUserHabit(userId: string, habit: Habit): Promise<void> {
        return null as any
    }

    getUserHabitList(userId: string): Promise<Habit[]> {
        return null as any
    }

    postUserHabit(userId: string, habit: Habit): Promise<void> {
        return null as any
    }

    putUserHabit(userId: string, habit: Habit): Promise<void> {
        return null as any
    }
}
