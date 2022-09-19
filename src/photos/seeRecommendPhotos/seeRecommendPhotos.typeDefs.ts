import { gql } from "apollo-server-core";

export default gql`
  type SeeRecommendPhotosResult {
    ok: Boolean!
    error: String
    photos: [Photo]
  }

  type Query {
    seeRecommendPhotos: SeeRecommendPhotosResult!
  }
`;