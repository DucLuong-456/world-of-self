import { ReactNode } from "react";
import { MainSidebar } from "./MainSidebar";
import { RightSidebar } from "./RightSidebar";
import Header from "./Header";

type DefaultLayoutProps = {
  children: ReactNode;
};

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="container mx-auto pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[250px_1fr_300px] gap-4">
          <MainSidebar />
          <main className="p-4 lg:p-6 lg:border-x">{children}</main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};
