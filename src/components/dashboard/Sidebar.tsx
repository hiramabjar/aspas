'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  BookOpen, 
  BarChart2, 
  Settings,
  Home,
  GraduationCap
} from 'lucide-react'

const adminMenuItems = [
  { 
    title: 'Dashboard', 
    href: '/admin/dashboard',
    icon: Home 
  },
  { 
    title: 'Alunos', 
    href: '/admin/dashboard/students', 
    icon: Users 
  },
  { 
    title: 'Exercícios', 
    href: '/admin/dashboard/exercises', 
    icon: BookOpen 
  },
  { 
    title: 'Relatórios', 
    href: '/admin/dashboard/reports', 
    icon: BarChart2 
  },
  { 
    title: 'Configurações', 
    href: '/admin/dashboard/settings', 
    icon: Settings 
  }
]

const studentMenuItems = [
  { 
    title: 'Dashboard', 
    href: '/student/dashboard',
    icon: Home 
  },
  { 
    title: 'Exercícios', 
    href: '/student/dashboard/exercises', 
    icon: BookOpen 
  },
  { 
    title: 'Meu Progresso', 
    href: '/student/dashboard/progress', 
    icon: BarChart2 
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const menuItems = isAdmin ? adminMenuItems : studentMenuItems

  return (
    <aside className="w-64 bg-[#4A3B5C] shadow-xl border-r border-[#563763]">
      <div className="p-6">
        <h2 className="text-[#E5D5F2] text-xl font-semibold">"Escola de Idiomas"</h2>
      </div>
      <nav className="px-4 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-[#8B6C9C] text-[#E5D5F2] shadow-lg scale-[1.02]' 
                    : 'text-[#B794C0] hover:bg-[#563763] hover:text-[#E5D5F2] hover:scale-[1.02]'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
} 