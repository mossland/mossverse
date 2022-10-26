import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, InMemoryCache, split, from, DocumentNode, OperationVariables } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

let uri: string;
let sign: Signature | null;
export const getUploadLink = (connectUri?: string, signiture?: Signature) => {
  const token = typeof window !== "undefined" && localStorage.getItem("currentUser");
  uri = connectUri ?? uri ?? "http://localhost:8080/graphql";
  sign = signiture ?? null;
  return createUploadLink({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      ...(sign ?? {}),
    },
    uri,
  });
};

const client = new ApolloClient({
  link: getUploadLink(),
  cache: new InMemoryCache(),
});
export interface Signature {
  signchain: "metamask" | "kaikas";
  signmessage: string;
  signaddress: string | string[];
}
export const setLink = (uri?: string) => client.setLink(getUploadLink(uri));
export const setSignature = async (signature: Signature) => {
  const token = typeof window !== "undefined" && localStorage.getItem("currentUser");
  sign = signature;
  return client.setLink(
    createUploadLink({
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
        ...(sign ?? {}),
      },
      uri,
    })
  );
};
export const setToken = async (token: string) => {
  return client.setLink(
    createUploadLink({
      headers: {
        authorization: `Bearer ${token}`,
        ...(sign ?? {}),
      },
      uri,
    })
  );
};
// export const setSignature = async (signature:Signature) => {
//   const link = client.link;
//   link
//   return client.setLink(
//     createUploadLink({
//       headers: {
//         ,
//       },
//       uri,
//     })
//   );
// };
export const mutate = async <Mutation>(mutation: DocumentNode, variables?: OperationVariables) => {
  const data = (await client.mutate<Mutation>({ mutation, variables })).data;
  if (!data) throw new Error(`Mutation Failed: ${mutation}`);
  return data;
};
export const query = async <Query>(query: DocumentNode, variables?: OperationVariables) => {
  const data = (await client.query<Query>({ query, variables, fetchPolicy: "network-only" })).data;
  if (!data) throw new Error(`Mutation Failed: ${query}`);
  return data;
};

export default client;
