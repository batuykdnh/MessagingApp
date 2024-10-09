'use client'

import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {clsx} from "clsx";
import {Description} from "@radix-ui/react-dialog";
import { useEffect, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import { getUsersWhileSliding} from "@/lib/actions/user";
import {useInView} from "react-intersection-observer";
import CardWrapper from "@/components/ui/card-wrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {createChatFormSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {Card} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Session} from "next-auth";
import {createChat, getChatUsers} from "@/lib/actions/message";
import {socket} from "@/socket";
import {useRouter} from "next/navigation";
import {revalidateFromServer} from "@/lib/actions/utils";
import {AiOutlineLoading} from "react-icons/ai";
import {FormError} from "@/components/ui/condition-messages";

export function CreateChatModal({user}:{user:Session}){
    const [open,setOpen] = useState(false)
    const [openUser,setOpenUser] = useState(false)
    const [query,setQuery] = useState("")
    const [selectedUser,setSelectedUser] = useState("")
    const { ref, inView } = useInView()
    const [isPending,startTransition] = useTransition()

    const queryClient = useQueryClient()
    const router = useRouter()


    const [error,setError] = useState("")

    const form = useForm<z.infer<typeof createChatFormSchema>>({
        resolver: zodResolver(createChatFormSchema),
        defaultValues:{
            content:"",
            targetUserUsername:"",
            currentUserId:user.user.id
        }
    })
    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['users'],
        queryFn: async ({ pageParam  })=>  getUsersWhileSliding(user.user.id,query,pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.length>0?pages.length +1 : undefined,
    })



    useEffect(() => {
        if(hasNextPage)
            fetchNextPage()


    }, [inView]);






    const onSubmit =  (values:z.infer<typeof createChatFormSchema>)=>{

        values.targetUserUsername = selectedUser


        startTransition(async ()=>{
            const data = await createChat(values)
            setError("")
            if(data.success){
                const chatUsers = await getChatUsers(data.success)
                socket.emit("getMessage",{
                    message:values.content,
                    senderId:user.user.id,
                    targetUsers:chatUsers.map(user=>user.id),
                    senderUsername:user.user.username,
                    chatId:data.success
                })
                setOpen(false)
                setOpenUser(false)
                await revalidateFromServer("/?chatId="+data.success)
                router.push("/?chatId="+data.success)
            }
            else if(data.error)
                setError(data.error)

        })
    }


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} >
                <Button className={"h-[120px] lg:h-auto"} onClick={()=>{
                    setOpen(true)
                }}>Create Chat</Button>
                <DialogContent className={clsx(" bg-white dark:bg-black transition",
                    {

                    })}>
                    <DialogTitle className={"text-dark dark:text-white text-center "}>
                        Create Chat
                    </DialogTitle>
                    <Description>

                    </Description>
                    <div className={"h-full flex justify-center items-center"}>
                        <CardWrapper header={"Create Message"}>
                            <Form {...form}>
                                <div className={"flex flex-col gap-5"}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8 flex flex-col  ">
                                        <FormField
                                            control={form.control}
                                            name="targetUserUsername"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className={"pr-5"}>Select User</FormLabel>
                                                    <FormControl>
                                                        <Popover open={openUser} onOpenChange={setOpenUser}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={open}
                                                                    className="w-[200px] justify-between bg-black"
                                                                >
                                                                    {selectedUser}
                                                                    <Input className={"text-black hidden"} {...field} />
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[200px] p-0">
                                                                <Command>
                                                                    <Input onChange={(string)=>{
                                                                        queryClient.removeQueries({queryKey:["users"]})
                                                                        setQuery(string.target.value)

                                                                    }} placeholder="Search User..." />
                                                                    <CommandList>
                                                                        <ScrollArea>
                                                                            <CommandEmpty>No User found.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {data?.pages.map((page) => (
                                                                                    page.map((item) => (
                                                                                        <CommandItem className={""} key={item.id}>
                                                                                            <Card onClick={()=>{
                                                                                                setSelectedUser(item.username)
                                                                                                setOpenUser(false)
                                                                                            }} className={"p-5 w-full cursor-pointer"}>{item.username}</Card>
                                                                                        </CommandItem>
                                                                                    ))
                                                                                ))}

                                                                                {hasNextPage && <CommandItem>
                                                                                    <Card ref={ref} className={"p-5 w-full"}>Loading..</Card>
                                                                                </CommandItem> }

                                                                            </CommandGroup>
                                                                        </ScrollArea>

                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Select User To Send A Message
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Content</FormLabel>
                                                    <FormControl>
                                                        <Input className={"text-black"} placeholder="hello..." {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter Message
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <Button className={"self-center"} type="submit">Submit</Button>
                                    </form>
                                    {isPending && <AiOutlineLoading className={"animate-spin self-center"}/>}
                                    {error &&  <FormError message={error}></FormError>}

                                </div>
                            </Form>
                        </CardWrapper>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}