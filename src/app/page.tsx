export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-slate-800 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Midwest Underground of Minnesota</h1>
          <p className="text-lg mt-2">Expert Directional Drilling & Underground Utilities</p>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Our HDD Management System</h2>
          <p className="text-gray-700 mb-4">
            Professional Horizontal Directional Drilling (HDD) and underground utilities installation serving Central Minnesota since 1991.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">🎯 Bore Logs</h3>
              <p className="text-gray-600">Track drilling operations and field measurements</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">📝 Field Reports</h3>
              <p className="text-gray-600">Document daily operations and crew activities</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">🚧 Projects</h3>
              <p className="text-gray-600">Manage HDD projects and timelines</p>
            </div>
          </div>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">Next.js Migration Status</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              ✅ Next.js app structure created<br/>
              ✅ Prisma database setup complete (SQLite)<br/>
              ✅ NextAuth authentication configured<br/>
              ✅ Static assets migrated<br/>
              🔄 Building HDD API routes next...
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-white p-6 mt-12">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Midwest Underground of Minnesota Inc. All rights reserved.</p>
          <p className="text-sm mt-2">4320 County Rd 8 SE, Willmar, MN 56201 | (320) 382-6636</p>
        </div>
      </footer>
    </div>
  )
}
