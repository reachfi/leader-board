import { Octokit } from "octokit";
import { QUERY_PRS } from "../operations";
let { GH_TOKEN } = process.env;
let octokit = new Octokit({
  auth: GH_TOKEN,
});

export async function retrievePrs(options, nodes = []) {
  try {
    const data = await octokit.graphql(QUERY_PRS, options);
    const prs = data.repository.pullRequests;
    if (prs.nodes.length < 1) return { nodes, after: options.after };

    nodes = [...nodes, ...prs.nodes];
    const lastPr = prs.pageInfo.endCursor;
    if (nodes.length === prs.totalCount) return { nodes, lastPr };
    return await retrievePrs({ ...options, after: lastPr }, nodes);
  } catch (error) {
    console.error(error);
  }
}
