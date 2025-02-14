import { CheckCircle2 } from "lucide-react";

const SuccessModal = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
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
              <div className="mt-2">
                <p className="text-gray-500">
                  La nota de crédito ha sido asignada correctamente
                </p>
              </div>
              <div className="mt-8">
                <button
                  onClick={onContinue}
                  className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  Seguir asignando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
