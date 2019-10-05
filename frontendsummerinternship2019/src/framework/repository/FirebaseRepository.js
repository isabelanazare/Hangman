import '@babel/polyfill';

export default class FirebaseRepository {
    constructor(database, collectionName) {
        this._collectionName = collectionName;
        this._database = database;
    }

    get collectionName() {
        return this._collectionName;
    }
    
    async getAll() {
        let items = [];

        let snapshot = await this._database.collection(this._collectionName).get();
        
        snapshot.docs.forEach((doc) => {
            let item = doc.data();
            item.id = doc.id;

            items.push(item);
        });

        //console.log(snapshot);

        return items;
    }

    async deleteAll() {
        let items = await this.getAll();

        items.forEach(async (item) => {
            await this.delete(item.id);
        });
    }

    async add(item) {
        let documentRef = await this._database.collection(this._collectionName).add(item);

        return documentRef.id;
    }

    async update(item) {
        let documentRef = this._database.collection(this._collectionName).doc(item.id);

        delete item.id;

        await documentRef.set(item, {merge: true});
    }

    async delete(itemId) {
        console.log(itemId);
        let documentRef = this._database.collection(this._collectionName).doc(itemId);

        await documentRef.delete();
    }
}