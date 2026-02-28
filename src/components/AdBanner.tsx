import React, { useEffect } from 'react';

interface AdBannerProps {
  className?: string;
  slotId?: string; // ID do bloco de anúncios do Google
  format?: 'auto' | 'fluid' | 'rectangle';
}

export default function AdBanner({ className = "", slotId = "1234567890", format = "auto" }: AdBannerProps) {
  useEffect(() => {
    // Tenta carregar o anúncio
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Ignora erros se o script não estiver carregado ainda
    }
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center bg-slate-50 min-h-[100px] w-full max-w-full overflow-hidden ${className}`}>
      {/* 
        ÁREA DO ANÚNCIO REAL 
        Para funcionar:
        1. Descomente o script no index.html e coloque seu ID (ca-pub-...)
        2. Crie blocos de anúncios no Google AdSense
        3. Coloque os IDs dos blocos (data-ad-slot) aqui ou passe via props
      */}
      
      <div className="w-full text-center">
        {/* Código do AdSense */}
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // <--- COLOQUE SEU ID DE EDITOR AQUI
             data-ad-slot={slotId}                    // <--- ID DO BLOCO DE ANÚNCIO
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
             
        {/* Aviso visual para o dono do site (pode remover depois) */}
        <div className="py-4 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg w-full">
          <p className="font-bold text-slate-500">Espaço de Anúncio Real</p>
          <p>Cole seu ID no arquivo <code>AdBanner.tsx</code></p>
        </div>
      </div>
    </div>
  );
}
