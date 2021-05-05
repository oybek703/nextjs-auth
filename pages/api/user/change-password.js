import {getSession} from 'next-auth/client'
import {connectToDatabase} from '../../../utils/db'
import {hashPassword, verifyPassword} from '../../../utils/auth'

async function handler(req, res) {
    const {method, body} = req
    if(method === 'PATCH') {
        const {oldPassword, newPassword} = body
        const session = await getSession({req})
        if(!session) {
            res.status(401).json({message: 'User is not authenticated.'})
            return
        }
        const client = await connectToDatabase()
        const user = await client.db().collection('users').findOne({email: session.user.email})
        if(!user) {
            res.status(404).json({message: 'User not found.'})
            client.close()
            return
        }
        const isValidPassword = await verifyPassword(oldPassword, user.password)
        if(!isValidPassword) {
            res.status(403).json({message: 'Invalid password.'})
            client.close()
            return
        }
        const hashedPassword = await hashPassword(newPassword)
        await client.db().collection('users').updateOne({email: user.email}, {$set: {password: hashedPassword}})
        res.status(200).json({message: 'User password updated.'})
        client.close()
    }
}

export default handler