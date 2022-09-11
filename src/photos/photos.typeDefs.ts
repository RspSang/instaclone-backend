import { gql } from "apollo-server-express";

export default gql`
  type Photo {
    id: Int!
    user: User
    file: String!
    caption: String
    hashtags: [Hashtag]
    createdAt: String!
    updatedAt: String!
    likes: Int!
    commentNumber: Int!
    comments: [Comment]
    isMine: Boolean!
    isLiked: Boolean!
  }
  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
