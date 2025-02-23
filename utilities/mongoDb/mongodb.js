const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_BASE_URL_STAGING;
const dbName = process.env.MONGO_DB_STAGING;

class MongoDB {
    constructor() {
        this.client = new MongoClient(uri);
    }

    // Connect to the MongoDB database
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(dbName);

            return this.client;

        } catch (err) {
            throw err;
        }
    }

    // Disconnect from the MongoDB database
    async disconnect() {
        await this.client.close();
    }

    // Find multiple documents in a collection based on a query
    async find(collectionName, query, options = {}) {
        const collection = this.db.collection(collectionName);
        const result = await collection.find(query, options).toArray();

        if (!result || result.length === 0) {
            throw new Error(`Koleksiyon veya döküman bulunamadı: ${collectionName} için sorgu: ${JSON.stringify(query)}`);
        }

        return result;
    }

    // Find a single document in a collection based on a query
    async findOne(collectionName, query, options = {}) {
        const collection = this.db.collection(collectionName);

        return await collection.findOne(query, options);
    }

    // Update a single document in a collection based on a query
    async findOneAndUpdate(collectionName, query, update, options = {}) {
        const collection = this.db.collection(collectionName);

        return await collection.findOneAndUpdate(query, { $set: update }, options);
    }

    // Delete a single document from a collection based on a query
    async deleteOne(collectionName, query, options = {}) {
        const collection = this.db.collection(collectionName);

        // Check if the query and options are valid
        if (!query || typeof query !== 'object' || Array.isArray(query)) {
            throw new Error("Invalid query object.");
        }

        if (options && (typeof options !== 'object' || Array.isArray(options))) {
            throw new Error("Invalid options object.");
        }

        console.info("MONGODB DELETE : " + collectionName, "QUERY : " + JSON.stringify(query));

        const result = await collection.deleteOne(query, options);
        if (result.deletedCount === 0) {
            throw new Error(`No document found for query: ${JSON.stringify(query)}`);
        }

        return result;
    }
    async deleteMany(collectionName, query, options = {}) {
        const collection = this.db.collection(collectionName);
        console.info("MONGODB DELETE : " + collectionName , "QUERY : " + JSON.stringify(query))

        return await collection.deleteMany(query, options);
    }

}


// Instantiate a MongoDB object
const mongoDB = new MongoDB();

module.exports = { MongoDB, mongoDB, ObjectId };
