DO
$do$
BEGIN
    INSERT INTO
        directory."identifierType" ("code", "name", "description")
    VALUES
        ('eur', 'User number', 'User number'),
        ('tel', 'Phone number', 'Phone number')
    ON CONFLICT ("code") DO UPDATE SET "name" = EXCLUDED.name, "description" = EXCLUDED.description;

    IF NOT EXISTS (SELECT 1 FROM directory.identifier WHERE "identifier" = '00359######') THEN
        WITH u as (
            INSERT INTO directory.user ("firstName", "lastName", "dob", "nationalId")
            VALUES ('Test', 'Test', '10/12/1999', '123654789')
            RETURNING *
        )
        INSERT INTO directory.identifier ("identifier", "actorId", "identifierTypeCode")
        VALUES (
            '00359######', 
            (SELECT u."actorId" FROM u), 
            'eur'
        );
    END IF;
END
$do$
LANGUAGE plpgsql
