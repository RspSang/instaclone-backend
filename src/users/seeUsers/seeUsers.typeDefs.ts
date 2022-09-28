import { gql } from "apollo-server-core";

export default gql`
  type SeeUsersResult {
    ok: Boolean!
    error: String
    users: [User]
  }

  type Query {
    seeUsers: SeeUsersResult!
  }
`;
