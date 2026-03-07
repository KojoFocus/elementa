import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ── Demo student user ──────────────────────────────────────
  const student = await prisma.user.upsert({
    where: { email: 'student@elementa.app' },
    update: {},
    create: {
      email: 'student@elementa.app',
      name: 'Demo Student',
      role: 'STUDENT',
      school: 'Accra Academy',
    },
  });
  console.log(`User: ${student.name} (${student.email})`);

  // ── Acid-Base experiment ───────────────────────────────────
  const experiment = await prisma.experiment.upsert({
    where: { slug: 'acid-base-indicators' },
    update: {},
    create: {
      slug: 'acid-base-indicators',
      title: 'Acid-Base Indicator Testing',
      subject: 'CHEMISTRY',
      description:
        'Test household substances using universal indicator and litmus paper to determine their pH. Observe dramatic colour changes and relate them to the pH scale.',
      difficulty: 'BEGINNER',
      isPublished: true,
    },
  });
  console.log(`Experiment: ${experiment.title} (${experiment.slug})`);

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
