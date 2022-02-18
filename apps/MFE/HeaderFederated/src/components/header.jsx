/*eslint-disable*/
import React from 'react'
import styles from './header.module.css'

export const Header = ({children}) => {
  return (
    <header onClick={() => alert('ciao mamma')} className={styles.header}>
      {children}
    </header>
  )
}

export default Header
