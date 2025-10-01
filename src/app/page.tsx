import React from "react";
import Featured from "@/app/featured";
import Trending from "@/app/trending";
import Sidebar from "@/app/Sidebar";
import MoreDetails from "@/components/moreDetails";
import Politics from "@/app/politics";
import HotSpot from "@/app/hotSpot";
import EditorsPicks from "./editorsPicks";
import WorldTopNews from "@/components/worldTopNews";
import Sports from "@/components/sports";

import BusinessSideBar from "@/components/businessSideBar";
import SignUp from "@/components/signUp";

const page = () => {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      <section className="flex flex-col lg:flex-row overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[13em]">
        <div className="w-full lg:w-auto">
          <main className="flex flex-col lg:flex-row gap-4 p-4">
            <Featured />
            <Trending />
          </main>
          <MoreDetails image="/images/details1.jpg" title="traveling" />
          <Politics />
          <HotSpot />
        </div>

        <aside className="w-full lg:w-auto">
          <Sidebar />
        </aside>
      </section>

      <section className="w-full max-w-[28em] sm:max-w-[32em] md:max-w-[36em] lg:max-w-[40em] h-[4.8rem]">
        <MoreDetails image="/images/details.jpg" title="cyber" />
      </section>

      <section className="w-full max-w-[65vw] sm:max-w-[70vw] md:max-w-[75vw] lg:max-w-[80vw] flex items-start">
        <EditorsPicks />
      </section>

      <section className="w-full max-w-[70vw] mt-[20vh] sm:max-w-[75vw] md:max-w-[80vw] lg:max-w-[85vw] flex flex-col lg:flex-row overflow-hidden p-4 gap-2">
        <div className="w-full lg:w-auto">
          <main className="flex flex-col lg:flex-row p-4">
          <WorldTopNews/>



          </main>
           <MoreDetails image="/images/featuredArticle2.jpg" title="traveling" />
             <Sports/>
        </div>

        <aside className="w-full lg:w-auto">

         <BusinessSideBar/>
        </aside>
      </section>
      <SignUp/>
    </div>
  );
};

export default page;
