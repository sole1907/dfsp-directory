CREATE TABLE directory.identifier(
  "identifierId" SERIAL,
  "identifier" VARCHAR(256),
  "actorId" INTEGER,
  "identifierTypeCode" VARCHAR(3),
  CONSTRAINT "pkDirectoryIdentifier" PRIMARY KEY ("identifierId"),
  CONSTRAINT "fkDirectoryIdentifier_directoryUser" FOREIGN KEY ("actorId") REFERENCES directory."user"("actorId"),
  CONSTRAINT "fkDirectoryIdentifier_directoryIdentifierType" FOREIGN KEY ("identifierTypeCode") REFERENCES directory."identifierType"("code"),
  CONSTRAINT "ukDirectoryIdentifierIdentifier_IdentifierTypeCode" UNIQUE ("identifier", "identifierTypeCode")
)
