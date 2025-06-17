import TournamentApp from "@/components/TournamentApp";

export default function Page() {
  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 flex flex-col gap-4 items-center h-full overflow-y-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
        토너먼트 대진표
      </h1>
      <TournamentApp />
    </div>
  );
}
