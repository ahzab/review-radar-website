import Image from 'next/image';

export function LogoCloud() {
  const logos = [
    {
      name: 'Yelp',
      logo: '/logos/yelp.svg',
      height: 28
    },
    {
      name: 'Google Reviews',
      logo: '/logos/google.svg',
      height: 30
    },
    {
      name: 'Capterra',
      logo: '/logos/capterra.svg',
      height: 24
    },
    {
      name: 'G2',
      logo: '/logos/g2.svg',
      height: 26
    },
    {
      name: 'TripAdvisor',
      logo: '/logos/tripadvisor.svg',
      height: 28
    },
    {
      name: 'Trustpilot',
      logo: '/logos/trustpilot.svg',
      height: 24
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 tracking-wide uppercase mb-8">
          Monitor reviews across all major platforms
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="col-span-1 flex justify-center items-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all"
            >
              <div className="h-12 relative flex items-center">
                {/* Fallback text if image fails to load */}
                <span className="sr-only">{logo.name}</span>
                <div 
                  style={{ height: logo.height }}
                  className="relative w-[120px] flex items-center justify-center"
                >
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}