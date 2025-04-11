import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actionLabel = "Fermer", onAction }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <div>{children}</div>
        </div>
        <div className="bg-gray-100 px-6 py-4 flex justify-end">
          <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg mr-2" onClick={onClose}>
            Annuler
          </button>
          {onAction && (
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
