CREATE TABLE directory.user(
  "actorId" SERIAL NOT NULL,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "dob" DATE,
  "nationalId" VARCHAR(255),
  CONSTRAINT pkDirectoryUser PRIMARY KEY ("actorId")
)
