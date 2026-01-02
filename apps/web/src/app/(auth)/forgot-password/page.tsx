import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/card";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export default function ForgotPassword() {
    return (
        <Card className="gap-4">
            <CardHeader>
                <CardTitle className="text-lg tracking-tight">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email address and we will send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ForgotPasswordForm />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <p className="text-muted-foreground text-center text-sm">
                    Remember your password?{" "}
                    <Link
                        href="/sign-in"
                        className="hover:text-primary underline underline-offset-4 font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
