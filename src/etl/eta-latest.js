import { retrievePrs } from "../sources/github";
import { fetchGraphQL } from "../utils";
import { QUERY_LATEST_AUDIT } from "../operations/query-audit";
import { insertPrs } from "./insert-prs";
import { recordIngestion } from "./record-ingestion";

async function getLatestCursor(organization, repo, team) {
  const { errors, data } = await fetchGraphQL(
    QUERY_LATEST_AUDIT,
    "latestAuditByRepoOrg",
    {
      organization,
      repo,
      team,
    }
  );

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  //TODO check for empty?
  return data.audit[0].id;
}

export async function etaLatest(owner, repo, team) {
  try {
    console.debug("retrieve latest cursor");
    const latestAudit = await getLatestCursor(owner, repo, team);
    console.debug("retrieving records...");
    let options = {
      owner,
      repo,
      pageSize: 100,
      after: latestAudit,
    };
    const { nodes, after } = await retrievePrs(options);
    console.debug(
      `retrieved ${nodes.length} records, lastPR cursor is ${after}`
    );
    if (nodes.length < 1)
      return {
        status: 200, // or 204? no content
        msg: "No records found",
      };

    const { insert_pull_requests } = await insertPrs(nodes, owner, repo, team);
    // store time/value metrics
    if (insert_pull_requests.affected_rows > 0) {
      await recordIngestion(lastPr, team, owner, repo);
      return {
        status: 200, // or 204? no content
        msg: `${insert_pull_requests.affected_rows} records were inserted`,
      };
    } else {
      return {
        status: 200,
        msg: "No records were inserted",
      };
    }
  } catch (error) {
    console.error(error);
  }
}
