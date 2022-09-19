import { gql } from "apollo-server-core";

export default gql`
  type SeeRecommendUsersResult {
    ok: Boolean!
    error: String
    users: [User]
  }

  type Query {
    seeRecommendUsers: SeeRecommendUsersResult!
  }
`;
