import React from 'react';

const ClientePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <main className="container mx-auto px-4 pb-20">
        <section className="py-20 text-center">
          <div className="">
            <h1 className='text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r
             from-blue-500 to-orange-500 bg-clip-text
              text-transparent'
            >Cliente Page</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Bem-vindo à página de cliente!</p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ClientePage;