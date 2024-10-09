import {z} from "zod";

export const registerFormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password:z.string().min(6,{
        message:"Password must be at least 6 characters.",
    }),
    confirmPassword:z.string().min(6,{
        message:"Password must be at least 6 characters.",
    })
})
export const loginFormSchema = z.object({
    username: z.string(),
    password:z.string()
})
export const createChatFormSchema = z.object({
    content:z.string(),
    targetUserUsername:z.string(),
    currentUserId:z.string()
})

export const createMessageFormSchema = z.object({
    content:z.string().min(1),
    chatId:z.string(),
    ownerId:z.string()
})
export const setNotificationFormSchema = z.object({
    notificationId:z.string(),
    newBoolean:z.boolean(),
    chatId:z.string(),

})

