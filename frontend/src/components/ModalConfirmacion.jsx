function ModalConfirmacion({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]"
      style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <p className="text-gray-800 font-semibold text-lg mb-6">{mensaje}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion