import uuidv4 from 'uuid/v4'

export interface Objectable {
    toObject(): object
}

export class User {
    constructor(
        public habitList: Habit[]
    ) {
    }
}

export class Habit implements Objectable {
    static newEntity(name: string): Habit {
        const id = uuidv4()
        return new Habit(id, name)
    }

    constructor(
        public id: string,
        public name: string
    ) {
    }

    toObject(): object {
        return Object.assign({}, this);
    }
}
