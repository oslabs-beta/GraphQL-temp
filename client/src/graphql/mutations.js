// called from auth context
export const VALIDATE_SESSION = `
    mutation ($token: String!) {
        validateSession (token: $token) {
            user {
                userId
                username
                role
            }
            token
        }
    }
`;

// called from login page
export const LOGIN_USER = `
    mutation ($userCreds: loginUserInput!) {
        loginUser (userCreds: $userCreds) {
            user {
                userId
                username
                role
            }
            token
        }
    }
`;

// called from sign up page
export const SIGNUP_USER = `
    mutation ($newUser: createUserInput!) {
        createUser (newUser: $newUser) {
            user {
                userId
                username
                role
            }
            token
        }
    }
`;

// called from dashboard page
export const CREATE_GRAPH = `
    mutation ($newGraph: createGraphInput!) {
        createGraph(newGraph: $newGraph) {
            graphId
            graphName
            nodes
            edges
        }
    }
`;

// called from graph page
export const SAVE_GRAPH = `
    mutation ($updatedGraph: saveGraphInput!) {
        saveGraph (updatedGraph: $updatedGraph) {
            graphId
            graphName
            nodes
            edges
        }
    }
`;
