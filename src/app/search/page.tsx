import {Card} from "@/components/ui/card";
import {SearchBar} from "@/components/search/search-bar";
import {Suspense} from "react";
import {SearchUserWrapper} from "@/components/search/search-bar-wrapper";
import {ScrollArea} from "@/components/ui/scroll-area";

export default async function SearchPage({searchParams}:{searchParams:{query:string,page:string}}){

    return (
        <Card className={"overflow-auto w-[300px] lg:w-[600px] bg-black border-none p-5 flex-col flex gap-5 self-center  h-full mb-5"}>
            <ScrollArea className={"h-full w-full"}>
                <div className={"h-full min-h-0 min-w-0 flex flex-col gap-5 items-center flex-1"}>
                    <SearchBar></SearchBar>
                    <Suspense>
                        <SearchUserWrapper page={searchParams.page} search={searchParams.query}></SearchUserWrapper>
                    </Suspense>

                </div>
            </ScrollArea>


        </Card>
    )
}