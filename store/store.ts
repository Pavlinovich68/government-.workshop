import {User} from "@/models/User";
import { makeAutoObservable } from "mobx";
import ApiError from "@/app/api/api-error";
import {PrismaClient} from "@prisma/client";
import CryptJS from "@/store/cryptjs";
import {signIn} from "next-auth/react";

const prisma = new PrismaClient();
export default class Store {
   user = {} as User;
   isAuth = false;
   isLoading = false;

   constructor() {
      makeAutoObservable(this);
   }

   setAuth(bool: boolean) {
      this.isAuth = bool;
   }

   setUser(user: User) {
      this.user = user;
   }

   setLoading(bool: boolean) {
      this.isLoading = bool;
   }

   async login(email: string, password: string){
      try {
         const user = await prisma.users.findFirst({
            where: {
               email: email
            }
         });

         if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
         }

         const isPassEquals = await CryptJS.compare(password, user.password);
         if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
         }

         this.setUser(user as User);
         this.setAuth(true);
            //await signIn('credentials', { email, password });
      } catch (error) {
         throw ApiError.AuthorizationError();
      }
   }
}