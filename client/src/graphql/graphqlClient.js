import axios from "axios";

const graphqlClient = async (query, variables) => {
  try {
    console.log("query:", query);
    const response = await axios.post(
      "/api",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status !== 200) {
      console.log(response.message);
    }
    if (response.data.errors) {
      for (let error of response.data.errors) {
        console.error(error);
      }
      throw new Error("GraphQL error:", response.data.errors[0]);
    }
    return response;
  } catch (err) {
    console.error("GraphQL request failed:", err);
    throw err;
  }
};

export default graphqlClient;
