'use client'

import {Card} from "@/components/ui/card";
import {IoIosWarning} from "react-icons/io";
import {CheckCircleIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {clsx} from "clsx";

export function FormError({message}: {message?: string}) {

    const [loaded,setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(message !== "")
    }, [message]);


    return (

        <Card className={clsx("bg-destructive/15" +
            " text-destructive" +
            " p-3 flex" +
            " justify-center items-center",
            {
                "scale-0":!loaded,


            })}>
            <IoIosWarning />
            <p >{message}</p>
        </Card>
    )
}

export function FormSuccess({message}: {message?: string}){

    const [loaded,setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(message !== "")
    }, [message]);



    return (

        <Card className={clsx("bg-emerald-500/15 " +
            " text-emerald-500" +
            " p-3 flex" +
            " justify-center items-center gap-2 transition",
            {
                "scale-0":!loaded,
            })}>
            <CheckCircleIcon className={"h-4 w-4"} />
            <p >{message}</p>
        </Card>
    )
}