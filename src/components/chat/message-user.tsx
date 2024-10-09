'use client'

import {Card} from "@/components/ui/card";
import Image from "next/image";
import {usePathname, useSearchParams} from "next/navigation";
import {redirectFromServer} from "@/lib/actions/utils";
import {clsx} from "clsx";
import {Input} from "@/components/ui/input";
import {IoSend} from "react-icons/io5";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {createMessageFormSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {startTransition, useEffect, useRef, useState} from "react";
import {createMessage, getChatUsers, getMessagesWhileSliding} from "@/lib/actions/message";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useInView} from "react-intersection-observer";
import {socket} from "@/socket";


interface chatUserProps{
    picture:string,
    username:string,
    chatId:string
}

export function ChatUser({picture,username,chatId}:chatUserProps){

    const searchParams = useSearchParams()
    const pathname = usePathname()

    function changeUser(chatId:string){
        const newSearch = new URLSearchParams(searchParams);
        newSearch.set('chatId',chatId);

        redirectFromServer(pathname,newSearch.toString())
    }

    return (
        <Card onClick={()=>{
            changeUser(chatId)
        }} className={"cursor-pointer h-[120px] justify-center items-center bg-gray-600 border-none grid grid-rows-[min-content_1fr] p-2 relative"}>
            <div className={"w-full flex justify-center"}>
                <Image className={clsx("aspect-square rounded-2xl",
                    {
                        "opacity-0":picture === "/"
                    })} src={picture} alt={username} width={40} height={40}></Image>
            </div>
            <p >{username}</p>
        </Card>
    )
}


interface userMessageProps{
    picture:string,
    content:string,
    date:Date,
    isOwner:boolean,
    currentUserId:string,
    newlyCreated:boolean
}


export function UserMessage({content,isOwner,newlyCreated}:userMessageProps){




    return (
        <Card className={clsx("break-all h-full bg-black border-none text-white flex p-3",
            {
                "col-start-2":isOwner,
                "col-start-1 col-span-2 w-1/2":!isOwner,
                "animate-newMessage":newlyCreated
            })}>
            <p className={"flex items-center"}>{content}</p>
        </Card>
    )
}

interface userMessageListProps{
    currentUserId:string,
    chatId:string,
    currentUserUsername:string
}


interface pendingMessageType{
    isOwner:boolean,
    content:string
}

export function UserMessageList({currentUserId,chatId,currentUserUsername}:userMessageListProps){

    const [pendingMessages,setPendingMessages] =
        useState<pendingMessageType[]>([]);


    const queryClient = useQueryClient();


    const { ref, inView } = useInView()




    useEffect(() => {
        const socketEvent = (message: {
            message:string ,
            senderId:string,
            targetUsers:string[],
            chatId:string,
            senderUsername:string
        })=>{


            if(message.senderId !== currentUserId &&
                message.targetUsers.includes(currentUserId) && chatId === message.chatId ){
                setPendingMessages(prevMessages => [
                    ...prevMessages, // use the previous state
                    {
                        isOwner: false,
                        content: message.message
                    }
                ]);


            }
        }


        socket.on("getMessage",socketEvent)

        return () => {
            socket.off("getMessage",socketEvent);
        };
    }, [chatId]);





    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['messages'],
        queryFn: async ({ pageParam  })=>  getMessagesWhileSliding(chatId,pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.length>0?pages.length +1 : undefined,
    })







    useEffect(() => {
        if(hasNextPage)
            fetchNextPage()


    }, [inView]);


    const elementToScroll = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        if(data?.pages?.length && data.pages.length < 4){
            elementToScroll.current?.scrollIntoView({ behavior: 'instant' });

        }

    }, [chatId,data]);

    useEffect(() => {

        elementToScroll.current?.scrollIntoView({ behavior: 'instant' });


    }, [pendingMessages]);



    useEffect(() => {
        setPendingMessages([])
        queryClient.removeQueries({queryKey:['messages']})
        form.setValue("chatId",chatId)
    }, [chatId, queryClient]);

    const form = useForm<z.infer<typeof createMessageFormSchema>>({
        resolver: zodResolver(createMessageFormSchema),
        defaultValues:{
            content:"",
            chatId: chatId,
            ownerId: currentUserId

        }
    })



    const onSubmit =  (values:z.infer<typeof createMessageFormSchema>)=>{

        setPendingMessages([...pendingMessages, {content:values.content,isOwner:true}])
        form.resetField("content")


        startTransition(async ()=>{

            await createMessage(values)
            const chatUsers = await getChatUsers(chatId);
            socket.emit("getMessage",{
                message:values.content,
                senderId:values.ownerId,
                targetUsers:chatUsers.map(user=>user.id),
                senderUsername:currentUserUsername,
                chatId:chatId
            })
        })
    }

    return (
        <>
                <div className={"grid flex-1 grid-cols-2 relative auto-rows-[min-content] gap-y-5 content-end"}>
                    {hasNextPage && <Card ref={ref} className={"opacity-50 p-5 absolute m-auto left-0 right-0"}>Loading..</Card> }

                    {data?.pages.slice().reverse().map((page) => (
                        page.slice().reverse().map((message) => (
                            <UserMessage newlyCreated={false} key={message.id} picture={message.users.picture} currentUserId={currentUserId}
                                         content={message.content}
                                         date={message.sendDate} isOwner={currentUserId === message.ownerId}/>
                        ))
                    ))}

                    {pendingMessages.map((message,index) => {
                        return (
                            <UserMessage newlyCreated={true} key={index+message.content+message.isOwner} picture={"/"} currentUserId={currentUserId} content={message.content}
                                         date={new Date()} isOwner={message.isOwner}/>
                        )
                    })}
                </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex gap-5 pt-5">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({field}) => (
                            <FormItem className={"flex-1"}>
                                <FormControl>
                                    <Input className={"text-black flex-1"} placeholder="" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button ref={elementToScroll}>
                            <IoSend className={"h-10 w-10 cursor-pointer"}></IoSend>
                        </Button>


                    </form>


            </Form>

        </>
    )
}