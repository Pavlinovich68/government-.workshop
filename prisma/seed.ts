import { Extensions } from "@prisma/client/runtime/library";
import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";

// TODO Seed
const divisions = {
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
               childrens: [
                  {
                     name: "Заместитель руководителя Аппарата Губернатора и Правительства",
                     short_name: "Приемная Козлова А.С.",
                     contacts: "",
                     childrens: [
                        {
                           name: "Министерство информационных технологий, связи и цифрового развития",
                           short_name: "Минцифры",
                           contacts: "",
                           childrens: [
                              {
                                 name: "ОГБУ \"Челябинский региональный центр навигационно-информационных технологий\"",
                                 short_name: "ОГБУ ЧРЦНИТ",
                                 contacts: "",
                                 childrens: [
                                    {
                                       name: "Служба администрирования",
                                       short_name: "Админы",
                                       contacts: "+7 (351) 211-68-27",
                                       childrens: []
                                    }
                                 ]
                              },
                              {
                                 name: "ОГКУ \"Центр информационно-технического обслуживания\"",
                                 short_name: "ОГКУ ЦИТО",
                                 contacts: "",
                                 childrens: []
                              }
                           ]
                        }
                     ]
                  }
               ]
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
};

async function main() {
   const upsertDivision = async (model: any, parentId: number | null) => {
      console.log(`Upsert division:`, model, '\n Parent division:', parentId);
      const result = await prisma.division.upsert({
         where: {name: model.name},
         update: {
            short_name: model.short_name,
            contacts: model.contacts,
            parent_id: parentId
         },
         create: {
               name: model.name,
               short_name: model.short_name,
               contacts: model.contacts,
               parent_id: parentId
         }
      });
      if (model.childrens && model.childrens.length > 0){
         for (const item of model.childrens){
            await upsertDivision(item, result.id);
         }
      }
      return result;
   }

   upsertDivision(divisions, null);


   const division = await prisma.division.findUnique({
      where: {
         name: 'Служба администрирования'
      }
   });

   if (division) {
      const hashPassword = await bcrypt.hashSync("Administrator1!", 8);

      await prisma.users.upsert({
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
               division_id: division.id,
               roles: appRoles
         }
      })

      await prisma.users.upsert({
         where: {email: 'base@localhost'},
         update: {
            name: 'Пользователь системы',
            roles: {"base": "Пользователь системы"}
         },
         create: {
               email: 'base@localhost',
               name: 'Пользователь системы',
               begin_date: new Date(),
               password: hashPassword,
               division_id: division.id,
               roles: {"base": "Пользователь системы"}
         }
      })

      await prisma.users.upsert({
         where: {email: 'reserve-holl@localhost'},
         update: {
            name: 'Бронирование залов',
            roles: {"reserve-holl": "Бронирование залов"}
         },
         create: {
               email: 'reserve-holl@localhost',
               name: 'Бронирование залов',
               begin_date: new Date(),
               password: hashPassword,
               division_id: division.id,
               roles: {"reserve-holl": "Бронирование залов"}
         }
      })

      await prisma.users.upsert({
         where: {email: 'reserve-conf@localhost'},
         update: {
            name: 'Бронирование конференций ВКС',
            roles: {"reserve-conf": "Бронирование конференций ВКС"}
         },
         create: {
               email: 'reserve-conf@localhost',
               name: 'Бронирование конференций ВКС',
               begin_date: new Date(),
               password: hashPassword,
               division_id: division.id,
               roles: {"reserve-conf": "Бронирование конференций ВКС"}
         }
      })

   } else {
      throw new Error("Не удалось найти подразделение администраторов!");
   }
}

main().then(async () => {
   await prisma.$disconnect();
})
.catch(async (e) => {
   console.log(e);
   await prisma.$disconnect();
   process.exit(1);
})