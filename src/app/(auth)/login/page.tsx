import LoginForm from "@/components/auth/login-form";

export default async function Page(){


    return (
        <div className={"h-full flex justify-center items-center "}>
            <LoginForm></LoginForm>
        </div>
    )
}