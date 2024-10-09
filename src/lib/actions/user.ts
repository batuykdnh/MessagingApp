'use server'

import {loginFormSchema, registerFormSchema} from "@/schemas";
import {z} from "zod";
import {createUserDB, ITEM_PER_PAGE} from "@/lib/db/user";
import bcrypt from "bcrypt";
import {auth, signIn, signOut} from "@/auth.config";
import {redirect} from "next/navigation";
import {AuthError} from "next-auth";
import prisma from "@/lib/db/db";


export async function GetSessionUser(){
    return (await auth())?.user

}



export async function createUser(values:z.infer<typeof registerFormSchema>){
    const validatedFields = registerFormSchema.safeParse(values)


    if(!validatedFields.success){
        return {error:"Invalid Fields"}
    }


    if(validatedFields.data.password !== validatedFields.data.confirmPassword)
        return {error:"Passwords do not match"};


    validatedFields.data.password = await bcrypt.hash(validatedFields.data.password, 10)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {confirmPassword,...userData} = validatedFields.data


    try{
        await createUserDB(userData)

    }
    catch (error:unknown){
        return {error:error?.toString()}
    }

    redirect("/login")

    return {success:"Success!"}

}

export async function getUsersWhileSliding(userId:string,query:string,page:number){

    page = page?page:1

    return prisma.users.findMany({
        where: {
            username:{
                contains: query,
            },
            NOT:{
                id:userId
            }
        },

        skip:ITEM_PER_PAGE * (page-1),
        take:ITEM_PER_PAGE

    });



}



export async function loginServerAction(values:z.infer<typeof loginFormSchema>){
    const validatedFields = loginFormSchema.safeParse(values)


    if(!validatedFields.success){
        return {error:"Invalid Fields"}
    }




    try{
         await signIn("credentials",{
            data:JSON.stringify(validatedFields.data),
             redirectTo:"/",
             redirect:true
        })
    }
    catch (error:unknown){
        if (error instanceof AuthError) {

            switch (error.type) {
                case 'CredentialsSignin':
                    return {error:'Invalid credentials.'};
                default:
                    return {error:'Something went wrong.'};
            }
        }

        throw error

    }


}
export async function logoutServerAction(){
    await signOut({
        redirectTo:"/"
    })
}