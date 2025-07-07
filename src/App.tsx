import { useState } from 'react';
import { Send, Users, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { broadcast } from './lib/broadcast';
import { GROUPS, Group } from './groups';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupCount: number;
  message: string;
}

function ConfirmModal({ isOpen, onClose, onConfirm, groupCount, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-primary mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Confirmar Envio</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Tem certeza que deseja enviar esta mensagem para <span className="font-semibold text-primary">{groupCount} grupo(s)</span>?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
            <p className="text-sm text-gray-600 font-medium mb-1">Prévia da mensagem:</p>
            <p className="text-sm text-gray-800 line-clamp-3">
              {message.length > 100 ? `${message.substring(0, 100)}...` : message}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Confirmar Envio
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const groups = GROUPS; // Lista fixa - sem useState
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? groups.map((g) => g.id) : []);
  };

  const handleSendClick = () => {
    if (!message.trim()) {
      setStatus('Por favor, escreva uma mensagem.');
      setStatusType('error');
      return;
    }
    
    if (selected.length === 0) {
      setStatus('Selecione pelo menos um grupo.');
      setStatusType('error');
      return;
    }

    setShowModal(true);
  };

  const confirmSend = async () => {
    setShowModal(false);
    
    try {
      setBusy(true);
      setStatus(null);
      await broadcast(message, selected);
      setStatus(`Mensagem enviada com sucesso para ${selected.length} grupo(s)!`);
      setStatusType('success');
      setMessage('');
      setSelected([]);
    } catch (e: any) {
      setStatus(`Erro ao enviar: ${e.message}`);
      setStatusType('error');
    } finally {
      setBusy(false);
    }
  };

  const selectedGroups = groups.filter(g => selected.includes(g.id));
  const allSelected = selected.length === groups.length && groups.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-full mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Broadcast WhatsApp</h1>
          <p className="text-gray-600">Envie mensagens para múltiplos grupos de forma eficiente</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Group Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Users className="w-4 h-4 mr-2" />
                Selecionar Grupos ({selected.length}/{groups.length})
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-gray-600">Selecionar todos</span>
              </label>
            </div>

            <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-2">
                {groups.map((group) => (
                  <label key={group.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={selected.includes(group.id)}
                      onChange={() => toggle(group.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 font-medium">{group.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {selected.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-primary font-medium">
                  Grupos selecionados: {selectedGroups.map(g => g.name).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagem
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {message.length}/1000
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-4 rounded-lg flex items-center space-x-2 ${
              statusType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {statusType === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{status}</span>
            </div>
          )}

          {/* Send Button */}
          <div className="pt-4">
            <button
              onClick={handleSendClick}
              disabled={busy}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                busy
                  ? 'bg-primary/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {busy ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Mensagem</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>As mensagens serão enviadas via webhook de forma segura</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmSend}
        groupCount={selected.length}
        message={message}
      />
    </div>
  );
}