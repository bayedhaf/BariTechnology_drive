import { redirect } from "next/navigation";

export default async function CoursePage({ params }: { params: Promise<{ lang: string; courseId: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}/learn/lesson`);
}