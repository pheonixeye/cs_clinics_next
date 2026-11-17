import { HomeView } from "@/components/home/home-view";
import { getArticles, getDoctors } from "@/lib/pocketbase";

export const revalidate = 300;

export default async function HomePage() {
  const [doctors, articles] = await Promise.all([getDoctors(), getArticles()]);
  return <HomeView doctors={doctors} articles={articles} />;
}
