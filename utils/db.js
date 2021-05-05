import {MongoClient} from 'mongodb'

export async function connectToDatabase() {
     return await MongoClient.connect('mongodb://localhost:27017/next-auth', {
          useUnifiedTopology: true
     })
}