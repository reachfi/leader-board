import { retrievePrs } from "../sources/github";
import { recordIngestion } from "./record-ingestion";
import { insertPrs } from "./insert-prs";

export async function etlAll(owner, repo, team) {
  let options = {
    owner,
    repo,
    pageSize: 100,
  };
  try {
    console.info("retrieving records...");
    const { nodes, lastPr } = await retrievePrs(options);
    console.info(`retrieved ${nodes.length} records`);

    const { insert_pull_requests } = await insertPrs(nodes, owner, repo, team);

    // store time/value metrics
    if (insert_pull_requests.affected_rows > 0) {
      await recordIngestion(lastPr, team, owner, repo);
    } else {
      console.log("0 rows were affected");
    }
  } catch (e) {
    console.log(e);
  }
}
