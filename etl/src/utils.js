import fetch from "node-fetch";

export async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": "mylongsecretkey",
    },
  });

  return await result.json();
}
