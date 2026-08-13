import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { RefreshResponse } from '../../types/types';
export const REFRESH_QUERY: TypedDocumentNode<RefreshResponse> = gql`
  query RefreshEndpoint {
    refreshEndpoint {
      accessToken
      profile_image_path
      role
    }
  }
`;
