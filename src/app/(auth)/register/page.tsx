import RegisterForm from "@/components/auth/register-form";

export default async function Page(){


    return (
        <div className={"h-full flex justify-center items-center"}>
            <RegisterForm></RegisterForm>
        </div>
    )
}