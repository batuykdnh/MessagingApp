import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

interface CardWrapperProps{
    children:React.ReactNode,
    header?:string,
    footer?:string,
}



export default function CardWrapper({children,header,footer}:CardWrapperProps) {

    return (
        <>
            <Card className={`w-full lg:w-[400px] border-none bg-white dark:bg-black text-black dark:text-white`} >
                <CardHeader>
                    {header && <CardTitle className={"flex justify-center"}>
                        {header}
                    </CardTitle>}

                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>

                {footer && <CardFooter className={"flex justify-center font-bold"}>
                    {footer}
                </CardFooter>}

            </Card>
        </>
    )
}