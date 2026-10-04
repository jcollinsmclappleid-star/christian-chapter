import { ServicePage, servicePageMetadata } from "@/components/seo/service-page";

export const metadata = servicePageMetadata("/personal-matchmaker");

export default function PersonalMatchmakerPage() {
  return <ServicePage path="/personal-matchmaker" />;
}
