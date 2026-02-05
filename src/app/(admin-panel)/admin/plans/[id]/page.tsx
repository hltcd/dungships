import PlanForm from "@/components/admin/PlanForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditPlanPageProps {
  params: {
    id: string;
  };
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = await params;
  
  const plan = await prisma.pricingPlan.findUnique({
    where: { id },
    include: {
      bonusProducts: true,
    },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Plan</h1>
        <p className="text-gray-400 mt-1">Modify the {plan.name} package details.</p>
      </div>
      <PlanForm plan={plan} />
    </div>
  );
}
