import Image from 'next/image';

export default function ProfileHeader() {
  return (
    <header className="flex flex-col items-center justify-center pt-14 pb-10 px-5 bg-white w-full border-b border-gray-50">
      <div className="relative mb-6">
        <div className="w-48 h-48 rounded-full border-[5px] border-pink-500 p-1.5 bg-white shadow-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1595476103596-697edcd70c4c?q=80&w=1000&auto=format&fit=crop"
            alt="Foto de Perfil"
            width={192}
            height={192}
            className="rounded-full w-full h-full object-cover"
            priority
            unoptimized // Allow external URL without next.config.js changes if possible, or assume it works
          />
        </div>
        <div className="absolute bottom-3 right-3 bg-green-500 w-6 h-6 rounded-full border-[3px] border-white" title="Online Agora"></div>
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="text-4xl font-bold font-montserrat text-gray-900">
          Cléia Gomes
        </h1>
        <p className="text-xl text-pink-600 font-medium">
          Nail Designer & Beauty Artist
        </p>
        <p className="text-base text-gray-500 max-w-sm mx-auto mt-2.5">
          Transformando beleza em arte. Especialista em alongamentos e design de unhas.
        </p>
      </div>
    </header>
  );
}
