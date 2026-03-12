import { StoreExplorer } from "@/components/store-explorer";
import { getAllStores } from "@/lib/stores";

export default function Home() {
  return <StoreExplorer stores={getAllStores()} />;
}
