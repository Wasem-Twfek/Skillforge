import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Testimonial data - in a real app this would come from an API
const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Developer",
    company: "TechCorp",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "SkillForge completely changed how I approach learning. The 5-minute format is perfect for my busy schedule, and I've learned more JavaScript in a month than I did in a year of casual studying.",
    rating: 5,
    featured: true
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "UX Designer",
    company: "CreativeStudio",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "As a designer trying to learn coding, other platforms were overwhelming. SkillForge breaks everything down into manageable chunks that build on each other. The streak feature keeps me consistent.",
    rating: 5,
    featured: true
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Marketing Manager",
    company: "GrowthBrands",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    content: "The AI recommendations are spot-on! SkillForge suggested digital marketing analytics courses that directly helped me improve our company's conversion rates by 32%.",
    rating: 5,
    featured: true
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "Career Changer",
    company: "Former Teacher",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    content: "I was intimidated about switching careers to tech at 40, but SkillForge made it approachable. I'm now a junior web developer after 6 months of consistent learning.",
    rating: 5
  },
  {
    id: 5,
    name: "David Kim",
    role: "Product Manager",
    company: "InnovateCo",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    content: "The combination of short lessons and hands-on projects is unbeatable. I can actually apply what I learn immediately, which makes the knowledge stick.",
    rating: 4
  },
  {
    id: 6,
    name: "Priya Patel",
    role: "Student",
    company: "University of Technology",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
    content: "As a computer science student, SkillForge helps me reinforce what I learn in class and explore topics my degree doesn't cover. The community feature is great for getting help.",
    rating: 5
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  // Define the variable without the setter since we only need it as a constant
  const displayedTestimonials = testimonials.filter(t => t.featured);
  
  // For mobile, only show one testimonial at a time and auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            What Our Learners Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied learners who have transformed their skills with SkillForge
          </p>
        </motion.div>
        
        {/* Desktop layout - Grid view for larger screens */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12">
          {displayedTestimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white to-primary-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 shadow-lg relative overflow-hidden"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-200 dark:text-primary-900/30" />
              
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full mr-4 border-2 border-primary-100 dark:border-primary-900/30"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/200/4338ca/ffffff?text=${testimonial.name.charAt(0)}`;
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                        fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 dark:text-gray-300 italic mb-4">
                &quot;{testimonial.content}&quot;
              </blockquote>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile layout - Carousel for smaller screens */}
        <div className="md:hidden relative">
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevTestimonial}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextTestimonial}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          
          <motion.div 
            key={testimonials[activeIndex].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-white to-primary-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 shadow-lg relative overflow-hidden"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200 dark:text-primary-900/30" />
            
            <div className="flex items-center mb-4">
              <img 
                src={testimonials[activeIndex].avatar} 
                alt={testimonials[activeIndex].name} 
                className="w-14 h-14 rounded-full mr-3 border-2 border-primary-100 dark:border-primary-900/30"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/200/4338ca/ffffff?text=${testimonials[activeIndex].name.charAt(0)}`;
                }}
              />
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {testimonials[activeIndex].name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  {testimonials[activeIndex].role}
                </p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                      fill={i < testimonials[activeIndex].rating ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="text-gray-700 dark:text-gray-300 text-sm italic">
              &quot;{testimonials[activeIndex].content}&quot;
            </blockquote>
          </motion.div>
          
          {/* Dots navigation */}
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  activeIndex === index 
                    ? 'bg-primary-600 w-4 transition-all duration-300' 
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* "Join them" call to action */}
        <motion.div 
          className="mt-12 text-center p-8 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Join them on the path to mastery
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start learning with SkillForge today and see how our innovative approach can accelerate your growth
          </p>
          <a 
            href="/signup" 
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started for Free
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 