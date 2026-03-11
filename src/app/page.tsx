// Root page → redirect to /overview (middleware handles auth check)
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/overview");
}
