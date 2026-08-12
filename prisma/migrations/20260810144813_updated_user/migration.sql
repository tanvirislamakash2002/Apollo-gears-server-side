-- DropForeignKey
ALTER TABLE "bids" DROP CONSTRAINT "bids_driverId_fkey";

-- DropForeignKey
ALTER TABLE "bids" DROP CONSTRAINT "bids_rentId_fkey";

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "rents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
