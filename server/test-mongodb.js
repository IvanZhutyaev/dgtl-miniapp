const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://1modderpath1:BwXIv06x3OqUdNWC@clusterfortest.6nseg3h.mongodb.net/testdb';

// Test with native MongoDB driver
async function testNativeMongo() {
    try {
        console.log('Testing with native MongoDB driver...');
        const client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        await client.connect();
        console.log('Native MongoDB driver connected successfully');
        await client.close();
    } catch (err) {
        console.error('Native MongoDB connection error:', {
            error: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
    }
}

// Test with Mongoose
async function testMongoose() {
    try {
        console.log('Testing with Mongoose...');
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('Mongoose connected successfully');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Mongoose connection error:', {
            error: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
    }
}

// Run both tests
async function runTests() {
    await testNativeMongo();
    console.log('\n-------------------\n');
    await testMongoose();
    process.exit(0);
}

runTests(); 