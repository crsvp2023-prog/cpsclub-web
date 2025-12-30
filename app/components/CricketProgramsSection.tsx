'use client';

import { useState } from 'react';
import Image from 'next/image';
import RegistrationInterestModal from './RegistrationInterestModal';

export default function CricketProgramsSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');

  const handleJuniorsClick = () => {
    setSelectedProgram('JUNIORS| AGES 8-16');
    setShowModal(true);
  };

  const handleWinterClick = () => {
    setSelectedProgram('SENIORS | SMCA -WINTER');
    setShowModal(true);
  };

  return (
    <>
      <RegistrationInterestModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        program={selectedProgram}
      />

      {/* Cricket Programs Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-b border-blue-200">
        <div className="mx-auto max-w-7xl">
          <div className="inline-block mb-3 sm:mb-4 px-3 py-1 bg-[var(--color-primary)]/20 rounded-full border border-[var(--color-primary)]/40">
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide">Cricket Programs</p>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Join Our <span className="text-[var(--color-primary)]">Cricket Programs</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Juniors Tile */}
            <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src="/images/cricket-programs/juniors/team.webp"
                  alt="Juniors Cricket Program - Ages 8-16"
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-lg sm:text-xl font-bold">JUNIORS</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">JUNIORS| AGES 8-16</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed flex-grow">
                  Start your cricket journey with our youth development program. Build skills, make friends, and discover the love of the game.
                </p>
                <button
                  onClick={handleJuniorsClick}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD100] to-[#FFC300] text-[var(--color-dark)] rounded-lg font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider w-full"
                >
                  Register Now →
                </button>
              </div>
            </div>

            {/* Seniors Tile */}
            <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src="/images/cricket-programs/seniors/team.webp"
                  alt="Seniors Cricket Program - Ages 16-Up"
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-lg sm:text-xl font-bold">SENIORS</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">SENIORS | NCU -SUMMER</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed flex-grow">
                  Compete at a higher level with our senior teams. Challenge yourself, showcase your skills, and be part of our competitive leagues.
                </p>
                <a 
                  href="/register-interest"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider w-full"
                >
                  Register Now →
                </a>
              </div>
            </div>

            {/* Winter Cricket Tile */}
            <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src="/images/cricket-programs/winter/team.webp"
                  alt="Winter Cricket 2025 Season"
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-lg sm:text-xl font-bold">WINTER CRICKET</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">SENIORS | SMCA -WINTER</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed flex-grow">
                  Join us for 9-a-side cricket matches across Sydney. Games held every second weekend from late April to August.
                </p>
                <button
                  onClick={handleWinterClick}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00BCD4] to-[#009688] text-white rounded-lg font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider w-full"
                >
                  Register Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
