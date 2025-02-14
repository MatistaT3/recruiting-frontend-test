import { useState } from "react";
import { convertCurrency, calculateNewAmount } from "../utils/currency";
import SuccessModal from "./SuccessModal";
import Loading from "./Loading";

const CreditNoteList = ({
  creditNotes,
  onSelect,
  onReset,
  selectedInvoice,
}) => {
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentSummary, setAssignmentSummary] = useState(null);

  const handleCreditNoteSelect = (creditNoteId) => {
    setSelectedCreditNote(creditNoteId);
    onSelect(creditNoteId);
  };

  const handleAssign = () => {
    const selectedNote = creditNotes.find(
      (note) => note.id === selectedCreditNote
    );

    const newAmount = calculateNewAmount(selectedInvoice, selectedNote);

    const assignmentSummary = {
      invoice: selectedInvoice,
      creditNote: selectedNote,
      newAmount: newAmount.clp,
      formattedNewAmount: newAmount,
    };

    setShowSuccessModal(true);
    setAssignmentSummary(assignmentSummary);
  };

  const handleContinue = async () => {
    setShowSuccessModal(false);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSelectedCreditNote(null);
    onReset();
  };

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
                      selectedCreditNote === creditNote.id
                        ? "bg-blue-50 hover:bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="creditNote"
                        value={creditNote.id}
                        checked={selectedCreditNote === creditNote.id}
                        onChange={(e) => handleCreditNoteSelect(e.target.value)}
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

      {selectedCreditNote && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAssign}
            className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg font-semibold text-lg"
          >
            Asignar nota de crédito
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
