import { Outlet } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion } from "framer-motion";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 lg:ml-64 p-4 md:p-6 mt-16"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
