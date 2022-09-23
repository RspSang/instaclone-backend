import { gql } from "apollo-server-core";

export default gql`
  type Hashtag {
    id: Int!
    hashtag: String!
    photos: [Photo]
    totalPhotos: Int
    createdAt: String!
    updatedAt: String!
  }
`;
