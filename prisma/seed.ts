import prisma from "./client";
import crypto from "./crypt";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";


const divisions = [
   {
      name: "Губернатор Челябинской области",
      short_name: "Губернатор",
      contacts: null,
      childrens: [
         {
            name: "Аппарат Губернатора и Правительства Челябинской области",
            short_name: "Аппарат Правительства",
            contacts: null,
            childrens: [
               {
                  name: "Первый заместитель Губернатора Челябинской области",
                  short_name: "Приемная Мамина В.В.",
                  contacts: null,
                  childrens: []
               },
               {
                  name: "Первый заместитель Губернатора Челябинской области",
                  short_name: "Приемная Гехт И.А.",
                  contacts: null,
                  childrens: []
               },
            ]
         }
      ]
   }
];

async function main() {
   const div = await prisma.division.upsert({
      where: {name: 'Служба администрирования'},
      update: {
         contacts: "+7 (351) 211-68-27"
      },
      create: {
            name: 'Служба администрирования',
            short_name: "Админы"
      }
   });


   const hashPassword = await bcrypt.hashSync("Administrator1!", 8);

   const row = await prisma.users.upsert({
      where: {email: 'administrator@localhost'},
      update: {
         name: 'Администратор системы',
         roles: appRoles
      },
      create: {
            email: 'administrator@localhost',
            name: 'Администратор системы',
            begin_date: new Date(),
            password: hashPassword,
            division_id: div.id,
            roles: appRoles
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