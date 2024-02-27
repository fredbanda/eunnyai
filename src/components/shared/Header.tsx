import React from 'react'

interface HeaderProps {
    title: string
    subtitle?: string
}

const Header = ({title, subtitle} : HeaderProps) => {
  return (
            <>
            <h1 className="h2-bold text-dark-600">{title}</h1>
            {subtitle && <p className="text-dark-600 p-16-regular mt-4">{subtitle}</p>}
            </>
  )
}

export default Header
