'use server'

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function redirectFromServer(pathname:string,newSearch:string){
    redirect(`${pathname}?${newSearch}`);
}

export async function revalidateFromServer(pathname:string){
    revalidatePath(pathname);
}