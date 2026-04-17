const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create admin user
    const adminHash = await bcrypt.hash('admin1234', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ecoswap.com' },
        update: {},
        create: {
            email: 'admin@ecoswap.com',
            passwordHash: adminHash,
            name: 'Admin',
            city: 'Paris',
            isAdmin: true
        }
    });

    // Create two test users
    const userHash = await bcrypt.hash('password123', 10);

    const alice = await prisma.user.upsert({
        where: { email: 'alice@test.com' },
        update: {},
        create: {
            email: 'alice@test.com',
            passwordHash: userHash,
            name: 'Alice Dupont',
            city: 'Paris',
            bio: 'Eco-friendly student'
        }
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@test.com' },
        update: {},
        create: {
            email: 'bob@test.com',
            passwordHash: userHash,
            name: 'Bob Martin',
            city: 'Lyon',
            bio: 'Book collector'
        }
    });

    // Create sample items
    const items = [
        { ownerId: alice.id, title: 'Python Programming Book', description: 'Clean Code in Python, barely used', category: 'books', condition: 'like_new' },
        { ownerId: alice.id, title: 'Desk Lamp', description: 'LED desk lamp, works perfectly', category: 'electronics', condition: 'good' },
        { ownerId: bob.id, title: 'Running Shoes', description: 'Nike size 42, used twice', category: 'sports', condition: 'like_new' },
        { ownerId: bob.id, title: 'Winter Jacket', description: 'Warm jacket, size M', category: 'clothing', condition: 'good' },
    ];

    for (const item of items) {
        await prisma.item.create({ data: item });
    }

    console.log(`Seeded: ${3} users, ${items.length} items`);
    console.log('Admin login: admin@ecoswap.com / admin1234');
    console.log('User login:  alice@test.com / password123');
    console.log('User login:  bob@test.com / password123');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
