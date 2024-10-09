'use client'

import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {Input} from "@/components/ui/input";
import {usePathname, useSearchParams} from "next/navigation";
import {redirectFromServer} from "@/lib/actions/utils";
import {useDebouncedCallback} from "use-debounce";
import {clsx} from "clsx";


export function SearchBar(){

    const pathName = usePathname()
    const searchParams = useSearchParams()


    const onSearchChange = useDebouncedCallback( (event) => {

        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("query",event.target.value)
        newSearchParams.set("page","1")
        redirectFromServer(pathName,newSearchParams.toString())


    }, 100);



    return (

        <>
            <Input onChange={onSearchChange}></Input>

        </>

    )

}
export function SearchPagination({pageAmount,currentPage}:{pageAmount:number,currentPage:number}){


    const searchParams = useSearchParams()
    const pathname = usePathname()
    currentPage = currentPage ? currentPage : 1

    function changePage(page:number){
        const newSearch = new URLSearchParams(searchParams);
        newSearch.set('page',page+"");

        redirectFromServer(pathname,newSearch.toString())
    }

    const data:number[] = []



    for (let i = pageAmount; i > pageAmount-4 ; i--) {
        if(i === currentPage && pageAmount > 4)
            break
        data.push(i)
    }

    data.reverse()





    return (
        <Pagination className={"flex-1 flex items-end "}>
            <PaginationContent>
                <PaginationItem className={clsx("cursor-pointer bg-white",
                    {
                        "pointer-events-none":currentPage <= 1 || !currentPage
                    })} >
                    <PaginationPrevious onClick={()=>{
                        changePage(currentPage-1)
                    }}  />
                </PaginationItem>
                {pageAmount > 4 && <PaginationItem className={"hidden lg:block bg-white cursor-pointer"}>
                    <PaginationLink onClick={()=>{
                        changePage(1)
                    }}>1</PaginationLink>
                </PaginationItem>}

                {(currentPage !== 1 && pageAmount > 4) && <PaginationItem  className={"hidden lg:block bg-white"}>
                    <PaginationEllipsis />
                </PaginationItem>}

                <PaginationItem className={"block lg:hidden bg-white cursor-pointer"}>
                    <PaginationLink onClick={()=>{
                        changePage(currentPage)
                    }}>{currentPage}</PaginationLink>
                </PaginationItem>



                {(currentPage !== 1 && pageAmount > 4) &&  <PaginationItem className={"hidden lg:block bg-white cursor-pointer"}>
                    <PaginationLink onClick={()=>{
                        changePage(currentPage)
                    }}>{currentPage}</PaginationLink>
                </PaginationItem>}


                {(data.length !== 0 && pageAmount > 4) && <PaginationItem  className={"hidden lg:block bg-white"}>
                    <PaginationEllipsis />
                </PaginationItem>}




                {data.map(x=>{
                    return(
                        <PaginationItem key={x} className={"hidden lg:block bg-white cursor-pointer"}>
                            <PaginationLink onClick={()=>{
                                changePage(x)
                            }}>{x}</PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem className={"block lg:hidden bg-white cursor-pointer"}>
                    <PaginationLink onClick={()=>{
                        changePage(pageAmount)
                    }}>{pageAmount}</PaginationLink>
                </PaginationItem>


                <PaginationItem  className={clsx("cursor-pointer bg-white",
                    {
                        "pointer-events-none":currentPage >= pageAmount || !currentPage
                    })} >
                    <PaginationNext onClick={()=>{
                        changePage(currentPage+1)
                    }} />


                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )

}