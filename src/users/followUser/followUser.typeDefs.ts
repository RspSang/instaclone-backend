import { gql } from "apollo-server-express";

export default gql`
  type FollowUserResult {
    ok: Boolean!
    error: String
    user: User
  }
  type Mutation {
    followUser(username: String!): FollowUserResult
  }
`;
