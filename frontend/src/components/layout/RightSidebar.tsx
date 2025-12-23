// components/layout/RightSidebar.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const RightSidebar = () => (
  <div className="hidden xl:block xl:w-[300px] p-4 space-y-4 sticky top-0 h-screen overflow-y-auto">
    {/* Bạn có thể biết */}
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Bạn có thể biết</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {["Alice", "Bob", "Charlie"].map((name, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{name}</span>
            </div>
            <Button variant="outline" size="sm">
              Theo dõi
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Xu hướng */}
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Xu hướng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 text-sm">
        <p className="font-semibold">#Nextjs14</p>
        <p className="text-gray-500">2.5k bài viết</p>
        <Separator />
        <p className="font-semibold">#ShadcnUI</p>
        <p className="text-gray-500">1.8k bài viết</p>
      </CardContent>
    </Card>
  </div>
);
