"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Cardápio",
    href: "/menu",
    icon: LayoutDashboard,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-500">foodslice</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-5">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-lg",
                  pathname === item.href
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

