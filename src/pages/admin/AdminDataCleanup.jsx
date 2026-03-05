import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  VALID_SECTIONS, 
  STYLE_OPTIONS, 
  DEPRECATED_STYLES, 
  getMigrationTarget, 
  isValidStyle 
} from '../../lib/sectionConfig'

/**
 * AdminDataCleanup Component
 * 
 * Utility to detect and fix:
 * - Packages with deprecated/invalid styles
 * - Trips with deprecated/invalid travel_styles
 * - Duplicate entries
 * - Orphaned data
 */
export default function AdminDataCleanup() {
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState([])
  const [trips, setTrips] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [migrating, setMigrating] = useState(false)
  const [toast, setToast] = useState(null)

  // Stats
  const [stats, setStats] = useState({
    totalPackages: 0,
    invalidPackages: 0,
    totalTrips: 0,
    invalidTrips: 0,
    duplicates: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch packages
    const { data: pkgData } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Fetch trips
    const { data: tripData } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
    
    const pkgs = pkgData || []
    const trps = tripData || []
    
    setPackages(pkgs)
    setTrips(trps)
    
    // Calculate stats
    const invalidPkgs = pkgs.filter(p => !isValidStyle(p.style))
    const invalidTrips = trps.filter(t => !isValidStyle(t.travel_style))
    
    // Find duplicates (same slug)
    const slugCounts = {}
    pkgs.forEach(p => {
      slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1
    })
    const duplicates = Object.values(slugCounts).filter(c => c > 1).length
    
    setStats({
      totalPackages: pkgs.length,
      invalidPackages: invalidPkgs.length,
      totalTrips: trps.length,
      invalidTrips: invalidTrips.length,
      duplicates,
    })
    
    setLoading(false)
  }

  const invalidPackages = packages.filter(p => !isValidStyle(p.style))
  const invalidTrips = trips.filter(t => !isValidStyle(t.travel_style))

  // Migrate a single package to a valid style
  const migratePackage = async (pkg, newStyle) => {
    const { error } = await supabase
      .from('packages')
      .update({ style: newStyle })
      .eq('id', pkg.id)
    
    if (error) {
      setToast({ type: 'error', message: `Failed to migrate: ${error.message}` })
    } else {
      setToast({ type: 'success', message: `Migrated "${pkg.title}" to ${newStyle}` })
      fetchData()
    }
  }

  // Migrate a single trip
  const migrateTrip = async (trip, newStyle) => {
    const { error } = await supabase
      .from('trips')
      .update({ travel_style: newStyle })
      .eq('id', trip.id)
    
    if (error) {
      setToast({ type: 'error', message: `Failed to migrate: ${error.message}` })
    } else {
      setToast({ type: 'success', message: `Migrated "${trip.title}" to ${newStyle}` })
      fetchData()
    }
  }

  // Auto-migrate all invalid packages
  const autoMigrateAllPackages = async () => {
    if (!confirm(`Auto-migrate ${invalidPackages.length} packages with invalid styles? This will use the recommended replacement for each deprecated style.`)) return
    
    setMigrating(true)
    let success = 0
    let failed = 0
    
    for (const pkg of invalidPackages) {
      const newStyle = getMigrationTarget(pkg.style)
      const { error } = await supabase
        .from('packages')
        .update({ style: newStyle })
        .eq('id', pkg.id)
      
      if (error) failed++
      else success++
    }
    
    setMigrating(false)
    setToast({ 
      type: failed > 0 ? 'error' : 'success', 
      message: `Migrated ${success} packages. ${failed > 0 ? `${failed} failed.` : ''}` 
    })
    fetchData()
  }

  // Auto-migrate all invalid trips
  const autoMigrateAllTrips = async () => {
    if (!confirm(`Auto-migrate ${invalidTrips.length} trips with invalid styles?`)) return
    
    setMigrating(true)
    let success = 0
    let failed = 0
    
    for (const trip of invalidTrips) {
      const newStyle = getMigrationTarget(trip.travel_style)
      const { error } = await supabase
        .from('trips')
        .update({ travel_style: newStyle })
        .eq('id', trip.id)
      
      if (error) failed++
      else success++
    }
    
    setMigrating(false)
    setToast({ 
      type: failed > 0 ? 'error' : 'success', 
      message: `Migrated ${success} trips. ${failed > 0 ? `${failed} failed.` : ''}` 
    })
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🧹 Data Cleanup</h1>
        <p className="text-gray-600">
          Detect and fix packages/trips with deprecated or invalid section assignments.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-800">{stats.totalPackages}</div>
          <div className="text-sm text-gray-500">Total Packages</div>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${stats.invalidPackages > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`text-2xl font-bold ${stats.invalidPackages > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.invalidPackages}
          </div>
          <div className="text-sm text-gray-500">Invalid Styles</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-800">{stats.totalTrips}</div>
          <div className="text-sm text-gray-500">Total Trips</div>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${stats.invalidTrips > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`text-2xl font-bold ${stats.invalidTrips > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.invalidTrips}
          </div>
          <div className="text-sm text-gray-500">Invalid Trip Styles</div>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${stats.duplicates > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
          <div className={`text-2xl font-bold ${stats.duplicates > 0 ? 'text-amber-600' : 'text-gray-800'}`}>
            {stats.duplicates}
          </div>
          <div className="text-sm text-gray-500">Duplicates</div>
        </div>
      </div>

      {/* Valid Sections Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Valid Sections (Connected to Frontend)</h3>
        <div className="flex flex-wrap gap-2">
          {VALID_SECTIONS.map(s => (
            <span 
              key={s.value}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              title={s.description}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Invalid Packages */}
      {invalidPackages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">⚠️ Packages with Invalid Styles</h2>
              <p className="text-sm text-gray-500">{invalidPackages.length} packages need attention</p>
            </div>
            <button
              onClick={autoMigrateAllPackages}
              disabled={migrating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
            >
              {migrating ? 'Migrating...' : '🔄 Auto-Migrate All'}
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {invalidPackages.map(pkg => (
              <div key={pkg.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-800">{pkg.title}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                      Current: {pkg.style}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Suggested: {getMigrationTarget(pkg.style)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg"
                    defaultValue={getMigrationTarget(pkg.style)}
                    onChange={(e) => migratePackage(pkg, e.target.value)}
                  >
                    {STYLE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invalid Trips */}
      {invalidTrips.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">⚠️ Trips with Invalid Styles</h2>
              <p className="text-sm text-gray-500">{invalidTrips.length} trips need attention</p>
            </div>
            <button
              onClick={autoMigrateAllTrips}
              disabled={migrating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
            >
              {migrating ? 'Migrating...' : '🔄 Auto-Migrate All'}
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {invalidTrips.map(trip => (
              <div key={trip.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-800">{trip.title}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                      Current: {trip.travel_style}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Suggested: {getMigrationTarget(trip.travel_style)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg"
                    defaultValue={getMigrationTarget(trip.travel_style)}
                    onChange={(e) => migrateTrip(trip, e.target.value)}
                  >
                    {STYLE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Good Message */}
      {invalidPackages.length === 0 && invalidTrips.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-lg font-semibold text-green-800 mb-1">All Clean!</h3>
          <p className="text-green-600">
            All packages and trips have valid section assignments.
          </p>
        </div>
      )}

      {/* Section Mapping Reference */}
      <div className="bg-gray-50 rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-gray-800 mb-4">📍 Section → Frontend Page Mapping</h3>
        <div className="grid gap-2">
          {VALID_SECTIONS.map(s => (
            <div key={s.value} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{s.label.split(' ')[0]}</span>
                <span className="font-medium text-gray-800">{s.value}</span>
                <span className="text-sm text-gray-500">— {s.description}</span>
              </div>
              <a 
                href={s.frontendPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline"
              >
                {s.frontendPage} →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white ring-4 ring-green-300/50' 
              : 'bg-red-500 text-white ring-4 ring-red-300/50'
          }`}>
            {toast.type === 'success' ? '✅' : '❌'}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
