'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'framer-motion'
import React, { forwardRef, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Navbar({ className, ...props }) {
  return <nav {...props} className={clsx(className, 'flex flex-1 items-center py-3 border-b-1 border-gray-200 px-6 bg-white')} />
}

export function NavbarDivider({ className, ...props }) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'h-6 w-px bg-gray-950/10 ')} />
}

export function NavbarSection({ className, ...props }) {
  let id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} className={clsx(className, 'flex items-center gap-6')} />
    </LayoutGroup>
  )
}

export function NavbarSpacer({ className, ...props }) {
  return <div aria-hidden="true" {...props} className={clsx(className, '-ml-4 flex-1')} />
}

export const NavbarItem = forwardRef(function NavbarItem(
  { current, className, children, ...props },

  ref
) {
  let classes = clsx(
    // Base
    'relative flex min-w-0 items-center gap-3 rounded-lg text-left text-base/6 font-medium text-gray-950 sm:text-[15px]/5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-gray-500 sm:*:data-[slot=icon]:size-5',
    // Trailing icon (down chevron or similar)
    '*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)] sm:*:data-[slot=avatar]:size-6',
    // Active
    'data-active:bg-gray-950/5 data-active:*:data-[slot=icon]:fill-gray-950',
    // Dark mode
  )

  return (
    <span className={clsx(className, 'relative group')}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-x-0 -bottom-[19px] h-[3px] bg-gray-950"
        />
      )}
      <span className="absolute inset-x-0 -bottom-[19px] h-[3px] bg-gray-950 opacity-0 group-hover:opacity-100" />
      {'href' in props ? (
        <Link {...props} className={classes} data-current={current ? 'true' : undefined} ref={ref}>
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-default', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function NavbarLabel({ className, ...props }) {
  return <span {...props} className={clsx(className, 'truncate')} />
}
