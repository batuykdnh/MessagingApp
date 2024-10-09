import {getPageNumberOfQuery, getUsersByQuery} from "@/lib/db/user";
import {users} from "@prisma/client";
import {SearchUserCard} from "@/components/search/user";
import {SearchPagination} from "@/components/search/search-bar";

export async function SearchUserWrapper({search,page}:{search: string,page:string}){

    const [users,pageAmount] = await Promise.all([
        getUsersByQuery(search,Number(page)),
        getPageNumberOfQuery(search)])


    return (

        <>
            <SearchUserList userData={users}></SearchUserList>
            <SearchPagination pageAmount={pageAmount} currentPage={Number(page)} ></SearchPagination>

        </>
    )
}
export async function SearchUserList({userData}:{userData:users[]}){

    return (

        <>
            {userData.map((user)=>{
                return (
                    <SearchUserCard key={user.id} username={user.username} picture={user.picture}/>
                )
            })}
        </>
    )
}
