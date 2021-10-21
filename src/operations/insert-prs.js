export const INSERT_PRS = `
  mutation MyQuery($objects: [pull_requests_insert_input!]!) {
    insert_pull_requests(objects: $objects){
      affected_rows
    }
  }
`;
