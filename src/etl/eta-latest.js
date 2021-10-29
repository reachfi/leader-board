import { retrievePrs } from "../sources/github";

export async function etaLatest(owner, repo, team) {
  let options = {
    owner,
    repo,
    pageSize: 100,
  };
  try {
    console.info("retrieving records...");
    options.after = ""; //todo
    const { nodes, lastPr } = await retrievePrs(options);
    console.info(`retrieved ${nodes.length} records`);
  } catch (error) {
    console.log(error);
  }
}
