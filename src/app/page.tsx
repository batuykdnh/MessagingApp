import {CreateChatModal} from "@/components/chat/create-chat";
import {auth} from "@/auth.config";
import CreateChatWrapper, {CreateSpecificChat} from "@/components/chat/create-chat-wrapper";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Suspense} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function Home({searchParams}:{searchParams:{chatId:string}}) {


    const user = await auth()






  return (

      <div className={"min-h-0 grid grid-rows-[200px_1fr] lg:grid-rows-none lg:grid-cols-[200px_1fr] p-5 rounded-2xl border-none justify-center items-center h-full w-[340px] lg:w-[900px] bg-gray-800 self-center mb-5"}>
          {!user ?  <Link className={"col-span-2 flex justify-center"} href={"/login"}>
              <Button>Start Messaging</Button>
          </Link> : (
              <>
                  <ScrollArea className={"h-full w-full"}>
                      <div className={" min-h-0 min-w-0 flex items-center lg:items-stretch lg:flex-col h-full gap-5 p-3  border-black"}>
                          <Suspense>
                              <CreateChatWrapper user={user}></CreateChatWrapper>
                          </Suspense>


                          <CreateChatModal user={user}></CreateChatModal>
                      </div>
                      <ScrollBar className={"block lg:hidden"} orientation="horizontal" />

                  </ScrollArea>
                  <Suspense>
                      <CreateSpecificChat username={user.user.username} currentUserId={user.user.id} chatId={searchParams.chatId}></CreateSpecificChat>
                  </Suspense>
              </>
          )}



      </div>
  );
}
