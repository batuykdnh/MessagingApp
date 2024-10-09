import RegisterForm from "@/components/auth/register-form";
import DialogSpawn from "@/components/dialog/dialog-spawn";

export default async function Page(){


    return (
        <DialogSpawn title={"Create Account"}>
            <RegisterForm></RegisterForm>
        </DialogSpawn>



    )
}