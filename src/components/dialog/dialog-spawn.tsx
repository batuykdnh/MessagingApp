'use client'

import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {useEffect, useState} from "react";
import {clsx} from "clsx";
import {Description} from "@radix-ui/react-dialog";
import {useRouter} from "next/navigation";


interface DialogSpawnProps{
    children:React.ReactNode,
    title:string
}

export default function DialogSpawn({children,title}:DialogSpawnProps){

    const [loaded, setLoaded] = useState(false);
    const router = useRouter()

    useEffect(() => {
        setLoaded(true)
    }, []);



    return (
        <Dialog open={true}  onOpenChange={()=>{
            router.back()
        }} >

            <DialogContent className={clsx(" bg-white dark:bg-black transition",
                {
                    "translate-y-1/3 opacity-0":!loaded
                })}>
                <DialogTitle className={"text-dark dark:text-white text-center opacity-0 "}>
                    {title}
                </DialogTitle>
                <Description>
                    {title}
                </Description>
                <div className={"h-full flex justify-center items-center"}>
                    {children}
                </div>
            </DialogContent>
        </Dialog>

    )
}