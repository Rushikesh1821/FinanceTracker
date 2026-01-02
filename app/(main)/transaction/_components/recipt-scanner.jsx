"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Starting receipt scan for file:", file.name);
      const result = await scanReceipt(file);
      console.log("Scan result:", result);
      
      if (result && onScanComplete) {
        console.log("Calling onScanComplete with:", result);
        onScanComplete(result);
        toast.success("Receipt scanned successfully");
      } else {
        console.log("No result from scanReceipt");
      }
    } catch (error) {
      console.error("Receipt scan error:", error);
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      // Log more details for easier debugging
      console.error("Receipt scan message:", msg);
      if (error?.stack) console.error("Receipt scan stack:", error.stack);
      toast.error(msg || "Failed to scan receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
}
