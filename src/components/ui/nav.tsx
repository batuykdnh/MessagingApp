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

export function Navbar({user}:{user?:Session | null}){



    return (
        <NavigationMenu className={"self-center pt-5 "}>
            <NavigationMenuList >
                <NavigationMenuItem >
                    <Link  href="/" legacyBehavior passHref>
                        <NavigationMenuLink   className={`${navigationMenuTriggerStyle()} bg-black text-white`} >
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/search" legacyBehavior passHref>
                        <NavigationMenuLink  className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                            Search
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                {!user ? (
                    <>
                        <NavigationMenuItem>
                            <Link href="/login" legacyBehavior passHref>
                                <NavigationMenuLink  className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                                    Login
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/register" legacyBehavior passHref>
                                <NavigationMenuLink  className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                                    Register
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </>
                ):  (
                    <>
                        <NavigationMenuItem>
                            <Logout>
                                <NavigationMenuLink  className={`${navigationMenuTriggerStyle()} bg-black text-white`}>
                                    Logout
                                </NavigationMenuLink>
                            </Logout>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NotificationSystem user={user} />
                        </NavigationMenuItem>
                    </>
                    )







                }


            </NavigationMenuList>
        </NavigationMenu>
    )
}