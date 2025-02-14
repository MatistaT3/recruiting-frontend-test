import { CheckCircle2, Receipt } from "lucide-react";
import { convertCurrency } from "../utils/currency";
import { motion, AnimatePresence } from "framer-motion";

const SuccessModal = ({ onContinue, summary }) => {
  const invoiceAmounts = convertCurrency(
    summary.invoice.amount,
    summary.invoice.currency
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        />
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <div>
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2
                  className="h-12 w-12 text-green-600"
                  strokeWidth={1.5}
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-2">
                  ¡Éxito!
                </h3>
                <div className="mt-4">
                  <p className="text-gray-500 mb-4">
                    La nota de crédito ha sido asignada correctamente
                  </p>

                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            Factura Original
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {invoiceAmounts.formatted.clp} CLP
                          </div>
                          <div className="text-sm text-gray-500">
                            ({invoiceAmounts.formatted.usd} USD)
                          </div>
                        </div>
                      </div>

                      {summary.creditNotes.map((note, index) => {
                        const noteAmounts = convertCurrency(
                          note.amount,
                          note.currency
                        );
                        return (
                          <div
                            key={note.id}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <Receipt className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">
                                Nota de Crédito {index + 1}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-red-600">
                                -{noteAmounts.formatted.clp} CLP
                              </div>
                              <div className="text-sm text-gray-500">
                                (-{noteAmounts.formatted.usd} USD)
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">
                            Nuevo Monto
                          </span>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {summary.formattedNewAmount.formatted.clp} CLP
                            </div>
                            <div className="text-sm text-gray-500">
                              ({summary.formattedNewAmount.formatted.usd} USD)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinue}
                    className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Seguir asignando
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessModal;
