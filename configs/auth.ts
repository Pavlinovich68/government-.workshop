import type {AuthOptions, User} from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),
        Credentials({
            credentials: {
                email: { label: 'email', type: 'email', required: true },
                password: { label: 'password', type: 'password', required: true },
            },
            async authorize(credentials) {
                debugger;
                if (!credentials?.email || !credentials?.password) return null;

                /*const currentUser = credentials.email === 'sergey@pavlinovich.ru' ? {email: 'sergey@pavlinovich.ru', password: '111' } : null;

                if (currentUser && currentUser.password === credentials.password) {
                    const {password, ...userWithoutPass} = currentUser;
                    return userWithoutPass as User;
                }

                return null;*/

                const response  = await fetch('/api/users/login', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({ email: credentials.email, password: credentials.password })
                });

                return await response.json();
            }
        })
    ]
}