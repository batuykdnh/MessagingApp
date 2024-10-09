import prisma from "@/lib/db/db";
import {messages, notification} from "@prisma/client";
import {ITEM_PER_PAGE} from "@/lib/db/user";

export async function getChatOfCurrentUser(currentUserId:string){

    return prisma.chats.findMany({where:{
        users:{
            some:{
                id:currentUserId
            }
        }
        },
        select:{
            messages: {
                orderBy: {
                    sendDate: 'desc', // Order messages by the most recent (descending)
                },
                take: 1, // Only get the last (.)message for each chat
            },
            users:{
                where:{
                    NOT:{
                        id:currentUserId
                    }

                },
                select:{
                    username:true,
                    id:true,
                    picture:true
                }
            },
            id:true
        }})
}
export async function getChatUsersDB(chatId:string){

    return prisma.users.findMany({
        where:{
            chats:{
                some:{
                    id:chatId
                }
            }
        }
    })
}

export type chatMessagesProps = Awaited<ReturnType<typeof getMessagesOfChat>>

export async function getMessagesOfChat(chatId:string,page:number){


    return prisma.messages.findMany({
        where:{
            chatId:chatId
        },
        orderBy: {
            sendDate: 'desc', // Order messages by the most recent (descending)
        },
        select:{
            users:{
                select:{
                    username:true,
                    picture:true
                }
            },
            content:true,
            sendDate:true,
            id:true,
            ownerId:true
        },

        skip:ITEM_PER_PAGE * 2  * (page-1),
        take:ITEM_PER_PAGE * 2
    })
}

export async function checkIfChatExist(firstUserId:string,secondUserUsername:string){

    return prisma.chats.findFirst({where:{
            users:{
                some:{
                    id:firstUserId,
                }
            },
            AND:{
                users:{
                    some:{
                        username:secondUserUsername,
                    }
                },
            }
        },
})
}
export async function createMessageDb(messageData:Omit<messages, 'id' | 'sendDate'>){


    return prisma.messages.create({
        data:messageData
    })
}
export async function createNotificationDb(notificationData:Omit<notification, 'id'>){


    return prisma.notification.create({
        data:notificationData
    })
}

export async function getNotificationById(notificationId:string){


    return prisma.notification.findUnique({
        where:{
            id:notificationId
        }
    })
}

export async function setNotificationBooleanDb(notificationId:string,newBool:boolean){




    await prisma.notification.update({
        where:{
            id:notificationId
        },
        data:{
            isSeen:newBool
        }
    })

}

export async function clearNotificationsDb(userId:string){



    await prisma.notification.deleteMany({
        where:{
            userId:userId
        }
    })
}

export async function createChatDb(messageData:Omit<messages, 'id' | 'sendDate' | 'chatId' >,currentUserId:string,targetUserUsername:string){

    const checkIfExist = await checkIfChatExist(currentUserId,targetUserUsername)


    if(checkIfExist)
        return await createMessageDb({
            ...messageData,chatId:checkIfExist.id
        });



    const chat = await prisma.chats.create({
        data:{
            users:{
                connect:[{id:currentUserId}, {username:targetUserUsername}]
            }
        }
    })
    return await createMessageDb({
        ...messageData,chatId:chat.id
    });



}

