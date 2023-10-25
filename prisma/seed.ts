import { PrismaClient } from '@prisma/client';
//import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const roles = [
    {"name": "Администратор системы","code": "admin"},
    {"name": "Пользователь системы","code": "base"}
];


async function main() {
    const div = await prisma.division.upsert({
        where: {name: 'Служба администрирования'},
        update: {},
        create: {
            name: 'Служба администрирования'
        }
    });

    //const hashPassword = await bcrypt.hashSync("Administrator1!", 8);

    const row = await prisma.users.upsert({
        where: {email: 'administrator@localhost'},
        update: {},
        create: {
            email: 'administrator@localhost',
            begin_date: new Date(),
            password: '',
            division_id: div.id,
            roles: [{"name": "Администратор системы","code": "admin"}]
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