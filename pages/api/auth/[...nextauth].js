import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import {connectToDatabase} from '../../../utils/db'
import {verifyPassword} from '../../../utils/auth'

export default NextAuth({
    session: {
        jwt: true
    },
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                const client = await connectToDatabase()
                const db = client.db()
                const user = await db.collection('users').findOne({email: credentials.email})
                if(!user) {
                    client.close()
                    throw new Error('User not found.')
                }
                const isValidPassword = await verifyPassword(credentials.password, user.password)
                if(!isValidPassword) {
                    client.close()
                    throw new Error('Provided user credentials invalid.')
                }
                client.close()
                return {email: credentials.email}
            }
        })
    ]
})