import axios from "axios";

const graphqlClient = async (query, variables) => {
  try {
    const response = await axios.post("/graphql", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: {
        query,
        variables,
      },
    });
    return response.data;
  } catch (err) {
    console.error("GraphQL request failed:", err);
    throw err;
  }
};

export default graphqlClient;
