const express = require('express');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const ServerApiVersion = mongodb.ServerApiVersion;

// MongoDB stuff from .env
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const database = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;

const uri = `mongodb+srv://${username}:${password}@cluster0.euv7596.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const db = {
    database: database,
    collection: collection,
    client: client
}

const app = express();

app.set('views', path.resolve(__dirname, 'templates'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));

// Define app routes in another file!
require('./routes')(app, db);


const main = async () => {
    await client.connect();

    if (process.argv.length != 3) {
        console.error('Usage: magicGenieServer.js port');
        process.exit(0);
    }

    const portNumber = process.argv[2];
    app.listen(portNumber);
    console.log(`Web server started and running at http://localhost:${portNumber}`);

    process.stdin.setEncoding('utf8'); 
    process.stdout.write('Type Stop shutdown the server: ');
    process.stdin.on('readable', () => {
        let dataInput = process.stdin.read();
        if (dataInput !== null) {
            let command = dataInput.trim().toLowerCase();
            if (command === 'stop') {
                console.log('Shutting down the server');
                process.exit(0);
            } else {
                console.log(`Invalid command: ${command}`);
            }
    
            process.stdin.resume();
            process.stdout.write('Type Stop shutdown the server: ');
        }
    });
}

main().catch(console.error);