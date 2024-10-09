import DialogSpawn from "@/components/dialog/dialog-spawn";
import LoginForm from "@/components/auth/login-form";

export default async function Page(){


    return (
        <div>
            <DialogSpawn title={"Login"}>
                <LoginForm></LoginForm>
            </DialogSpawn>
        </div>

    )
}