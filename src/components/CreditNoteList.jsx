import { useState } from "react";
import { convertCurrency } from "../utils/currency";
import SuccessModal from "./SuccessModal";
import Loading from "./Loading";
import AssignmentSummary from "./AssignmentSummary";

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
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    setIsLoading(false);
    setSelectedCreditNotes(new Set());
    onReset();
  };

  const selectedNotesList = Array.from(selectedCreditNotes).map((id) =>
    creditNotes.find((note) => note.id === id)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        Selecciona una nota de crédito
      </h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {creditNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay notas de crédito disponibles para esta factura
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {selectedCreditNotes.size > 0 && (
        <AssignmentSummary
          invoice={selectedInvoice}
          selectedNotes={selectedNotesList}
        />
      )}

      {selectedCreditNotes.size > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAssign}
            className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg font-semibold text-lg"
          >
            Asignar {selectedCreditNotes.size} nota
            {selectedCreditNotes.size !== 1 ? "s" : ""} de crédito
          </button>
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal onContinue={handleContinue} summary={assignmentSummary} />
      )}
    </div>
  );
};

export default CreditNoteList;
