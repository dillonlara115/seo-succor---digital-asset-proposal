
import React from 'react';

const projects = [
  {
    id: 'batten-down',
    name: 'Batten Down',
    image: '/Screenshot-2024-11-20-at-12-57-42-Inflatable-Boat-Cover-Tensioner-Batten-Down.avif',
    description: 'Built on WordPress + WooCommerce, this e-commerce site features a custom product builder, integrated shipping and payment options, and mobile-optimized checkout. Enhanced with video galleries and product reviews, it delivers a streamlined shopping experience for inflatable boat covers.',
    url: 'https://batten-down.com/'
  },
  {
    id: 'shielding-shop',
    name: 'The Shielding Shop',
    image: '/Screenshot-2023-03-31-at-09-03-48-The-Shielding-Shop.avif',
    description: 'Built on WordPress + WooCommerce, this e-commerce site provides a streamlined platform for selling specialty shielding products. Features include advanced product categorization, secure checkout, and caching for fast performance.',
    url: 'https://theshieldingshop.com/'
  },
  {
    id: 'villalobos-ranch',
    name: 'Villalobos Cattle Ranch',
    image: '/Screenshot-2025-11-11-at-19-34-49-Home-Villalobos-Cattle-Ranch-scaled.avif',
    description: 'This build transitioned Villalobos Ranch from a limited Wix setup to a custom WordPress + WooCommerce site optimized for local e-commerce. The new platform improves trust, checkout usability, and SEO performance while giving the ranch full ownership and scalability for future growth.',
    url: 'https://villaloboscattleranch.com/'
  },
  {
    id: 'source-bay',
    name: 'Source Bay',
    image: '/Screenshot-2025-12-09-at-07-34-48-Source-Bay-Furniture-Fixtures-and-Equipment.avif',
    description: 'We designed and built a fully restructured website for Source Bay, an FF&E procurement and installation company serving multiple commercial industries. The new site applies heuristic UX principles, clear service pathways, and industry-specific landing pages to guide users from exploration to quote requests.',
    url: 'https://sourcebay.com/'
  }
];

const DevWork: React.FC = () => {
  return (
    <section>
      <div className="mb-12">
        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          08. Our Development Work
        </span>
        <h2 className="text-4xl font-bold serif text-slate-900">Proven Results Across Industries.</h2>
        <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
          We've built high-performance WordPress sites for businesses across diverse industries. Each project demonstrates our commitment to SEO-first architecture, conversion optimization, and scalable digital infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{project.name}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>
              <a 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-primary/80 transition-colors group/link"
              >
                Visit Site
                <svg 
                  className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DevWork;
