// Root page → redirect to /overview
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/overview");
}
