import prisma from "./client";
import crypto from "./crypt";
import {appRoles} from "./roles";


async function main() {
    const div = await prisma.division.upsert({
        where: {name: 'Служба администрирования'},
        update: {},
        create: {
            name: 'Служба администрирования'
        }
    });

    const hashPassword = await crypto.hashSync("Administrator1!");

    const row = await prisma.users.upsert({
        where: {email: 'administrator@localhost'},
        update: {},
        create: {
            email: 'administrator@localhost',
            begin_date: new Date(),
            password: hashPassword,
            division_id: div.id,
            roles: [appRoles["admin"]]
        }
    })
}

main().then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
})