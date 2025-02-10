import pc from '@prisma/client'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import { sign } from 'crypto'
import jwt from 'jsonwebtoken'

// console.log(process.env.JWT_SECRET);

const prisma = new pc.PrismaClient()
const resolvers = {
    Query: {
        users: async (_, args, { userId }) => {
            console.log(userId)
            if (!userId) throw new ForbiddenError('Not Authorized')
            const users = await prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    id: {
                        not: userId,

                    }
                }
            })
            return users
        },
        messageByUser: async (_, { receiverId }, { userId }) => {
            if (!userId) throw new ForbiddenError('Not Authorized')
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            senderId: userId,
                            receiverId
                        },
                        {
                            senderId: receiverId,
                            receiverId: userId
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'desc',

                }
            })
            return messages
        }
    },
    Mutation: {
        signupUser: async (_, { userNew }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: userNew.email
                }
            })
            if (user) {
                throw new AuthenticationError('User already exists')
            }
            const hashedPassword = await bcrypt.hash(userNew.password, 10)
            const newUser = await prisma.user.create({
                data: {
                    ...userNew,
                    password: hashedPassword
                }
            })
            return newUser
        },
        signinUser: async (_, { userSignin }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: userSignin.email
                }
            })
            if (!user) {
                throw new AuthenticationError('Email not found')
            }
            const valid = await bcrypt.compare(userSignin.password, user.password)
            if (!valid) {
                throw new AuthenticationError('Invalid Credentials')
            }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            return { token }
        },
        createMessage: async (_, { receiverId, text }, { userId }) => {
            if (!userId) throw new ForbiddenError('Not Authorized')
            const message = await prisma.message.create({
                data: {
                    text,
                    receiverId,
                    senderId: userId
                }
            })
            return message
        }
    }
}
export default resolvers