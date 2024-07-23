const typeDefs = `#graphql

    type User {
        userId: ID!,
        username: String!,
        email: String,
        hashWord: String,
        role: Role,
        graphs: [Graph],
    }

    enum Role {
        USER
        ADMIN
    }

    type Graph {
        graphId: ID!,
        user: User
        graphName: String,
        nodes: String,
        edges: String,
    }

    type Query {
        user(userId: ID!): User!
        graph(graphId: ID!): Graph!
    }

    type Mutation {
        createUser( newUser: createUserInput! ): createUserResult,
        createGraph ( newGraph: createGraphInput! ): Graph,
        saveGraph ( updatedGraph: saveGraphInput! ): Graph,
    }

    input createUserInput {
        username: String!,
        email: String,
        hashWord: String,
        role: Role,
    }
    type createUserResult {
        userId: ID!,
        username: String!,
        email: String!,
    }

    input createGraphInput {
        userId: ID!,
        graphName: String!,
        nodes: String,
        edges: String,
    }

    input saveGraphInput {
        userId: ID!,
        graphName: String!,
        nodes: String!,
        edges: String!,
    }
`;

module.exports = typeDefs;