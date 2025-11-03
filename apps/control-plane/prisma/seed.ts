import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const launchpads = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Alpha Launch",
    chain: "EVM",
    startTime: new Date("2026-01-01T00:00:00Z"),
    endTime: new Date("2026-01-15T00:00:00Z"),
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Beta Launch",
    chain: "EVM",
    startTime: new Date("2026-02-01T12:00:00Z"),
    endTime: new Date("2026-02-20T12:00:00Z"),
  },
];

async function main() {
  for (const launchpad of launchpads) {
    await prisma.launchpad.upsert({
      where: { id: launchpad.id },
      update: {
        name: launchpad.name,
        chain: launchpad.chain,
        startTime: launchpad.startTime,
        endTime: launchpad.endTime,
      },
      create: launchpad,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed database", error);
    await prisma.$disconnect();
    process.exit(1);
  });
