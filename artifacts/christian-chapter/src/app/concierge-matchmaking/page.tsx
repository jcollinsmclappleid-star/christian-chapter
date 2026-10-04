import { ServicePage, servicePageMetadata } from "@/components/seo/service-page";

export const metadata = servicePageMetadata("/concierge-matchmaking");

export default function ConciergeMatchmakingPage() {
  return <ServicePage path="/concierge-matchmaking" />;
}
