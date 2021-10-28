cd timedb
hasura migrate create "init" --from-server --admin-secret mylongsecretkey --database-name default

INFO Migrations files created                      name=init version=1634845377643
INFO Migrations files created                      name=init version=1635449427110

hasura migrate apply --version 1635449427110 --skip-execution --admin-secret mylongsecretkey --database-name default

hasura metadata export --admin-secret mylongsecretkey 