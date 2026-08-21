import { useParams } from "react-router";
import { PrintableInvoice } from "./PrintableInvoice";
import { useSale } from "../../utils/SalesQuery";

export function SaleInvoicePage() {
  const { saleId } = useParams();
  
  const {
      data: sale,
      isPending,
      isError,
    } = useSale(saleId);
    
    // console.log(sale)
  if (isPending) {
    return <div>Loading invoice...</div>;
  }

  if (isError || !sale) {
    return <div>Invoice not found.</div>;
  }


  return <PrintableInvoice sale={sale} />;

}