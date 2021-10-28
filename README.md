## Requirements
- Docker
- Hasura CLI brew install hasura-cli
## Start
docker compose up -d

## DB Incremental Backup
https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup.html#migrations-setup
    
    cd timedb
    hasura migrate create "init" --from-server --admin-secret mylongsecretkey --database-name default

INFO Migrations files created                      name=init version=1634845377643

    hasura migrate apply --version 1634845377643 --skip-execution --admin-secret mylongsecretkey --database-name default

hasura metadata export --admin-secret mylongsecretkey 


## QUERY Examples

{
  weekly_repos_prs_stats(where: {repo: {_eq: "fulcrum-next"}}) {
    prs
    week
    repo
  }
}
