import {users} from "@prisma/client";
import prisma from "@/lib/db/db";




export async function createUserDB(user:Omit<users, 'id' | 'picture' | 'email' | 'accountCreationDate'>){

    const checkIfExist = await getUserByUsername(user.username);

    if(checkIfExist)
        throw new Error("User already exists");

    await prisma.users.create({
        data:user
    })

}


export const ITEM_PER_PAGE  = 6




export async function getUsersByQuery(query:string,page:number){

    page = page?page:1

    return prisma.users.findMany({
        where: {
            username:{
                contains: query,
            }
        },

        skip:ITEM_PER_PAGE * (page-1),
        take:ITEM_PER_PAGE

    });

}
export async function getPageNumberOfQuery(query:string){

    const userAmount=await prisma.users.count({
        where:{
            username:{
                contains: query,
            }
        }
    })
    return Math.ceil(userAmount/ITEM_PER_PAGE)

}

export async function getUserByUsername(username:string){



    return prisma.users.findUnique({
        where: {
            username: username
        }
    });

}