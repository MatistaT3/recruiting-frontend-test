import { useState } from "react";
import { useInvoices } from "../hooks/useInvoices";
import { convertCurrency } from "../utils/currency";
import CreditNoteList from "./CreditNoteList";
import { motion, AnimatePresence } from "framer-motion";

const InvoiceList = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const {
    invoices,
    loading,
    error,
    getCreditNotesForInvoice,
    updateInvoiceAmount,
    markCreditNotesAsAssigned,
  } = useInvoices();

  const handleReset = () => {
    setSelectedCreditNote(null);
    setTimeout(() => {
      setSelectedInvoice(null);
    }, 300);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto p-4 sm:p-6"
      >
        <p>Cargando facturas...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto p-4 sm:p-6"
      >
        <p className="text-red-500">Error: {error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-4 sm:p-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl sm:text-2xl font-semibold text-center mb-6"
      >
        Selecciona una factura
      </motion.h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
          <div>Empresa</div>
          <div className="text-center">Monto</div>
          <div className="text-right">Estado</div>
        </div>

        <div className="divide-y">
          {invoices.map((invoice, index) => {
            const amounts = convertCurrency(invoice.amount, invoice.currency);
            return (
              <motion.label
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">
                      {invoice.organization_id}
                    </span>
                    <span className="text-gray-500 text-sm">{invoice.id}</span>
                  </div>
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
              </motion.label>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedInvoice && !loading && (
          <motion.div
            key="credit-note-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CreditNoteList
              creditNotes={getCreditNotesForInvoice(selectedInvoice)}
              onSelect={setSelectedCreditNote}
              onReset={handleReset}
              selectedInvoice={invoices.find(
                (inv) => inv.id === selectedInvoice
              )}
              onUpdateInvoice={updateInvoiceAmount}
              onMarkAsAssigned={markCreditNotesAsAssigned}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InvoiceList;
