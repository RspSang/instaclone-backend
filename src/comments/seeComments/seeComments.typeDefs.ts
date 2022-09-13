import { gql } from "apollo-server-express";

export default gql`
  type SeeCommentsResult {
    ok: Boolean!
    error: String!
    comments: [Comment]
  }
  type Query {
    seeComments(id: Int!, offset: Int): SeeCommentsResult!
  }
`;
