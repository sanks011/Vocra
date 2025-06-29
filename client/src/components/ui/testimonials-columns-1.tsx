
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
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-gray-900/50 border-gray-800" key={i}>
                  <div className="text-gray-300">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-white">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-gray-400">{role}</div>
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
    <section className="bg-black my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-gray-700 py-1 px-4 rounded-lg bg-gray-900/50 text-gray-300">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-white">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75 text-gray-300">
            See what our customers have to say about our AI-powered interview platform.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
