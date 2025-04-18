import { Button } from "../components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-6xl font-bold mb-4">Examples</h1>
        <p className="text-2xl text-gray-400">
          Check out some examples app built using the components.
        </p>
      </header>

      {/* Grid of example cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Authentication Card */}
        <div className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Authentication</h3>
          <p className="text-gray-400 mb-4">
            Authentication forms built using the components.
          </p>
          <Button variant="outline" className="w-full justify-between">
            View authentication
            <ArrowIcon />
          </Button>
        </div>

        {/* Dashboard Card */}
        <div className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
          <p className="text-gray-400 mb-4">
            Dashboard with analytics and charts.
          </p>
          <Button variant="outline" className="w-full justify-between">
            View dashboard
            <ArrowIcon />
          </Button>
        </div>

        {/* Cards Card */}
        <div className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Cards</h3>
          <p className="text-gray-400 mb-4">
            A collection of card components for various use cases.
          </p>
          <Button variant="outline" className="w-full justify-between">
            View cards
            <ArrowIcon />
          </Button>
        </div>

        {/* Forms Card */}
        <div className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Forms</h3>
          <p className="text-gray-400 mb-4">
            Form examples with validation and error handling.
          </p>
          <Button variant="outline" className="w-full justify-between">
            View forms
            <ArrowIcon />
          </Button>
        </div>

        {/* Tables Card */}
        <div className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Tables</h3>
          <p className="text-gray-400 mb-4">
            Table examples with sorting and filtering.
          </p>
          <Button variant="outline" className="w-full justify-between">
            View tables
            <ArrowIcon />
          </Button>
        </div>

        {/* Calendar Card */}
        <div className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Calendar</h3>
          <p className="text-gray-400 mb-4">
            Calendar components with event handling.
          </p>
          <Button variant="outline" className="w-full justify-between">
            View calendar
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}