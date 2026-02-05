import PlanForm from "@/components/admin/PlanForm";

export default function NewPlanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create New Plan</h1>
        <p className="text-gray-400 mt-1">Add a new subscription or lifetime pricing package.</p>
      </div>
      <PlanForm />
    </div>
  );
}
