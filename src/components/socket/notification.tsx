'use client'

import {socket} from "@/socket";
import {startTransition, useEffect, useRef, useState} from "react";
import {IoIosNotifications} from "react-icons/io";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Session} from "next-auth";
import {Select, SelectContent, SelectTrigger} from "@/components/ui/select";
import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    clearNotifications,
    geNotificationsWhileSliding,
     getNotifications,
    setNotificationBoolean
} from "@/lib/actions/message";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import { setNotificationFormSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {clsx} from "clsx";
import {Card} from "@/components/ui/card";
import {useInView} from "react-intersection-observer";

export function NotificationSystem({user}:{user:Session }){

    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam  })=>  geNotificationsWhileSliding(user?.user.id,pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.length>0?pages.length +1 : undefined,
    })

    const totalNotifications = useQuery({
        queryKey:["notificationAmount"],
        queryFn: async ()=>{
            return getNotifications(user.user.id)
        }

    })

    const router = useRouter()

    const queryClient = useQueryClient()

    const [ref,inView] = useInView()

    const audioRef = useRef<HTMLAudioElement | null>(null)

    const form = useForm<z.infer<typeof setNotificationFormSchema>>({
        resolver: zodResolver(setNotificationFormSchema),
        defaultValues:{
            notificationId: "",
            newBoolean: false,
            chatId: ""

        }
    })
    useEffect(() => {
        const socketEvent = async (message: {
            message:string ,
            senderId:string,
            targetUsers:string[],
            chatId:string,
            senderUsername:string
        })=>{
            if(user?.user.id !== message.senderId && message.targetUsers.includes(user?.user.id as string)){
              //  toast("Got message from "+message.senderUsername)

                if(audioRef.current){
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    audioRef.current.play()

                }

                queryClient.invalidateQueries({
                    queryKey:["notificationAmount"]
                })
                queryClient.invalidateQueries({
                    queryKey:["notifications"]
                })
            }

        }

        socket.on("getMessage",socketEvent)

        return () => {
            socket.off("getMessage",socketEvent);
        };
    }, []);

    useEffect(() => {
        if(hasNextPage)
            fetchNextPage()
    }, [inView]);

    const onSubmit =  (values:z.infer<typeof setNotificationFormSchema>)=>{



        startTransition(async ()=>{

            let data;

            if(values.notificationId === "-1"){
                data = await clearNotifications(user.user.id);
            }
            else{
                data = await setNotificationBoolean(values)
            }

            if(data.success){
                await queryClient.invalidateQueries({
                    queryKey: ["notifications"]
                })
                    await queryClient.invalidateQueries({
                        queryKey: ["notificationAmount"]
                    })

                if(values.notificationId !== "-1")
                router.push(`/?chatId=${values.chatId}`)

            }


        })
    }
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
            setAnimate(true);
            // Remove animation class after a brief moment
            const timeout = setTimeout(() => {
                setAnimate(false);
            }, 500); // Duration should match the CSS animation duration

            return () => clearTimeout(timeout); // Cleanup timeout

    }, [totalNotifications.data]); // Trigger effect on data change


    return (
        <>
            <Select>
                <audio ref={audioRef}>
                    <source src={"/sound.mp3"}/>
                </audio>
                <SelectTrigger className={"bg-transparent border-none"}>
                    <div className={clsx("relative cursor-pointer",
                        {
                            "animate-vibrate": animate
                        })}>
                        <p className={"text-red-500  absolute right-0"}>
                            {totalNotifications.data?.filter(x=>!x.isSeen).length}
                        </p>
                        <IoIosNotifications className={"w-10 h-10"}/>
                    </div>
                </SelectTrigger>
                <SelectContent className={"w-[200px] h-[200px] min-h-0    "}>
                    <Form  {...form}>
                        <div className={"flex flex-col gap-2"}>
                            <form className={"flex flex-col gap-2"} onSubmit={form.handleSubmit(onSubmit)}>
                                <Button onClick={() => {
                                    form.setValue("notificationId", "-1")

                                }} className={"w-full"}>Clear</Button>
                                {data?.pages.map((page) => (
                                    page.map((notification) => (

                                        <Button type={"submit"} key={notification.id}
                                                className={clsx("w-full",
                                                    {
                                                        "bg-green-400": !notification.isSeen,

                                                    })} onClick={() => {
                                            form.setValue("notificationId", notification.id)
                                            form.setValue("chatId", notification.message.chatId)
                                            form.setValue("newBoolean", !notification.isSeen)

                                        }}>
                                            <div className={"w-full"}>
                                                <p>From: {notification.message.users.username}</p>
                                                <p>Message: {notification.message.content}</p>
                                            </div>
                                        </Button>


                                    ))
                                ))}
                            </form>
                        </div>
                    </Form>
                    {hasNextPage && <Card ref={ref} className={"p-5 w-full"}>Loading..</Card>
                    }

                    {data?.pages[0].length === 0 && <p className={"text-center"}>You have no notifications</p>}


                </SelectContent>

            </Select>
            <ToastContainer></ToastContainer>

        </>


    )


}