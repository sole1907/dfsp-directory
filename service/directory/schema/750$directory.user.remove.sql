CREATE OR REPLACE FUNCTION directory."user.remove"(
  "@actorId" integer
) RETURNS TABLE(
  "actorId" integer,
  "identifiers" json,
  "isSingleResult" boolean
)
AS
$body$
  WITH a as (
    DELETE FROM directory.user
    WHERE "actorId" = "@actorId"
    RETURNING *
  ),
  di as (
    DELETE FROM directory.identifier
    WHERE "actorId" = "@actorId"
    RETURNING *
  )
  SELECT
    a."actorId",
    (
      SELECT array_to_json(array_agg(identifiers))
      FROM (
          SELECT
              di."identifier",
              di."identifierTypeCode"
            FROM
              di
          WHERE
              di."actorId" = "@actorId"
          ) identifiers
        ) as "identifiers",
    true AS "isSingleResult"
  FROM a
$body$
LANGUAGE SQL