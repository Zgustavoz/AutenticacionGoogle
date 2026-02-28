//src/dashBoard/DashBoard.jsx
import { AnimatePresence, motion } from "motion/react"
import { Sidebar } from "./components/layout/Sidebar"
import { Outlet, useLocation } from "react-router-dom"

export const DashboardLayout = () => {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}