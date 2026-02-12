'use client';

import { useState } from 'react';
import { User, Phone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { createAppointment } from '../services/beautyService';
import { AppointmentResponse } from '../types/appointment';
import { useServices } from '../hooks/useServices';

/**
 * Componente AppointmentScheduler
 * Permite ao usuário agendar um serviço.
 * Conecta-se à API Python para criar o agendamento.
 */
export default function AppointmentScheduler() {
  const { services } = useServices();
  
  // Estados do formulário
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppointmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedServiceId || !customerName || !customerPhone || !date || !time) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await createAppointment({
        service_id: selectedServiceId,
        customer_name: customerName,
        customer_phone: customerPhone,
        date,
        time,
      });
      setResult(response);
    } catch (err) {
      setError('Erro ao realizar agendamento. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Se agendamento confirmado
  if (result) {
    return (
      <section id="agendamento" className="py-12 px-6 bg-green-50 dark:bg-green-900/10 rounded-3xl mx-4 my-8 border border-green-100 dark:border-green-800 text-center transition-colors duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2 transition-colors duration-300">Agendamento Confirmado!</h3>
        <p className="text-green-700 dark:text-green-400 mb-6 transition-colors duration-300">{result.message}</p>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl inline-block shadow-sm border border-green-100 dark:border-green-800 transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-400">ID do Agendamento</p>
          <p className="font-mono font-bold text-gray-800 dark:text-white">{result.appointment_id}</p>
        </div>
        <button
          onClick={() => {
            setResult(null);
            setCustomerName('');
            setCustomerPhone('');
            setDate('');
            setTime('');
            setSelectedServiceId('');
          }}
          className="block mx-auto mt-8 text-green-700 dark:text-green-400 font-bold hover:underline transition-colors duration-300"
        >
          Realizar novo agendamento
        </button>
      </section>
    );
  }

  return (
    <section id="agendamento" className="py-12 px-4 md:px-8 bg-white dark:bg-gray-800 max-w-4xl mx-auto rounded-3xl transition-colors duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-montserrat text-gray-800 dark:text-white mb-2 transition-colors duration-300">
          Agende seu Horário
        </h2>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Escolha o serviço e o melhor momento para você.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        {/* Seleção de Serviço */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Serviço Desejado</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none bg-white transition-all"
          >
            <option value="">Selecione um serviço...</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - R$ {service.price.toFixed(2)} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>

        {/* Data e Hora removidos conforme solicitado */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Seu Nome</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nome completo"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none bg-white transition-all"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Telefone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl hover:bg-pink-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processando...
            </>
          ) : (
            'Confirmar Agendamento'
          )}
        </button>
      </form>
    </section>
  );
}
