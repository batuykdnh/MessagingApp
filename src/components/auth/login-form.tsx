'use client'

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {loginFormSchema} from "@/schemas";
import {useState, useTransition} from "react";
import CardWrapper from "@/components/ui/card-wrapper";
import {AiOutlineLoading} from "react-icons/ai";
import { loginServerAction} from "@/lib/actions/user";
import {FormError, FormSuccess} from "@/components/ui/condition-messages";
import {useRouter} from "next/navigation";






export default function LoginForm(){

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues:{
            username:"",
            password:""
        }
    })

    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState<string | undefined>()
    const [success,setSuccess] = useState<string | undefined>()
    const router = useRouter()

    const onSubmit =  (values:z.infer<typeof loginFormSchema>)=>{
        setError("")
        setSuccess("")

        startTransition(async ()=>{
            const data = await loginServerAction(values)
            setError(data?.error)
            setSuccess(data?.success)
            if(data.success)
                router.push("/")
        })
    }


    return (
        <CardWrapper header={"Login"}>
            <Form {...form}>
                <div className={"flex flex-col gap-5"}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8 flex flex-col  ">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input className={"text-black"} placeholder="username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter Your Username
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} className={"text-black"} placeholder="******" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter Your Password
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button className={"self-center"} type="submit">Submit</Button>
                    </form>
                    {isPending && <AiOutlineLoading className={"animate-spin self-center"}/>}
                    {error &&  <FormError message={error}></FormError>}
                    {success &&  <FormSuccess message={success}></FormSuccess>}

                </div>

            </Form>
        </CardWrapper>
    )


}