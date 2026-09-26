import { AcquisitionScreen, acquisitionMetadata } from "@/components/seo/acquisition-screen";

export const metadata = acquisitionMetadata("/personal-matchmaker");

export default function PersonalMatchmakerPage() {
  return <AcquisitionScreen path="/personal-matchmaker" />;
}
