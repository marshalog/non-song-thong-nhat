import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashPage from "./pages/SplashPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import JoinPage from "./pages/JoinPage";
import TeamGamePage from "./pages/TeamGamePage";
import HostGamePage from "./pages/HostGamePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/play/:roomCode" element={<TeamGamePage />} />
          <Route path="/host/:roomCode" element={<HostGamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
