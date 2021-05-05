import {hash, compare} from 'bcryptjs'

export async function hashPassword(password) {
    return await hash(password, 10)
}

export async function verifyPassword(password, hashedPassword) {
    return await compare(password, hashedPassword)
}

