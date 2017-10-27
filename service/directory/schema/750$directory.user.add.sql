CREATE OR REPLACE FUNCTION directory."user.add"(
    "@identifier" VARCHAR(256),
    "@identifierTypeCode" VARCHAR(3),
    "@firstName" VARCHAR(255),
    "@lastName" VARCHAR(255),
    "@dob" DATE,
    "@nationalId" VARCHAR(255)
)
RETURNS TABLE(
    "actorId" INTEGER,
    "identifier" VARCHAR(20),
    "identifierTypeCode" VARCHAR(3),
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "dob" VARCHAR,
    "nationalId" VARCHAR(255),
    "isSingleResult" BOOLEAN
) AS
$BODY$
DECLARE
	"@actorId" INTEGER;
BEGIN
    IF EXISTS (SELECT 1 FROM directory.identifier di WHERE di."identifier" = "@identifier" and di."identifierTypeCode" = "@identifierTypeCode") THEN
        RAISE EXCEPTION 'directory.notUniqueCombinationIdentifierTypeCodeIdentifier';
    END IF;
    WITH u as (
        INSERT INTO directory.user ("firstName", "lastName", "dob", "nationalId")
        VALUES ("@firstName", "@lastName", "@dob", "@nationalId")
        RETURNING *
    ),
    i as (
        INSERT INTO directory.identifier ("identifier", "actorId", "identifierTypeCode")
        VALUES (
                "@identifier", 
                (
                    SELECT 
                        u."actorId" 
                    FROM 
                        u
                ), 
                "@identifierTypeCode")
        RETURNING *
    )
    SELECT
        u."actorId"
    INTO
        "@actorId"
    FROM u;

RETURN QUERY
    SELECT
        "@actorId" as "actorId",
        "@identifier" as "identifier",
        "@identifierTypeCode" as "identifierTypeCode",
        "@firstName" as "firstName",
        "@lastName" as "lastName",
        CAST("@dob" as VARCHAR) as "dob",
        "@nationalId" as "nationalId",
        true AS "isSingleResult";
END;
$BODY$
LANGUAGE plpgsql;
