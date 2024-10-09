'use server'


import {z} from "zod";
import {createChatFormSchema, createMessageFormSchema, setNotificationFormSchema} from "@/schemas";
import {
    clearNotificationsDb,
    createChatDb,
    createMessageDb,
    createNotificationDb,
    getChatUsersDB,
    getMessagesOfChat,
    setNotificationBooleanDb
} from "@/lib/db/message";
import prisma from "@/lib/db/db";
import {ITEM_PER_PAGE} from "@/lib/db/user";

export async function createChat(values:z.infer<typeof createChatFormSchema>){
    const validatedFields = createChatFormSchema.safeParse(values)


    if(!validatedFields.success){
        return {error:"Invalid Fields"}
    }


    const {targetUserUsername,currentUserId,...data} = validatedFields.data



    try{
        const chat = await createChatDb({ownerId:currentUserId,content:data.content},currentUserId,targetUserUsername)
        return {success:chat.chatId}

    }
    catch (error:unknown){
        return {error:error?.toString()}
    }








}

export async function getMessagesWhileSliding(chatId:string,page:number){

    return  getMessagesOfChat(chatId,page)

}
export async function getChatUsers(chatId:string){

    return getChatUsersDB(chatId)

}

export async function getNotifications(userId:string){

    return prisma.notification.findMany({
        where:{
            userId:userId
        }
    })

}

export async function geNotificationsWhileSliding(userId:string,page:number){

    page = page?page:1

    const data = await prisma.notification.findMany({
        where:{
            userId:userId
        },
        select:{
            message:{
                select:{
                    content:true,
                    users:{
                        select:{
                            username:true,
                        }
                    },
                    chatId:true,
                }
            },
            id:true,
            messagesId:true,
            isSeen:true
        },

        orderBy:{
            message:{
                sendDate:"desc"
            }
        },

        skip:ITEM_PER_PAGE * (page-1),
        take:ITEM_PER_PAGE

    });


    return data

}

export async function clearNotifications(userId:string){

    try{

        await clearNotificationsDb(userId)

    }
    catch (error:unknown){
        return {error:error?.toString()}
    }
    return {success:"Success!"}

}


export async function setNotificationBoolean(values:z.infer<typeof setNotificationFormSchema>){
    const validatedFields = setNotificationFormSchema.safeParse(values)


    if(!validatedFields.success){
        return {error:"Invalid Fields"}
    }



    try{

        await setNotificationBooleanDb(validatedFields.data.notificationId,validatedFields.data.newBoolean);

    }
    catch (error:unknown){
        return {error:error?.toString()}
    }
    return {success:"Success!"}

}

export async function createMessage(values:z.infer<typeof createMessageFormSchema>){
    const validatedFields = createMessageFormSchema.safeParse(values)


    if(!validatedFields.success){
        return {error:"Invalid Fields"}
    }


    try{
        const message = await createMessageDb(validatedFields.data)

        const chatUsers = await getChatUsersDB(values.chatId)

        chatUsers.forEach( (user)=>{
            if(user.id === validatedFields.data.ownerId)
                return

             createNotificationDb({
                 messagesId:message.id,
                 userId:user.id,
                 isSeen:false
             })
        })

    }
    catch (error:unknown){
        return {error:error?.toString()}
    }
    return {success:"Success!"}

}