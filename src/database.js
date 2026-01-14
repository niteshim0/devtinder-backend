const {MongoClient} = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();



const DBName = "HelloNode";

const client = new MongoClient(process.env.MONGO_URL);


async function main() {

  await client.connect();
  console.log("DB connected successfully to server");

  const db = client.db(DBName);

  const collection = db.collection('User');

  // Doing all the CRUD operations here
  //  these operations returns cursor thats why .toArray functions
  // Read Operations
  const findUsers = await collection.find({}).toArray();
  console.log(findUsers);

  // Create Operations

  // const insertManyDocs = await collection.insertMany([
  // {
  // "firstName": "Nitesh",
  // "lastName": "Kushwaha",
  // "city": "Salempur",
  // "phoneNo": "9876543210"
  // },
  // {
  // "firstName": "Mithilesh",
  // "lastName": "Kushwaha",
  // "city": "Tundla",
  // "phoneNo": "9876543210"
  // },
  // {
  // "firstName": "Chandan",
  // "lastName": "Kushwaha",
  // "city": "Gujarat",
  // "phoneNo": "9876543210"
  // }
  // ]);

  const data = {
  firstName: "Bhoot",
  lastName: "Sharma",
  city : "KaaliRaatein",
  phoneNo: "9876543210"
  }


  // const insertData = await collection.insertOne(data);
  // console.log(insertData);


  // Update
  // const updateResult = await collection.updateMany({city : "KaaliRaatein"},{$set : {city : "Darna Zaroori Hai"}});
  // return 'done';
  // console.log("Updated Docs=>",updateResult);
  
  // Delete
  const deleteResult = await collection.deleteMany({city : "Darna Zaroori Hai"});
  console.log('Deleted documents =>', deleteResult);

  // Find

  const userFind = await collection.find({lastName : "Kushwaha"}).toArray();
  console.log("Find User =>" ,userFind);
}


main()
.then(console.log)
.catch(console.error)
.finally(()=> client.close());
