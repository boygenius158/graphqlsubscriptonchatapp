import express from "express"
import { ApolloServer, AuthenticationError, gql } from "apollo-server-express"
import typeDefs from "./typeDefs.js"
import resolvers from "./resolvers.js"

import jwt from 'jsonwebtoken';





const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        console.log("Authorization Header:", req.headers.authorization); 

        const token = req.headers.authorization || '';

        if (token) {
            try {
                const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
                return { userId: decoded.userId };
            } catch (error) {
                throw new AuthenticationError('Invalid Token');
            }
        }
        
        return { userId: null };
    }
});
async function startServer() {
    await server.start()
    server.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    })
}

startServer()
