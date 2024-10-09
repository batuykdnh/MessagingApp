import {Card} from "@/components/ui/card";
import Image from "next/image";
import {clsx} from "clsx";


interface SearchUserCardProps{
    username:string,
    picture:string
}

export function SearchUserCard({username,picture}:SearchUserCardProps){


    return (
        <Card className={"grid grid-cols-[min-content_1fr] bg-white w-[75%] lg:w-1/2   h-[100px] relative"}>
            <Image className={clsx("aspect-square rounded-2xl",
                {
                    "opacity-0":picture === "/"
                })} src={picture} alt={username} width={40} height={40} ></Image>
            <p className={"justify-center items-center flex"}>{username}</p>
        </Card>

    )
}