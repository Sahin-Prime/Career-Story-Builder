import React, { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";

export default function Home() {
  const { clearAll } = useResumeStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex-none h-14 border-b border-border bg-card flex items-center justify-between px-6 z-10 print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-serif text-xs font-bold leading-none">R</span>
          </div>
          <h1 className="font-semibold text-lg tracking-tight">ResumeAI</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button size="sm" onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Form */}
        <div className="flex-1 md:w-1/2 overflow-y-auto bg-background p-6 border-r border-border print:hidden relative custom-scrollbar">
          <div className="max-w-2xl mx-auto pb-24">
            <ResumeForm />
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex-1 md:w-1/2 overflow-y-auto bg-muted/30 p-6 md:p-8 flex justify-center print:p-0 print:m-0 print:w-full print:block print:bg-white print:overflow-visible custom-scrollbar">
          <ResumePreview />
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            background: white !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
