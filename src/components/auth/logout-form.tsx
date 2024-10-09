'use client'

import {logoutServerAction} from "@/lib/actions/user";
import {IoLogOut} from "react-icons/io5";
import {Button} from "@/components/ui/button";


export function Logout({}:{children:React.ReactNode}){



    return (
        <form action={logoutServerAction}>
            <Button className={"bg-black "}>
                <span className={"hidden lg:block"}>Logout</span>
                <IoLogOut className={"block lg:hidden"}/>
            </Button>
        </form>
    )
}