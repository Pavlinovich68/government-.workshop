import {IUser} from "@/models/IUser";
import { makeAutoObservable } from "mobx";
import ApiError from "@/app/api/api-error";
import {PrismaClient} from "@prisma/client";
import CryptJS from "@/store/cryptjs";
import {mockProviders} from "next-auth/client/__tests__/helpers/mocks";
import credentials = mockProviders.credentials;
import {signIn} from "next-auth/react";

const prisma = new PrismaClient();
export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string){
        try {
            console.log('password');
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

            this.setUser(user as IUser);
            this.setAuth(true);
            //await signIn('credentials', { email, password });
        } catch (error) {
            throw ApiError.AuthorizationError();
        }
    }
}