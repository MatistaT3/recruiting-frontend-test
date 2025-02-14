const BASE_URL = "https://recruiting.api.bemmbo.com";

export const getInvoices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/invoices/pending`);
    const data = await response.json();
    return data.filter((invoice) => invoice.type === "received");
  } catch (error) {
    throw new Error("Error fetching invoices: " + error.message);
  }
};
