import { useState } from "react";
import { useInvoices } from "../hooks/useInvoices";
import { convertCurrency } from "../utils/currency";

const InvoiceList = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { invoices, loading, error } = useInvoices();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <p>Cargando facturas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        Selecciona una factura
      </h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
          <div>Empresa</div>
          <div className="text-center">Monto</div>
          <div className="text-right">Estado</div>
        </div>

        <div className="divide-y">
          {invoices.map((invoice) => {
            const amounts = convertCurrency(invoice.amount, invoice.currency);
            return (
              <label
                key={invoice.id}
                className={`flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedInvoice === invoice.id
                    ? "bg-blue-50 hover:bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="invoice"
                    value={invoice.id}
                    checked={selectedInvoice === invoice.id}
                    onChange={(e) => setSelectedInvoice(e.target.value)}
                    className="w-4 h-4 text-black-600 cursor-pointer"
                  />
                  <span className="font-medium capitalize">
                    {invoice.organization_id}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 ml-7 sm:ml-0 whitespace-nowrap">
                  <span className="font-semibold">
                    ${amounts.formatted.clp} CLP
                  </span>
                  <span className="text-gray-500 text-sm">
                    (${amounts.formatted.usd} USD)
                  </span>
                </div>

                <div className="flex justify-end ml-7 sm:ml-0">
                  <span className="text-green-600 text-sm font-medium">
                    Recibida
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
