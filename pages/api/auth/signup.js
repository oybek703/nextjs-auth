import {connectToDatabase} from '../../../utils/db'
import {hashPassword} from '../../../utils/auth'

async function handler(req, res) {
    const {body, method} = req
    if(method === 'POST') {
        const {email, password} = body
        if(!email || !email.includes('@') || !password || password.trim().length < 7) {
            res.status(422).json({message: 'Invalid user credentials.'})
            return
        }
        const client = await connectToDatabase()
        const db = client.db()
        const existingUser = await db.collection('users').findOne({email})
        if(existingUser) {
            res.status(422).json({message: 'User already exists.'})
            client.close()
            return
        }
        const hashedPassword = await hashPassword(password)
        const result = await db.collection('users').insertOne({email, password: hashedPassword})
        res.status(201).json({message: `${result.insertedId} user created.`})
        client.close()
    }
}

export default handler