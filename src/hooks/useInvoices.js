import { useState, useEffect } from "react";
import {
  getReceivedInvoices,
  getCreditNotes,
} from "../services/invoiceService";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const EXCHANGE_RATE = 1000;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const [receivedInvoices, allCreditNotes] = await Promise.all([
        getReceivedInvoices(),
        getCreditNotes(),
      ]);

      setInvoices(receivedInvoices);
      setCreditNotes(allCreditNotes);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCreditNotesForInvoice = (invoiceId) => {
    return creditNotes.filter(
      (note) => note.reference === invoiceId && !note.assigned
    );
  };

  const updateInvoiceAmount = (invoiceId, newAmount, currency = "CLP") => {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              amount:
                currency === invoice.currency
                  ? newAmount
                  : currency === "CLP"
                  ? newAmount / EXCHANGE_RATE
                  : newAmount * EXCHANGE_RATE,
              currency: invoice.currency,
            }
          : invoice
      )
    );
  };

  const markCreditNotesAsAssigned = (noteIds) => {
    setCreditNotes((currentNotes) =>
      currentNotes.map((note) =>
        noteIds.includes(note.id) ? { ...note, assigned: true } : note
      )
    );
  };

  return {
    invoices,
    loading,
    error,
    getCreditNotesForInvoice,
    updateInvoiceAmount,
    markCreditNotesAsAssigned,
  };
};
