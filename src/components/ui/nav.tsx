import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {Session} from "next-auth";
import {Logout} from "@/components/auth/logout-form";
import {NotificationSystem} from "@/components/socket/notification";
import {Card} from "@/components/ui/card";
import {FaHome, FaRegistered, FaSearch} from "react-icons/fa";
import {IoLogIn, IoLogOut} from "react-icons/io5";

export function Navbar({user}:{user?:Session | null}){



    return (

        <NavigationMenu className={"self-center pt-5"}>
            <NavigationMenuList >
                <NavigationMenuItem >
                    <Link  href="/" legacyBehavior passHref>
                        <NavigationMenuLink   className={`${navigationMenuTriggerStyle()} bg-black text-white`} >
                            <span className={"hidden lg:block"}>Home</span>
                            <FaHome className={"block lg:hidden"} />
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/search" legacyBehavior passHref>
                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()}  bg-black text-white`}>
                            <span className={"hidden lg:block"}>Search</span>
                            <FaSearch className={"block lg:hidden"}/>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                {!user ? (
                    <>
                        <NavigationMenuItem>
                            <Link href="/login" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                                    <span className={"hidden lg:block"}>Login</span>
                                    <IoLogIn  className={"block lg:hidden"}/>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                        <Link href="/register" legacyBehavior passHref>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                                <span className={"hidden lg:block"}>Register</span>
                                <FaRegistered  className={"block lg:hidden"}/>
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>
                    </>
                ) : (
                    <>
                        <NavigationMenuItem>
                            <Logout>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                                    <span className={"hidden lg:block"}>Logout</span>
                                    <IoLogOut  className={"block lg:hidden"}/>
                                </NavigationMenuLink>
                            </Logout>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                        <NotificationSystem user={user} />
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Card className={"p-3 bg-black text-white border-none"}>{user.user.username}</Card>
                        </NavigationMenuItem>
                    </>
                    )







                }


            </NavigationMenuList>
        </NavigationMenu>
    )
}