'use client'

import {Button} from "@/components/ui/button";
import {logoutServerAction} from "@/lib/actions/user";

export function Logout({children}:{children:React.ReactNode}){



    return (
        <form action={logoutServerAction}>
            <Button>Logout</Button>
        </form>
    )
}