
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Add custom CSS for stars to make them more visible and less blurry
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .night-sky::before,
      .night-sky::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }
      
      .night-sky::before {
        background-image: 
          radial-gradient(1px 1px at 50px 200px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 100px 150px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 150px 50px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 250px 350px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 350px 100px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 400px 200px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 450px 300px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 500px 100px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 550px 250px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 600px 150px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 650px 350px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 700px 50px, rgba(255, 255, 255, 1), transparent);
        background-size: 700px 700px;
        animation: twinkling 8s infinite ease-in-out;
      }
      
      .night-sky::after {
        background-image: 
          radial-gradient(1px 1px at 25px 150px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 75px 100px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 175px 75px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 275px 300px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 325px 150px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 425px 225px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 475px 275px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 525px 75px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1.2px 1.2px at 575px 225px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 625px 125px, rgba(255, 255, 255, 1), transparent),
          radial-gradient(1px 1px at 675px 325px, rgba(255, 255, 255, 1), transparent);
        background-size: 700px 700px;
        animation: twinkling 12s infinite ease-in-out reverse;
        animation-delay: 1s;
      }
      
      @keyframes twinkling {
        0%, 100% {
          opacity: 0.3;
        }
        50% {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
