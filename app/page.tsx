import ExpandableCardDemo from "@/app/components/ui/expandable-card-demo-standard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Skip Hire Services</h1>
        <p className="text-slate-300 text-center mb-8 max-w-2xl mx-auto">
          Browse our range of skip sizes available for hire in the NR32 area.
          Select a skip to view more details and pricing information.
        </p>
        <ExpandableCardDemo />
      </div>
    </main>
  );
}