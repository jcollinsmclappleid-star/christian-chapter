import { AcquisitionScreen, acquisitionMetadata } from "@/components/seo/acquisition-screen";

export const metadata = acquisitionMetadata("/concierge-matchmaking");

export default function ConciergeMatchmakingPage() {
  return <AcquisitionScreen path="/concierge-matchmaking" />;
}
