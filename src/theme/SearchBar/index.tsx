import React from 'react'
import SearchBar from '@theme-original/SearchBar'
import { useLocation } from '@docusaurus/router'

type SearchBarProps = React.ComponentProps<typeof SearchBar>

export default function DocsOnlySearchBar(props: SearchBarProps): React.JSX.Element | null {
  const { pathname } = useLocation()

  if (!(pathname === '/docs' || pathname.startsWith('/docs/'))) {
    return null
  }

  return <SearchBar {...props} />
}
