import { redirect } from "next/navigation"

type Props = {}

const AdminPage = (props: Props) => {
  return redirect("/admin/dashboard")
}

export default AdminPage