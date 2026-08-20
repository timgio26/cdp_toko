import { StrictMode,lazy,Suspense} from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import {
  Homepage,
  Authentication,
  ProtectedPage,
  PageNotFound,
  SaleInvoicePage,
  PageLoading,
} from "./Pages/Index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserGuide from "./Pages/UserGuide.tsx";

const queryClient = new QueryClient();

const Dashboard = lazy(() =>
  import("./Pages/csm/Dashboard.tsx")
);

const MergeCustomer = lazy(() =>
  import("./Pages/csm/MergeCustomer.tsx")
);

const Address = lazy(() =>
  import("./Pages/csm/Address.tsx")
);

const Service = lazy(() =>
  import("./Pages/csm/Service.tsx")
);

const Category = lazy(() =>
  import("./Pages/inventory/Category.tsx")
);

const Supplier = lazy(() =>
  import("./Pages/inventory/Supplier.tsx")
);

const Product = lazy(() =>
  import("./Pages/inventory/Product.tsx")
);

const StockMovement = lazy(() =>
  import("./Pages/inventory/StockMovement.tsx")
);

const InvoiceMaker = lazy(() =>
  import("./Pages/sales/InvoiceMaker.tsx")
);

const SalesHistory = lazy(() =>
  import("./Pages/sales/SalesHistory.tsx")
);

const InventoryDashboard = lazy(() =>
  import("./Pages/inventory/InventoryDashboard.tsx")
);

const SalesDashboard = lazy(() =>
  import("./Pages/sales/SalesDashboard.tsx")
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<App />}>
            <Route
              path="/"
              element={
                <ProtectedPage>
                  <Homepage />
                </ProtectedPage>
              }
            />
            <Route
              path="/merge-customer"
              element={
                <ProtectedPage>
                  <MergeCustomer />
                </ProtectedPage>
              }
            />
            <Route
              path="/address-list"
              element={
                <ProtectedPage>
                  <Address />
                </ProtectedPage>
              }
            />
            <Route
              path="/service-list"
              element={
                <ProtectedPage>
                  <Service />
                </ProtectedPage>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedPage>
                  <Dashboard />
                </ProtectedPage>
              }
            />
            <Route path="/inventory">
              <Route
                path="category"
                element={
                  <ProtectedPage>
                    <Category />
                  </ProtectedPage>
                }
              />
              <Route
                path="supplier"
                element={
                  <ProtectedPage>
                    <Supplier />
                  </ProtectedPage>
                }
              />
              <Route
                path="product"
                element={
                  <ProtectedPage>
                    <Product />
                  </ProtectedPage>
                }
              />
              <Route
                path="movement"
                element={
                  <ProtectedPage>
                    <StockMovement />
                  </ProtectedPage>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedPage>
                    <InventoryDashboard />
                  </ProtectedPage>
                }
              />
            </Route>
            <Route path="/sales">
              <Route
                path=""
                element={
                  <ProtectedPage>
                    <SalesHistory />
                  </ProtectedPage>
                }
              />

              <Route
                path="create-invoice"
                element={
                  <ProtectedPage>
                    <InvoiceMaker />
                  </ProtectedPage>
                }
              />
                            <Route
                path="dashboard"
                element={
                  <ProtectedPage>
                    <SalesDashboard />
                  </ProtectedPage>
                }
              />
            </Route>
            <Route path="/user-guide" element={<UserGuide/>}/>
            <Route path="/authentication" element={<Authentication />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route
            path="/sales/:saleId/invoice"
            element={
              <ProtectedPage>
                <SaleInvoicePage />
              </ProtectedPage>
            }
          />
          
        </Routes>
      </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
