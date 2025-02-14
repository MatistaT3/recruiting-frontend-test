const BASE_URL = "https://recruiting.api.bemmbo.com";

export const getInvoices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/invoices/pending`);
    if (!response.ok) {
      throw new Error("Error al obtener las facturas");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Error fetching invoices: " + error.message);
  }
};

export const getReceivedInvoices = async () => {
  try {
    const data = await getInvoices();
    return data.filter((invoice) => invoice.type === "received");
  } catch (error) {
    throw new Error("Error getting received invoices: " + error.message);
  }
};

export const getCreditNotes = async (invoiceId = null) => {
  try {
    const data = await getInvoices();
    const creditNotes = data.filter(
      (invoice) => invoice.type === "credit_note"
    );

    if (invoiceId) {
      return creditNotes.filter((note) => note.reference === invoiceId);
    }

    return creditNotes;
  } catch (error) {
    throw new Error("Error getting credit notes: " + error.message);
  }
};
