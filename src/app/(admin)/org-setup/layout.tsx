/**
 * Org Setup Layout - Inherits from Admin Layout
 * 
 * Purpose: Provides any additional layout structure needed for org setup pages
 * Currently just passes through to the admin layout above
 */

interface OrgSetupLayoutProps {
  children: React.ReactNode
}

export default function OrgSetupLayout({ children }: OrgSetupLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}
