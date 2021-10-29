export const QUERY_LATEST_AUDIT = `query latestAuditByRepoOrg($organization: String!, $repo: String!, $team: String!) {
  audit(where: {repo: {_eq: $repo}, organization: {_eq: $organization}, team: {_eq: $team}}, limit: 1, order_by: {updated_at: desc}) {
    id
  }
}`;
