# DFSP-Directory service

## Summary ##

This service is used to store and manipulate all the data related to the users in the DFSP. When a new user is registered thru the USSD menu it is registered in this service in order all other dfsp-services to be able to refer to him. The data is distributed in the following tables: identifier, identifierType and user.

### For each user are stored the following fields: 
    - His actor ID in the system - actorId;
    - First name - firstName;
    - Last name - lastName;
    - Date of birth- dob;
    - National ID - nationalId;

### For each record in identifier table are stored the following fields:
    - Identifier id - identifierId;
    - Identifier itself - identifier;
    - Actor ID - actorId, which is reference to the user table by actorId;
    - Identifier type code - identifierTypeCode, which is reference to the identifierType table by code;

In the identifierType table are stored all the identifier types, which for the current moment are 'eur' and 'phn'. Each record here has unique code with provided name and description.

## DFSP-directory supported methods ##
    - user add - add new record with user;
    - user fetch - fetch users by some criteria, this may return more than one result;
    - user get - return one particular user details by given unique combination of (identifier & identifierType) or by given actorId which is also unique per each dfsp.
