import { Octokit } from "octokit";
import { QUERY_PRS } from "../operations";
let { GH_TOKEN } = process.env;
let octokit = new Octokit({
  auth: GH_TOKEN,
});

export async function retrievePrs(options, nodes = []) {
  try {
    const data = await octokit.graphql(QUERY_PRS, options);
    console.log({ data });
    const prs = data.repository.pullRequests;
    if (prs.nodes.length < 1) return { nodes, after };
    nodes = [...nodes, ...prs.nodes];
    const lastPr = prs.pageInfo.endCursor;
    console.log(nodes.length);
    if (nodes.length === prs.totalCount) return { nodes, lastPr };
    return await retrievePrs({ ...options, after: lastPr }, nodes);
  } catch (error) {
    console.log(error);
  }
}
