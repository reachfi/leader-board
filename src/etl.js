import { Octokit } from "octokit";
import { QUERY_PRS, INSERT_PRS, INSERT_AUDIT } from "./operations";
import { fetchGraphQL } from "./utils";
let { GH_TOKEN } = process.env;
let octokit = new Octokit({
  auth: GH_TOKEN,
});

async function recordIngestion(lastPr, team, owner, repo) {
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
  console.log(data);
}

async function retrievePrs(options, nodes = []) {
  const data = await octokit.graphql(QUERY_PRS, options);
  const prs = data.repository.pullRequests;
  if (prs.nodes.length < 1) return { nodes, after };
  nodes = [...nodes, ...prs.nodes];
  const lastPr = prs.pageInfo.endCursor;
  console.log(nodes.length);
  if (nodes.length === prs.totalCount) return { nodes, lastPr };
  return await retrievePrs({ ...options, after: lastPr }, nodes);
}

function formatDate(date) {
  if (date === undefined && date === "") return undefined;
  const newDateTime = new Date(date);
  console.log(newDateTime);
  return newDateTime;
}

function getPrType(text) {
  const COMMIT_TYPES = {
    FEAT: "feat",
    FIX: "fix",
    DOCS: "docs",
    STYLE: "style",
    REFACTOR: "refactor",
    TEST: "test",
    PERF: "perf",
    CHORE: "chore",
  };
  switch (true) {
    case text.includes(COMMIT_TYPES.FEAT):
      return COMMIT_TYPES.FEAT;
    case text.includes(COMMIT_TYPES.FIX):
      return COMMIT_TYPES.FIX;
    case text.includes(COMMIT_TYPES.DOCS):
      return COMMIT_TYPES.DOCS;
    case text.includes(COMMIT_TYPES.STYLE):
      return COMMIT_TYPES.STYLE;
    case text.includes(COMMIT_TYPES.REFACTOR):
      return COMMIT_TYPES.REFACTOR;
    case text.includes(COMMIT_TYPES.TEST):
      return COMMIT_TYPES.TEST;
    case text.includes(COMMIT_TYPES.PERF):
      return COMMIT_TYPES.PERF;
    case text.includes(COMMIT_TYPES.CHORE):
      return COMMIT_TYPES.CHORE;
    default:
      return "unknown";
  }
}

async function loadAllPrs(nodes, owner, repo, team) {
  const objects = nodes.map((n) => ({
    id: n.id,
    author: n.author.login,
    closed_at: formatDate(n.closedAt),
    created_at: formatDate(n.createdAt),
    merged_at: formatDate(n.mergedAt),
    headrefname: n.headRefName,
    pr_number: n.number,
    state: n.state,
    title: n.title,
    pr_type: getPrType(n.title),
    organization: owner,
    repo: repo,
    team: team,
  }));
  const { errors, data } = await fetchGraphQL(INSERT_PRS, "MyQuery", {
    objects: objects,
  });

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

export async function ingestAll(owner, repo) {
  let options = {
    owner,
    repo,
    pageSize: 100,
  };
  try {
    const { nodes, lastPr } = await retrievePrs(options);
    // store lastPR in our records for this owner/project
    // store time/value metrics
    // store rest of the data
  } catch (e) {
    console.log(e);
  }
}

export async function etlAll(owner, repo, team) {
  let options = {
    owner,
    repo,
    pageSize: 100,
  };
  try {
    console.log("retrieving....");
    const { nodes, lastPr } = await retrievePrs(options);
    console.log({ lastPr });
    console.log(nodes.length);
    // store time/value metrics
    await loadAllPrs(nodes, owner, repo, team);
    // TODO: if success,,,then
    await recordIngestion(lastPr, team, owner, repo);
  } catch (e) {
    console.log(e);
  }
}
