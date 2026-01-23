import React, { useEffect, useState } from 'react'
import { createHighlighter } from 'shiki'

type HeroCodeProps = {
  code: string
  className?: string
}

export function HeroCode({ code, className }: HeroCodeProps) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    let mounted = true

    async function highlight() {
      const highlighter = await createHighlighter({
        themes: ['dark-plus'],
        langs: ['ts'],
      })

      const result = highlighter.codeToHtml(code.trim(), {
        lang: 'ts',
        theme: 'dark-plus'
      })

      if (mounted) setHtml(result)
    }

    highlight()

    return () => {
      mounted = false
    }
  }, [code])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontFamily: 'Fira Code, monospace',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        textAlign: 'left'
      }}
    />
  )
}
