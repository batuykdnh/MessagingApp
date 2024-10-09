import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db/db";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from 'bcrypt';
import {loginFormSchema} from "@/schemas";
import {getUserByUsername} from "@/lib/db/user";
import {users} from "@prisma/client";





export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({

            async authorize(credentials) {

                const parsedData = JSON.parse(credentials.data as string)

                const parsedCredentials =loginFormSchema.safeParse(parsedData)

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;

                    const user = await getUserByUsername(username)


                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log(passwordsMatch)
                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
    callbacks:{
        jwt({token, user}){

            if(user){
                return {
                    ...token,
                    id:user.id,
                    picture:(user as users).picture,
                    username:(user as users).username
                }
            }
            return token
        },
        session({session,token}){

            session.user.id = token.id as string
            session.user.image = token.picture
            session.user.username = token.username as string
            return session
        }
    }
})