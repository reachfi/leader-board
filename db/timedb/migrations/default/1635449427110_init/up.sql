SET check_function_bodies = false;
CREATE TABLE public.pull_requests (
    created_at timestamp with time zone NOT NULL,
    closed_at timestamp with time zone,
    merged_at timestamp with time zone NOT NULL,
    pr_number integer NOT NULL,
    id text NOT NULL,
    headrefname text,
    state text NOT NULL,
    title text,
    author text,
    organization text NOT NULL,
    repo text NOT NULL,
    team text,
    pr_type text
);
CREATE TABLE public.audit (
    id text NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    repo text NOT NULL,
    organization text NOT NULL,
    team text NOT NULL
);
CREATE TABLE public.contributors (
    id text NOT NULL,
    name text NOT NULL,
    organization_id text NOT NULL
);
CREATE TABLE public.organizations (
    id text NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.repos (
    id text NOT NULL,
    name text NOT NULL,
    organization text NOT NULL
);
CREATE VIEW public.weekly_prs_by_org_team AS
 SELECT prs.week,
    jsonb_agg((((to_jsonb(prs.*) - 'week'::text) - 'team'::text) - 'organization'::text)) AS pr_types,
    prs.team,
    prs.organization
   FROM ( SELECT public.time_bucket('7 days'::interval, pull_requests.merged_at) AS week,
            pull_requests.pr_type,
            pull_requests.team,
            pull_requests.organization,
            count(*) AS count
           FROM public.pull_requests
          WHERE ((pull_requests.merged_at < now()) AND (pull_requests.merged_at >= '1990-01-01 00:00:00+00'::timestamp with time zone))
          GROUP BY pull_requests.team, pull_requests.pr_type, pull_requests.organization, (public.time_bucket('7 days'::interval, pull_requests.merged_at))
          ORDER BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)) DESC) prs
  GROUP BY prs.week, prs.team, prs.organization;
CREATE VIEW public.weekly_prs_stats AS
 SELECT public.time_bucket('7 days'::interval, pull_requests.merged_at) AS week,
    count(*) AS prs,
    pull_requests.organization
   FROM public.pull_requests
  WHERE ((pull_requests.merged_at < now()) AND (pull_requests.merged_at >= '1990-01-01 00:00:00+00'::timestamp with time zone))
  GROUP BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)), pull_requests.organization
  ORDER BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)) DESC;
CREATE VIEW public.weekly_repos_prs_stats AS
 SELECT public.time_bucket('7 days'::interval, pull_requests.merged_at) AS week,
    pull_requests.repo,
    count(*) AS prs,
    pull_requests.organization
   FROM public.pull_requests
  WHERE ((pull_requests.merged_at < now()) AND (pull_requests.merged_at >= '1990-01-01 00:00:00+00'::timestamp with time zone))
  GROUP BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)), pull_requests.repo, pull_requests.organization
  ORDER BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)) DESC;
CREATE VIEW public.weekly_teams_prs_stats AS
 SELECT public.time_bucket('7 days'::interval, pull_requests.merged_at) AS week,
    pull_requests.team,
    count(*) AS prs,
    pull_requests.organization
   FROM public.pull_requests
  WHERE ((pull_requests.merged_at < now()) AND (pull_requests.merged_at >= '1990-01-01 00:00:00+00'::timestamp with time zone))
  GROUP BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)), pull_requests.organization, pull_requests.team
  ORDER BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)) DESC;
CREATE VIEW public.weekly_teams_prs_type_stats AS
 SELECT public.time_bucket('7 days'::interval, pull_requests.merged_at) AS week,
    pull_requests.pr_type,
    pull_requests.team,
    count(*) AS prs,
    pull_requests.organization
   FROM public.pull_requests
  WHERE ((pull_requests.merged_at < now()) AND (pull_requests.merged_at >= '1990-01-01 00:00:00+00'::timestamp with time zone))
  GROUP BY pull_requests.team, pull_requests.pr_type, (public.time_bucket('7 days'::interval, pull_requests.merged_at)), pull_requests.organization
  ORDER BY (public.time_bucket('7 days'::interval, pull_requests.merged_at)) DESC;
ALTER TABLE ONLY public.audit
    ADD CONSTRAINT audit_id_key UNIQUE (id);
ALTER TABLE ONLY public.contributors
    ADD CONSTRAINT contributors_id_key UNIQUE (id);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_id_key UNIQUE (id);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_name_key UNIQUE (name);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id, name);
ALTER TABLE ONLY public.pull_requests
    ADD CONSTRAINT pull_requests_pkey PRIMARY KEY (id, merged_at);
ALTER TABLE ONLY public.repos
    ADD CONSTRAINT repos_id_key UNIQUE (id);
ALTER TABLE ONLY public.repos
    ADD CONSTRAINT repos_pkey PRIMARY KEY (id);
CREATE INDEX pull_requests_merged_at_idx ON public.pull_requests USING btree (merged_at DESC);
CREATE TRIGGER ts_insert_blocker BEFORE INSERT ON public.pull_requests FOR EACH ROW EXECUTE FUNCTION _timescaledb_internal.insert_blocker();
