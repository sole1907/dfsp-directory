CREATE OR REPLACE FUNCTION directory."user.fetch"(
    "@actorId" int[]
)
RETURNS TABLE(
    "firstName" varchar(255),
    "lastName" varchar(255),
    "actorId" int,
    "dob" VARCHAR,
    "nationalId" varchar(255),
    "identifiers" json
) AS
$BODY$
    SELECT
        u."firstName",
        u."lastName",
        u."actorId",
        CAST (u."dob" as VARCHAR),
        u."nationalId",
        (
            SELECT array_to_json(array_agg(identifiers))
            FROM (
                SELECT
                    i."identifier", i."identifierTypeCode"
                 FROM
                    directory."identifier" i
                WHERE
                    i."actorId" = u."actorId"
                ) identifiers
        ) as "identifiers"
    FROM
        directory.user as u
    WHERE
        "actorId" IN (SELECT UNNEST("@actorId"))
$BODY$
LANGUAGE SQL
