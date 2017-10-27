CREATE OR REPLACE FUNCTION directory."user.get"(
    "@identifier" VARCHAR(256),
    "@identifierTypeCode" VARCHAR(3),
    "@actorId" int
)
RETURNS TABLE(
    "firstName" varchar(255),
    "lastName" varchar(255),
    "actorId" int,
    "dob" VARCHAR,
    "nationalId" varchar(255),
    "identifiers" json,
    "isSingleResult" boolean
) AS
$BODY$
BEGIN
    IF "@actorId" IS NULL AND "@identifier" IS NULL THEN
        RAISE EXCEPTION 'directory.missingArguments';
    END IF;
    IF "@identifierTypeCode" IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM directory."identifierType" AS dit WHERE dit."code" = "@identifierTypeCode") THEN
            RAISE EXCEPTION 'directory.identifierTypeCodeNotFound';
        END IF;
     END IF;

RETURN QUERY
    SELECT
        u."firstName",
        u."lastName",
        u."actorId",
        CAST (u."dob" as VARCHAR),
        u."nationalId",
        (
            SELECT array_to_json(array_agg(x))
            FROM (
                SELECT
                    i."identifier", i."identifierTypeCode"
                 FROM
                    directory."identifier" i
                WHERE
                    i."actorId" = u."actorId"
                ) x
        ) as "identifiers",
        true AS "isSingleResult"
    FROM
        directory.user u
    JOIN
        directory.identifier di ON di."actorId" = u."actorId"
    WHERE
        di."identifier" = "@identifier" AND ("@identifierTypeCode" IS NULL OR di."identifierTypeCode" = "@identifierTypeCode") OR u."actorId" = "@actorId"
    GROUP BY
        u."actorId"
    LIMIT 1;
END;
$BODY$
LANGUAGE plpgsql
