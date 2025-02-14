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
    return creditNotes.filter((note) => note.reference === invoiceId);
  };

  return { invoices, loading, error, getCreditNotesForInvoice };
};
