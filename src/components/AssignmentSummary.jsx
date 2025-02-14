import { Receipt } from "lucide-react";
import { convertCurrency } from "../utils/currency";
import { motion } from "framer-motion";

const AssignmentSummary = ({ invoice, selectedNotes }) => {
  const invoiceAmounts = convertCurrency(invoice.amount, invoice.currency);
  const totalDeduction = selectedNotes.reduce((total, note) => {
    const noteAmount =
      note.currency === "USD" ? note.amount * 1000 : note.amount;
    return total + noteAmount;
  }, 0);

  const invoiceAmount =
    invoice.currency === "USD" ? invoice.amount * 1000 : invoice.amount;

  const newAmount = convertCurrency(invoiceAmount - totalDeduction, "CLP");

  return (
    <motion.div
      layout
      className="mt-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <div className="p-4">
        <motion.h3 layout className="font-medium text-gray-900 mb-4">
          Resumen de asignación
        </motion.h3>
        <motion.div layout className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Factura Original</span>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {invoiceAmounts.formatted.clp} CLP
              </div>
              <div className="text-xs text-gray-500">
                ({invoiceAmounts.formatted.usd} USD)
              </div>
            </div>
          </div>

          {selectedNotes.map((note, index) => {
            const noteAmounts = convertCurrency(note.amount, note.currency);
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center pl-6"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Nota de Crédito {index + 1}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-600">
                    -{noteAmounts.formatted.clp} CLP
                  </div>
                  <div className="text-xs text-gray-500">
                    (-{noteAmounts.formatted.usd} USD)
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Nuevo Monto</span>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {newAmount.formatted.clp} CLP
                </div>
                <div className="text-xs text-gray-500">
                  ({newAmount.formatted.usd} USD)
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AssignmentSummary;
