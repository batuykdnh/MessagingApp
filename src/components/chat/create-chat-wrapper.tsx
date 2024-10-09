import {getChatOfCurrentUser} from "@/lib/db/message";
import {Session} from "next-auth";
import {ChatUser, UserMessageList} from "@/components/chat/message-user";
import {Card} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";


export default async function CreateChatWrapper({user}:{user:Session}){
    const chats = await getChatOfCurrentUser(user.user.id);


    return (
        <>
            {chats.map((chat)=>{
                return (
                    <ChatUser chatId={chat.id} picture={chat.users[0].picture} username={chat.users[0].username} key={chat.id}/>
                )
            })}
        </>
    )
}

interface CreateSpecificChatProps{
    currentUserId:string,
    chatId:string,
    username:string
}
export async function CreateSpecificChat({chatId,currentUserId,username}:CreateSpecificChatProps){




    if(!chatId)
        return






    return (
        <ScrollArea className={"h-full"}>
            <Card className={"h-full p-5 bg-gray-400 border-none flex-col flex"}>
                <UserMessageList currentUserUsername={username} chatId={chatId} currentUserId={currentUserId}></UserMessageList>
            </Card>
        </ScrollArea>

    )
}