export const INSERT_AUDIT = `
  mutation MyMutation($object: audit_insert_input!) {
    insert_audit_one(object: $object) {
      updated_at
    }
  }
`;
