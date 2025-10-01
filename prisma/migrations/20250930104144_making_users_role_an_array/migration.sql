-- Step 1: Drop the old default value. This is crucial for the shadow database.
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- Step 2: Change the column type, using the USING clause to convert existing data.
-- This will convert 'APPLICANT' to ['APPLICANT'].
ALTER TABLE "User" ALTER COLUMN "role" SET DATA TYPE "UserRoleEnum"[] USING ARRAY["role"];

-- Step 3: Set the new default value for the array type.
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ARRAY['APPLICANT']::"UserRoleEnum"[];