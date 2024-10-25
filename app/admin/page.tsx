import AdminPanel from "../components/AdminPanel";

export default function AdminPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">管理者の画面</h1>
      <AdminPanel />
    </main>
  );
}
