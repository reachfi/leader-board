import * as etl from "./etl";

//TODO expose via web service, rest api?
const owner = "lucidhq";
const repo = "rx-ui"; //rx-ui, fulcrum-next, audience-ui, ui-tools, las-ui, lucidium, portfolio-ui, lucid-ui-reference-app, Leverage, snapshot-ui, nextjs-lucidium-starter
const team = "ui";
// etl.etlAll(owner, repo, team);
// etl.etaLatest(owner, repo, team);

export { etl };
