import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ORDER_COUNT = 10;

async function main() {
    /**
     * Model: Order
     * ---------------------
     * name     |    type 
     * ---------------------
     * id       |    number
     * number   |    string
     * 
     */
    for (let i = 0; i < ORDER_COUNT; i++) {
        await prisma.order.create({
            data: {
                number: `O-${i + 1}`
            }
        });
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