"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Settings,
  BarChart3,
  FileText,
  Tag,
  Heart,
  MessageCircle,
  Search,
  Star,
  DollarSign,
  Bell,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "provider" | "client";
}

const menuItems = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/services", label: "Services", icon: Settings },
    { href: "/admin/revenue", label: "Revenue", icon: BarChart3 },
    { href: "/admin/invoices", label: "Invoices", icon: FileText },
    { href: "/admin/refunds", label: "Refunds", icon: DollarSign },
  ],
  provider: [
    { href: "/provider", label: "Dashboard", icon: BarChart3 },
    { href: "/provider/services", label: "My Services", icon: Settings },
    { href: "/provider/appointments", label: "Appointments", icon: Calendar },
    { href: "/provider/revenue", label: "Revenue", icon: BarChart3 },
    { href: "/provider/invoices", label: "Invoices", icon: FileText },
    { href: "/provider/promotions", label: "Promotions", icon: Tag },
    { href: "/provider/clients", label: "Clients", icon: Users },
    { href: "/provider/chat", label: "Chat", icon: MessageCircle },
    { href: "/provider/notifications", label: "Notifications", icon: Bell },
  ],
  client: [
    { href: "/client", label: "Dashboard", icon: BarChart3 },
    { href: "/client/appointments", label: "My Appointments", icon: Calendar },
    { href: "/client/search", label: "Find Services", icon: Search },
    { href: "/client/favorites", label: "Favorites", icon: Heart },
    { href: "/client/reviews", label: "My Reviews", icon: Star },
    { href: "/client/chat", label: "Chat", icon: MessageCircle },
    { href: "/client/notifications", label: "Notifications", icon: Bell },
    { name: "Refunds", href: "/client/refunds", icon: DollarSign },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = menuItems[role] || [];

  return (
    <div className="w-64 bg-white border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 capitalize">
          {role} Panel
        </h2>
      </div>
      <nav className="px-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-blue-600 text-white"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
