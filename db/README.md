## Requirements
- Docker
- Hasura CLI brew install hasura-cli


if M1 chip mac 
  image: fedormelexin/graphql-engine-arm64
otherwise
  image: hasura/graphql-engine:latest
## Start
docker compose up -d

## QUERY Examples

{
  weekly_repos_prs_stats(where: {repo: {_eq: "fulcrum-next"}}) {
    prs
    week
    repo
  }
}

## DB Incremental Backup
https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup.html#migrations-setup
cd timedb
hasura migrate create "init" --from-server --admin-secret mylongsecretkey --database-name default
--
INFO Migrations files created                      name=init version=1634845377643
INFO Migrations files created                      name=init version=1635449427110

--
hasura migrate apply --version 1635449427110 --skip-execution --admin-secret mylongsecretkey --database-name default
hasura metadata export --admin-secret mylongsecretkey 


RESTORE

hasura migrate apply --version 1635449427110 --admin-secret mylongsecretkey --database-name default
hasura metadata apply --admin-secret mylongsecretkey


## auto aplly migration and metadata
docker-compose
  image: fedormelexin/graphql-engine-arm64:v2.0.10.cli-migrations-v3
  volumes:
      - $PWD/timedb/migrations:/hasura-migrations
      - $PWD/timedb/metadata:/hasura-metadata

note: how to select WHICH one to apply?

## troubleshooting
docker-compose stop
docker-compose rm
docker volyme rm leader-board_db_data

### after migrating using hasura cli


rm insert blocker on modify screen for table

ref
- https://github.com/timescale/timescaledb/issues/1381
- https://docs.timescale.com/timescaledb/latest/how-to-guides/backup-and-restore/#pg_dump-pg_restore