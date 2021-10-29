-- CREATE TABLE organizations (
--     id   TEXT NOT NULL UNIQUE,
--     name TEXT NOT NULL UNIQUE
-- );

-- CREATE TABLE repos (
--     id   TEXT NOT NULL UNIQUE,
--     name TEXT NOT NULL,
--     organization_id  TEXT NOT NULL
-- );

-- CREATE TABLE contributors (
--     id   TEXT NOT NULL UNIQUE,
--     name TEXT NOT NULL,
--     organization_id  TEXT NOT NULL
-- )


-- CREATE TABLE pull_requests (
--   created_at   TIMESTAMPTZ       NOT NULL,  
--   closed_at    TIMESTAMPTZ       NULL,  
--   merged_at    TIMESTAMPTZ       NULL,  
--   pr_number    INTEGER           NOT NULL,  
--   id           TEXT              NOT NULL,
--   headRefName  TEXT              NULL,
--   state        TEXT              NOT NULL,
--   title        TEXT              NULL,          
--   author       TEXT              NULL,      
--   organization TEXT              NOT NULL,
--   repo         TEXT              NOT NULL
--   team         TEXT              NULL
-- 	 pr_type		  TEXT              NULL
-- );

-- ALTER TABLE pull_requests ADD PRIMARY KEY (id, merged_at);
-- TRUNCATE TABLE pull_requests;
-- SELECT create_hypertable('pull_requests', 'merged_at');

CREATE TABLE audit (
	id TEXT NOT NULL UNIQUE,
	updated_at TIMESTAMPTZ NOT NULL,
	repo TEXT NOT NULL,
	organization TEXT NOT NULL,
	team TEXT NOT NULL
  last_pr TEXT NOT NULL UNIQUE
) 


SELECT time_bucket('1 week', merged_at) AS week,
COUNT(*) as PRS FROM pull_requests    
WHERE merged_at < NOW() AND merged_at >= '1990-01-01'
GROUP BY week
ORDER BY week DESC;


CREATE VIEW weekly_prs_stats AS (
 SELECT time_bucket('1 week', merged_at) AS week,
 COUNT(*) as PRS FROM pull_requests    
 WHERE merged_at < NOW() AND merged_at >= '1990-01-01'
 GROUP BY week
 ORDER BY week DESC
);

SELECT time_bucket('1 week', merged_at) AS week, team,
COUNT(*) as PRS FROM pull_requests    
WHERE merged_at < NOW() AND merged_at >= '1990-01-01'
GROUP BY week, team
ORDER BY week DESC;


CREATE VIEW weekly_teams_prs_stats AS (
 SELECT time_bucket('1 week', merged_at) AS week, team,
 COUNT(*) as PRS FROM pull_requests    
 WHERE merged_at < NOW() AND merged_at >= '1990-01-01'
 GROUP BY week, team
 ORDER BY week DESC
);

CREATE VIEW weekly_teams_prs_type_stats AS (
  SELECT time_bucket('1 week', merged_at) AS week, pr_type , team,
  COUNT(*) as PRS FROM pull_requests    
  WHERE merged_at < NOW() AND merged_at >= '1990-01-01'
  GROUP BY team, pr_type, week
  ORDER BY week DESC
);





