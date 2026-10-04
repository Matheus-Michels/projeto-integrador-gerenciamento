"use client";

import { useState } from "react";
import PullRequestList from "./pullRequestList";
import IssueList from "./issueList";

type TabType = "prs" | "issues";

export default function ActivityTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("prs");

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex border-b border-zinc-200 bg-zinc-50 px-4 pt-2">
        <button
          onClick={() => setActiveTab("prs")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 cursor-pointer ${
            activeTab === "prs"
              ? "border-black text-black bg-white rounded-t-lg border-t border-l border-r -mb-px"
              : "border-transparent text-zinc-500 hover:text-black"
          }`}
        >
          <span>Pull Requests</span>
          <span className="bg-zinc-200 text-zinc-700 text-xs px-2 py-0.5 rounded-full font-medium">
            3
          </span>
        </button>

        <button
          onClick={() => setActiveTab("issues")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 cursor-pointer ${
            activeTab === "issues"
              ? "border-black text-black bg-white rounded-t-lg border-t border-l border-r -mb-px"
              : "border-transparent text-zinc-500 hover:text-black"
          }`}
        >
          <span>Issues</span>
          <span className="bg-zinc-200 text-zinc-700 text-xs px-2 py-0.5 rounded-full font-medium">
            3
          </span>
        </button>
      </div>

      <div>
        {activeTab === "prs" ? <PullRequestList /> : <IssueList />}
      </div>
    </div>
  );
}