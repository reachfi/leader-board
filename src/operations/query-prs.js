export const QUERY_PRS = `
  query prs($owner: String!, $repo: String!, $pageSize: Int, $after: String) {          
    repository(name: $repo, owner: $owner) {
      pullRequests(first: $pageSize, after: $after) {
        totalCount
        pageInfo {
          endCursor
          startCursor
        }
        nodes {
          id
          number
          createdAt
          closedAt
          mergedAt
          headRefName
          state
          title
          author {
            login
          }
          changedFiles
          # files(first: 100) {
          #   nodes {
          #     path
          #   }
          # }
        }
      }
    }          
  }
`;
