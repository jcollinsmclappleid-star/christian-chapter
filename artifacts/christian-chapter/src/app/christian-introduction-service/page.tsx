import { ServicePage, servicePageMetadata } from "@/components/seo/service-page";

export const metadata = servicePageMetadata("/christian-introduction-service");

export default function ChristianIntroductionServicePage() {
  return <ServicePage path="/christian-introduction-service" />;
}
