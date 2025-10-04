"use client";
import { useState, useEffect } from "react"
import Image from 'next/image';
interface StaticSkillsData {
  skills: Array<{
    name: string
    logo: string | null  // Pre-resolved SVG path, data URL, or null
  }>
}
function useItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(6);
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setItemsPerPage(3);
      } else if (window.innerWidth < 768) { // md breakpoint
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);
  return itemsPerPage;
}
export default function AutoRotatingCarouselStatic({ skills }: StaticSkillsData) {
  const skillsWithLogos = skills.filter(skill => skill.logo !== null);
  const skillsWithoutLogos = skills.filter(skill => skill.logo === null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = useItemsPerPage();
  const totalPages = Math.ceil(skillsWithLogos.length / itemsPerPage);
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);
  useEffect(() => {
    if (skillsWithLogos.length === 0 || totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(interval);
  }, [skillsWithLogos.length, totalPages]);
  return (
    <section id="skills" className="mb-28">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-5">Technical Skills</h2>
      </div>
      {}
      {skillsWithLogos.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-center items-center">
            <div className="relative w-full overflow-hidden">
              {}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {}
                {Array.from({ length: totalPages }, (_, pageIndex) => {
                  const startIndex = pageIndex * itemsPerPage;
                  const pageTechs = skillsWithLogos.slice(startIndex, startIndex + itemsPerPage);
                  return (
                    <div key={`page-${pageIndex}`} className="w-full flex-shrink-0 flex justify-center">
                      <div className="flex justify-between items-center w-full max-w-2xl sm:max-w-4xl md:max-w-5xl px-4">
                        {pageTechs.map((skill, index) => (
                          <div
                            key={`carousel-${pageIndex}-${index}`}
                            className="flex flex-col items-center gap-2 flex-1"
                          >
                            {skill.logo && (
                              <div className="w-10 h-10 flex items-center justify-center">
                                <Image
                                  src={skill.logo}
                                  alt={skill.name}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            )}
                            <span className="text-xs font-medium text-center max-w-20 truncate">
                              {skill.name}
                            </span>
                          </div>
                        ))}
                        {}
                        {Array.from({ length: itemsPerPage - pageTechs.length }, (_, index) => (
                          <div key={`empty-${pageIndex}-${index}`} className="flex-1" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {}
      {skillsWithoutLogos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center mb-4">Other Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skillsWithoutLogos.map((skill, index) => (
              <div
                key={`other-${index}`}
                className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}