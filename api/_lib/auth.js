/**
 * Resolve admin role: JWT user_metadata.role first; if absent, query public.user_profiles.
 */

export async function resolveIsAdmin(supabaseClient, user) {
  if (!user?.id) return false

  const metaRole = user.user_metadata?.role
  if (metaRole === 'admin') return true
  if (metaRole !== undefined && metaRole !== null && metaRole !== '') {
    return false
  }

  const { data } = await supabaseClient
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return data?.role === 'admin'
}