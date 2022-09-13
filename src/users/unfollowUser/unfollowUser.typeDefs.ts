import { gql } from "apollo-server-express";

export default gql`
  type UnfollowUserResult {
    ok: Boolean!
    error: String
    user: User
  }
  type Mutation {
    unfollowUser(username: String!): UnfollowUserResult
  }
`;
