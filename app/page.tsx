import TaskSubmissionTracker from "./components/TaskSubmissionTracker";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">店番長未確認者</h1>
      <TaskSubmissionTracker />
    </main>
  );
}
