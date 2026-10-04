import { ServicePage, servicePageMetadata } from "@/components/seo/service-page";

export const metadata = servicePageMetadata("/christian-matchmaking");

export default function ChristianMatchmakingPage() {
  return <ServicePage path="/christian-matchmaking" />;
}
