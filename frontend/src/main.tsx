import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import {
  Homepage,
  Address,
  Service,
  Authentication,
  ProtectedPage,
  MergeCustomer,
  Dashboard,
  PageNotFound,
  Category,
  Supplier,
  Product,StockMovement,InventoryDashboard
} from "./Pages/Index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<ProtectedPage><Homepage /></ProtectedPage>}/>
            <Route path="/merge-customer" element={<ProtectedPage><MergeCustomer/></ProtectedPage>}/>
            <Route path="/address-list" element={<ProtectedPage><Address /></ProtectedPage>}/>
            <Route path="/service-list" element={<ProtectedPage><Service /></ProtectedPage>}/>
            <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>}/>
            <Route path="/inventory">
              <Route path="category" element={<ProtectedPage><Category /></ProtectedPage>}/>
              <Route path="supplier" element={<ProtectedPage><Supplier /></ProtectedPage>}/>
              <Route path="product" element={<ProtectedPage><Product /></ProtectedPage>}/>
              <Route path="movement" element={<ProtectedPage><StockMovement /></ProtectedPage>}/>
              <Route path="dashboard" element={<ProtectedPage><InventoryDashboard /></ProtectedPage>}/>
            </Route>
            <Route path="/authentication" element={<Authentication />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
