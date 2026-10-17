"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  description: ReactNode;
  specs: ReactNode;
  downloads: ReactNode;
  warranty: ReactNode;
  faqs: ReactNode;
  hasDownloads: boolean;
  hasFaqs: boolean;
}

export function ProductTabs({
  description,
  specs,
  downloads,
  warranty,
  faqs,
  hasDownloads,
  hasFaqs,
}: ProductTabsProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto border-b border-gray-200 rounded-none h-auto p-0 bg-transparent gap-8 scrollbar-none">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black text-gray-500 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 text-sm font-bold transition-all"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black text-gray-500 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 text-sm font-bold transition-all"
          >
            Technical Specifications
          </TabsTrigger>
          {hasDownloads && (
            <TabsTrigger
              value="downloads"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black text-gray-500 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 text-sm font-bold transition-all"
            >
              Downloads & Files
            </TabsTrigger>
          )}
          <TabsTrigger
            value="warranty"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black text-gray-500 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 text-sm font-bold transition-all"
          >
            5-Year Warranty
          </TabsTrigger>
          {hasFaqs && (
            <TabsTrigger
              value="faqs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black text-gray-500 hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 text-sm font-bold transition-all"
            >
              FAQ
            </TabsTrigger>
          )}
        </TabsList>

        <div className="pt-6">
          <TabsContent value="description" className="mt-0">
            {description}
          </TabsContent>
          <TabsContent value="specs" className="mt-0">
            {specs}
          </TabsContent>
          {hasDownloads && (
            <TabsContent value="downloads" className="mt-0">
              {downloads}
            </TabsContent>
          )}
          <TabsContent value="warranty" className="mt-0">
            {warranty}
          </TabsContent>
          {hasFaqs && (
            <TabsContent value="faqs" className="mt-0">
              {faqs}
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
