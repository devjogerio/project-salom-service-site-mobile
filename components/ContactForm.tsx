'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

/**
 * Componente ContactForm
 * Formulário simples para dúvidas rápidas via WhatsApp.
 */
export default function ContactForm() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5586989038050';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setMessage('');
  };

  return (
    <section className="py-12 px-6 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <MessageSquare className="text-pink-600" size={28} />
          <h2 className="text-2xl font-bold font-montserrat text-gray-800">
            Ficou com dúvidas?
          </h2>
        </div>
        
        <p className="text-gray-500 mb-8">
          Envie uma mensagem direta para nosso WhatsApp e responderemos o mais breve possível.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none h-32"
            placeholder="Escreva sua dúvida aqui..."
          />

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Enviar Mensagem
          </button>
        </form>
      </div>
    </section>
  );
}
