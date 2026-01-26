"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import Link from "next/link";
import { Loader2, Chrome, Github } from "lucide-react";
import * as z from "zod";
import { useRegisterMutation } from "@/hooks/user/useRegisterMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from '@react-oauth/google';

export const RegisterSchema = z
  .object({
    user_name: z
      .string()
      .min(3, {
        message: "Tên người dùng phải có ít nhất 3 ký tự.",
      })
      .max(30, {
        message: "Tên người dùng không được vượt quá 30 ký tự.",
      }),
    email: z.string().min(1, { message: "Email là bắt buộc." }).email({
      message: "Email không hợp lệ.",
    }),
    password: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirmPassword: z.string().min(1, {
      message: "Xác nhận mật khẩu là bắt buộc.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // Logic kiểm tra hai mật khẩu có khớp nhau không
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"], // Đính kèm lỗi vào trường confirmPassword
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const route = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      user_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { password, email, user_name } = data;
      const body = { password, email, user_name };
      await mutateAsync(body);
      route.push("/login");
    } catch {
      toast.error("Đăng ký không thành công. Vui lòng thử lại.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ access_token: codeResponse.access_token }),
        });

        if (!response.ok) {
          throw new Error('Google registration failed');
        }

        toast.success("Đăng ký thành công!");
        route.push("/");
      } catch (error) {
        toast.error("Đăng ký Google không thành công. Vui lòng thử lại.");
        console.error('Google registration error:', error);
      }
    },
    onError: () => {
      toast.error("Đăng ký Google không thành công.");
    },
  });

  const isSubmitting = form.formState.isSubmitting || isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Tạo tài khoản</CardTitle>
          <CardDescription className="text-center">
            Tham gia vào mạng xã hội của chúng tôi trong một vài bước.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* PHẦN SOCIAL LOGIN */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => googleLogin()}
              disabled={isSubmitting}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
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
                Hoặc đăng ký bằng Email
              </span>
            </div>
          </div>

          {/* PHẦN REGISTER FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Trường Tên người dùng (Username) */}
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tên_người_dùng_của_bạn"
                        type="text"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        disabled={isSubmitting}
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
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường Xác nhận mật khẩu */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Liên kết Đăng nhập */}
              <div className="pt-2 text-center text-sm">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>

              {/* Nút Đăng ký */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Đăng ký
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
