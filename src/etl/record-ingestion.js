import { INSERT_AUDIT } from "../operations";
import { fetchGraphQL } from "../utils";

export async function recordIngestion(lastPr, team, owner, repo) {
  const { errors, data } = await fetchGraphQL(INSERT_AUDIT, "MyMutation", {
    object: {
      organization: owner,
      id: lastPr,
      repo: repo,
      team: team,
      updated_at: new Date(),
    },
  });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  return data;
}
