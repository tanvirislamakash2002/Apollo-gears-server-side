import bcrypt from 'bcrypt';
import { prisma } from '../../src/lib/prisma';

async function main() {
  const email = 'admin@gmail.com';
  const password = 'admin123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists:', existing.id);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', user.id);
}

main()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
