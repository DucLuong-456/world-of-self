"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Chrome, Github } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/hooks/user/useLoginMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/hooks/keys";

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email không được để trống.",
    })
    .email({
      message: "Email không hợp lệ.",
    }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự.",
  }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const route = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutateAsync(data);
      route.push("/");
    } catch {
      toast.error("Thông tin đăng nhập không chính xác. Vui lòng thử lại.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ access_token: codeResponse.access_token }),
          },
        );

        if (!response.ok) {
          throw new Error("Google login failed");
        }
        await queryClient.invalidateQueries({ queryKey: [QueryKey.user] });

        route.push("/");
      } catch (error) {
        toast.error("Đăng nhập Google không thành công. Vui lòng thử lại.");
        console.error("Google login error:", error);
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google không thành công.");
    },
  });

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Chào mừng trở lại! Nhập thông tin của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* PHẦN SOCIAL LOGIN */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                googleLogin();
              }}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          {/* Dấu phân cách "Hoặc" */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                Hoặc đăng nhập bằng Email
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Trường Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ten@example.com"
                        type="email"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường Mật khẩu */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••"
                        type="password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nút Quên mật khẩu và Đăng ký */}
              <div className="flex justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Quên mật khẩu?
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Chưa có tài khoản? Đăng ký
                </Link>
              </div>

              {/* Nút Đăng nhập */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng nhập
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
