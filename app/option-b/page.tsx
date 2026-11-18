import type { Metadata } from "next";
import OptionBPage from "@/components/option-b/OptionBPage";

export const metadata: Metadata = {
  title: "Logo Option B · Tile Grid · VancoBiz",
  description: "The VancoBiz Tile Grid logo as an interactive 2×2 puzzle cube.",
  robots: { index: false }, // review page, not for search results
};

export default function Page() {
  return <OptionBPage />;
}
