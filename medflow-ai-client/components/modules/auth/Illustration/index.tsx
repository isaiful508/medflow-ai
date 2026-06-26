

const Illustration = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div
            className={`hidden lg:flex flex-1 items-center justify-center ${
              isDarkMode
                ? "bg-gradient-to-b from-amber-100 to-orange-100"
                : "bg-gradient-to-b from-amber-50 to-orange-50"
            } relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-orange-400 blur-3xl" />
              <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-yellow-400 blur-3xl" />
            </div>

            <div className="relative z-10 text-center">
              <svg
                viewBox="0 0 200 200"
                className="w-48 h-48 mx-auto"
              >
                {/* Sun */}
                <circle cx="150" cy="40" r="30" fill="currentColor" className="text-yellow-400" />

                {/* Boat */}
                <ellipse cx="100" cy="120" rx="60" ry="15" fill="currentColor" className="text-teal-700" />

                {/* Sail */}
                <polygon points="100,120 100,40 150,120" fill="currentColor" className="text-yellow-600" />
                <polygon points="100,120 100,55 70,120" fill="currentColor" className="text-amber-700" />

                {/* Person */}
                <circle cx="95" cy="100" r="6" fill="currentColor" className="text-amber-800" />
                <line x1="95" y1="106" x2="95" y2="125" stroke="currentColor" strokeWidth="3" className="text-amber-800" />
                <line x1="85" y1="110" x2="105" y2="110" stroke="currentColor" strokeWidth="3" className="text-amber-800" />

                {/* Water waves */}
                <path d="M 20 140 Q 30 135 40 140 T 60 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600" opacity="0.5" />
                <path d="M 120 140 Q 130 135 140 140 T 160 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600" opacity="0.5" />

                {/* Birds */}
                <path d="M 40 50 Q 50 45 60 50" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gray-700" />
                <path d="M 160 60 Q 170 55 180 60" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gray-700" />
              </svg>

              <p
                className={`mt-6 text-lg font-semibold ${
                  isDarkMode ? "text-gray-800" : "text-gray-700"
                }`}
              >
                Welcome to MedflowAI
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-600" : "text-gray-500"
                }`}
              >
                Your trusted telemedicine partner
              </p>
            </div>
        </div>
    );
};

export default Illustration;