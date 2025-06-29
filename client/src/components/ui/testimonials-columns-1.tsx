
"use client";
import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "This AI-powered platform revolutionized our hiring process, streamlining candidate evaluation with intelligent assessments. The interview insights are incredibly valuable.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "HR Director",
  },
  {
    text: "Implementing this AI interviewing solution was seamless. The unbiased assessment tools have significantly improved our recruitment quality and efficiency.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Marcus Thompson",
    role: "Talent Acquisition Manager",
  },
  {
    text: "The AI interview analytics provide deeper candidate insights than traditional methods. Our hiring success rate has increased by 40% since implementation.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Dr. Priya Patel",
    role: "Chief People Officer",
  },  {
    text: "Outstanding AI technology that eliminates hiring bias while providing comprehensive candidate evaluation. The real-time feedback feature is game-changing.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Rodriguez",
    role: "Technology Director",
  },
  {
    text: "The AI interview platform's ability to assess technical and soft skills simultaneously has transformed our hiring process. Highly recommend for any organization.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Lisa Wang",
    role: "Head of Recruitment",
  },
  {
    text: "Exceptional AI-driven interview experience that provides consistent, fair evaluations. The candidate feedback reports are incredibly detailed and actionable.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Amanda Foster",
    role: "Director of Human Resources",
  },
  {
    text: "The AI interview technology exceeded our expectations with its accuracy and insights. Our time-to-hire has decreased by 60% while improving candidate quality.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "James Mitchell",
    role: "Recruitment Lead",
  },
  {
    text: "Revolutionary AI platform that delivers unparalleled interview analytics. The system's ability to predict candidate success has been remarkably accurate.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Rachel Kim",
    role: "Talent Strategy Manager",
  },
  {
    text: "Using this AI interview solution, our hiring accuracy and candidate satisfaction scores significantly improved. The platform is intuitive and highly effective.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Michael Brown",
    role: "Head of Talent Acquisition",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-6 rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/20 max-w-xs w-full bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900/90 transition-all duration-300 group" key={i}>
                  <div className="text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    "{text}"
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full ring-2 ring-gray-700/50"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight leading-5 text-white group-hover:text-blue-200 transition-colors">
                        {name}
                      </div>
                      <div className="leading-5 text-gray-400 text-sm tracking-tight">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-black py-20 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-gray-700/50 py-2 px-4 rounded-full bg-gray-900/30 text-gray-300 backdrop-blur-sm">
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mt-6 text-white text-center">
            What our users say
          </h2>
          <p className="text-center mt-5 text-lg text-gray-400 max-w-md">
            See what our customers have to say about our AI-powered interview platform.
          </p>
        </motion.div>        <div className="flex justify-center gap-6 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
      
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default Testimonials;
