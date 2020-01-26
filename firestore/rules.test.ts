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

        describe('allow read, update', () => {
            beforeEach(async () => {
                const user = db.collection('users').doc(auth.uid)
                await user.set({ habitList: [] })
            })

            it('can read', async () => {
                const user = db.collection('users').doc(auth.uid)
                await assertSucceeds(user.get())
            })

            it('can update', async () => {
                const user = db.collection('users').doc(auth.uid)
                await assertSucceeds(user.update({ a: 'b' }))
            })

            describe('when userId and auth.uid are different', () => {
                it('can NOT read', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const user = anotherDb.collection('users').doc(auth.uid)
                    await assertFails(user.get())
                })

                it('can NOT update', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const user = anotherDb.collection('users').doc(auth.uid)
                    await assertFails(user.update({ a: 'b' }))
                })
            })
        })
    })

    // ---------- //

    describe('/users/{userId}/habits/{habitId}', () => {
        describe('allow read, update, delete', () => {
            const habitId = 'test-habit-id'

            beforeEach(async () => {
                const habit = db
                    .collection('users').doc(auth.uid)
                    .collection('habits').doc(habitId)
                await assertSucceeds(habit.set({ name: 'test-title' }))
            })

            it('can create', async () => {
                const habit = db
                    .collection('users').doc(auth.uid)
                    .collection('habits').doc('new-habit-id')
                await assertSucceeds(habit.set({ name: 'test-title' }))
            })

            it('can read', async () => {
                const habit = db
                    .collection('users').doc(auth.uid)
                    .collection('habits').doc(habitId)
                await assertSucceeds(habit.get())
            })

            it('can update', async () => {
                const habit = db
                    .collection('users').doc(auth.uid)
                    .collection('habits').doc(habitId)
                await assertSucceeds(habit.update({ name: 'new-name' }))
            })

            it('can delete', async () => {
                const habit = db
                    .collection('users').doc(auth.uid)
                    .collection('habits').doc(habitId)
                await assertSucceeds(habit.delete())
            })

            describe('when userId and auth.uid are different', () => {
                it('can NOT create', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const habit = anotherDb
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc('new-habit-id')
                    await assertFails(habit.set({ name: 'test-title' }))
                })

                it('can NOT read', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const habit = anotherDb
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await assertFails(habit.get())
                })

                it('can NOT update', async () => {
                    const anotherDb = createFirestore({ uid: 'another-uid', email: 'test@example.com' })

                    const habit = anotherDb
                        .collection('users').doc(auth.uid)
                        .collection('habits').doc(habitId)
                    await assertFails(habit.update({ name: 'new-name' }))
                })

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
