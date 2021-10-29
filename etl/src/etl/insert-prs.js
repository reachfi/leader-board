import { INSERT_PRS } from "../operations";
import { fetchGraphQL } from "../utils";

function formatDate(date) {
  if (date === undefined && date === "") return undefined;
  const newDateTime = new Date(date);
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

export async function insertPrs(nodes, owner, repo, team) {
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
  return data;
}
