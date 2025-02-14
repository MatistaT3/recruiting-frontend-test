import { useState } from "react";
import { convertCurrency } from "../utils/currency";
import SuccessModal from "./SuccessModal";
import Loading from "./Loading";
import AssignmentSummary from "./AssignmentSummary";
import { motion, AnimatePresence } from "framer-motion";

const CreditNoteList = ({
  creditNotes,
  onSelect,
  onReset,
  selectedInvoice,
  onUpdateInvoice,
  onMarkAsAssigned,
}) => {
  const [selectedCreditNotes, setSelectedCreditNotes] = useState(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentSummary, setAssignmentSummary] = useState(null);

  const handleCreditNoteSelect = (creditNoteId) => {
    setSelectedCreditNotes((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(creditNoteId)) {
        newSelection.delete(creditNoteId);
      } else {
        newSelection.add(creditNoteId);
      }
      return newSelection;
    });
  };

  const calculateTotalDeduction = (selectedNotes) => {
    return selectedNotes.reduce((total, note) => {
      const noteAmount =
        note.currency === "USD" ? note.amount * 1000 : note.amount;
      return total + noteAmount;
    }, 0);
  };

  const handleAssign = () => {
    const selectedNotes = Array.from(selectedCreditNotes).map((id) =>
      creditNotes.find((note) => note.id === id)
    );

    const totalDeduction = calculateTotalDeduction(selectedNotes);
    const invoiceAmount =
      selectedInvoice.currency === "USD"
        ? selectedInvoice.amount * 1000
        : selectedInvoice.amount;

    const newAmount = convertCurrency(invoiceAmount - totalDeduction, "CLP");

    const assignmentSummary = {
      invoice: selectedInvoice,
      creditNotes: selectedNotes,
      totalDeduction: convertCurrency(totalDeduction, "CLP"),
      formattedNewAmount: newAmount,
    };

    setShowSuccessModal(true);
    setAssignmentSummary(assignmentSummary);
  };

  const handleContinue = async () => {
    setShowSuccessModal(false);
    setIsLoading(true);

    const amountInOriginalCurrency =
      selectedInvoice.currency === "USD"
        ? assignmentSummary.formattedNewAmount.usd
        : assignmentSummary.formattedNewAmount.clp;

    onUpdateInvoice(
      selectedInvoice.id,
      Number(amountInOriginalCurrency),
      selectedInvoice.currency
    );
    onMarkAsAssigned(Array.from(selectedCreditNotes));
    onReset();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setSelectedCreditNotes(new Set());
  };

  const selectedNotesList = Array.from(selectedCreditNotes).map((id) =>
    creditNotes.find((note) => note.id === id)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-8"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        Selecciona una nota de crédito
      </h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <AnimatePresence mode="wait">
          {creditNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center text-gray-500"
            >
              No hay notas de crédito disponibles para esta factura
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="hidden sm:grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
                <div>Empresa</div>
                <div className="text-center">Monto</div>
                <div className="text-right">Referencia</div>
              </div>

              <div className="divide-y">
                {creditNotes.map((creditNote) => {
                  const amounts = convertCurrency(
                    creditNote.amount,
                    creditNote.currency
                  );
                  return (
                    <label
                      key={creditNote.id}
                      className={`flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedCreditNotes.has(creditNote.id)
                          ? "bg-blue-50 hover:bg-blue-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          value={creditNote.id}
                          checked={selectedCreditNotes.has(creditNote.id)}
                          onChange={() => handleCreditNoteSelect(creditNote.id)}
                          className="w-4 h-4 text-black-600 cursor-pointer"
                        />
                        <span className="font-medium capitalize">
                          {creditNote.organization_id}
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
                        <span className="text-gray-600 text-sm font-medium">
                          {creditNote.reference}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedCreditNotes.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AssignmentSummary
              invoice={selectedInvoice}
              selectedNotes={selectedNotesList}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCreditNotes.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAssign}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
            >
              Asignar {selectedCreditNotes.size} nota
              {selectedCreditNotes.size !== 1 ? "s" : ""} de crédito
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showSuccessModal && (
        <SuccessModal onContinue={handleContinue} summary={assignmentSummary} />
      )}
    </motion.div>
  );
};

export default CreditNoteList;
