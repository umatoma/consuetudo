import * as fs from 'fs'
import * as firebase from 'firebase'
import {
    apps,
    assertFails,
    assertSucceeds,
    clearFirestoreData,
    initializeTestApp,
    loadFirestoreRules
} from '@firebase/testing'

describe('Firestore security rules', () => {

    const projectId = 'my-test-project'
    const auth = { uid: 'test-uid', email: 'test@example.com' }
    let db: firebase.firestore.Firestore

    function createFirestore(auth: object): firebase.firestore.Firestore {
        return initializeTestApp({
            projectId: projectId,
            auth: auth
        }).firestore()
    }

    beforeAll(async () => {
        await loadFirestoreRules({
            projectId: projectId,
            rules: fs.readFileSync('./firestore.rules', 'utf8')
        })
    })

    beforeEach(() => {
        db = createFirestore(auth)
    })

    afterEach(async () => {
        await clearFirestoreData({
            projectId: projectId
        })
    })

    afterAll(async () => {
        for (const app of apps()) {
            await app.delete()
        }
    })

    describe('/users/{userId}', () => {
        describe('allow create', () => {
            it('can create', async () => {
                const user = db.collection('users').doc(auth.uid)
                await assertSucceeds(user.set({ habitList: [] }))
            })

            describe('when userId and auth.uid are different', () => {
                it('can NOT create', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const user = anotherDb.collection('users').doc(auth.uid)
                    await assertFails(user.set({ habitList: [] }))
                })
            })
        })

        describe('allow read', () => {
            beforeEach(async () => {
                const user = db.collection('users').doc(auth.uid)
                await user.set({ habitList: [] })
            })

            it('can read', async () => {
                const user = db.collection('users').doc(auth.uid)
                await assertSucceeds(user.get())
            })

            describe('when userId and auth.uid are different', () => {
                it('can NOT read', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const user = anotherDb.collection('users').doc(auth.uid)
                    await assertFails(user.get())
                })
            })
        })

        describe('allow update', () => {
            beforeEach(async () => {
                const user = db.collection('users').doc(auth.uid)
                await user.set({ habitList: [] })
            })

            it('can update', async () => {
                const user = db.collection('users').doc(auth.uid)
                await assertSucceeds(user.update({ a: 'b' }))
            })

            describe('when userId and auth.uid are different', () => {
                it('can NOT update', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const user = anotherDb.collection('users').doc(auth.uid)
                    await assertFails(user.update({ a: 'b' }))
                })
            })
        })

        describe('/users/{userId}/habits/{habitId}', () => {
            const habitId = 'test-habit-id'

            describe('allow create', () => {
                it('can create', async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await assertSucceeds(habit.set({ name: 'test-title' }))
                })

                describe('when userId and auth.uid are different', () => {
                    it('can NOT create', async () => {
                        const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                        const habit = anotherDb
                            .collection('users').doc(auth.uid)
                            .collection('habits').doc(habitId)
                        await assertFails(habit.set({ name: 'test-title' }))
                    })
                })
            })

            describe('allow read', () => {
                const habitId = 'test-habit-id'

                beforeEach(async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await habit.set({ name: 'test-title' })
                })

                it('can read', async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await assertSucceeds(habit.get())
                })

                describe('when userId and auth.uid are different', () => {
                    it('can NOT read', async () => {
                        const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                        const habit = anotherDb
                            .collection('users').doc(auth.uid)
                            .collection('habits').doc(habitId)
                        await assertFails(habit.get())
                    })
                })
            })

            describe('allow update', () => {
                const habitId = 'test-habit-id'

                beforeEach(async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await habit.set({ name: 'test-title', userId: auth.uid })
                })

                it('can update', async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await assertSucceeds(habit.update({ name: 'new-name' }))
                })

                describe('when userId and auth.uid are different', () => {
                    it('can NOT read', async () => {
                        const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                        const habit = anotherDb
                            .collection('users').doc(auth.uid)
                            .collection('habits').doc(habitId)
                        await assertFails(habit.update({ name: 'new-name' }))
                    })
                })
            })

            describe('allow delete', () => {
                const habitId = 'test-habit-id'

                beforeEach(async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await habit.set({ name: 'test-title', userId: auth.uid })
                })

                it('can delete', async () => {
                    const habit = db
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await assertSucceeds(habit.delete())
                })

                describe('when userId and auth.uid are different', () => {
                    it('can NOT delete', async () => {
                        const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                        const habit = anotherDb
                            .collection('users').doc(auth.uid)
                            .collection('habits').doc(habitId)
                        await assertFails(habit.delete())
                    })
                })
            })
        })
    })
})
