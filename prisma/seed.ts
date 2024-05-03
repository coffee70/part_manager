const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const ORDER_COUNT = 10;
const STATUS_COUNT = 4;
const CUSTOMER_COUNT = 2;
const PART_COUNT = 5;

async function main() {
    /**
     * Remove everything from the database
     */
    await prisma.order.deleteMany();
    await prisma.part.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.status.deleteMany();

    /**
     * Seed the database with some data
     */
    for (let i = 0; i < STATUS_COUNT; i++) {
        await prisma.status.create({
            data: {
                label: faker.word.adjective(),
                color: faker.internet.color(),
            }
        });
    }
    for (let i = 0; i < CUSTOMER_COUNT; i++) {
        await prisma.customer.create({
            data: {
                name: faker.company.name(),
            }
        })
    }
    for (let i = 0; i < ORDER_COUNT; i++) {
        await prisma.order.create({
            data: {
                number: `O-${faker.number.int()}`,
                statusId: Math.floor(Math.random() * STATUS_COUNT) + 1,
                customerId: Math.floor(Math.random() * CUSTOMER_COUNT) + 1,
                archived: Math.random() < 0.5 ? faker.date.recent() : undefined,
            }
        })
    }
    for (let i = 0; i < PART_COUNT; i++) {
        await prisma.part.create({
            data: {
                number: `P-${faker.number.int()}`,
                orderId: Math.floor(Math.random() * ORDER_COUNT) + 1,
                statusId: Math.floor(Math.random() * STATUS_COUNT) + 1,
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })