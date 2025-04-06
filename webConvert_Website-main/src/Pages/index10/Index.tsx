import About10SectionArea from "../../Components/HomePage10/About10SectionArea";
import Blog10SectionArea from "../../Components/HomePage10/Blog10SectionArea";
import Cta10SectionArea from "../../Components/HomePage10/Cta10SectionArea";
import Header10BottomArea from "../../Components/HomePage10/Header10BottomArea";
import Hero10Section from "../../Components/HomePage10/Hero10Section";
import PricingSection from "../../Components/HomePage10/PricingSection";
import Service10SectionArea from "../../Components/HomePage10/Service10SectionArea";
import SolutionSectionSlider from "../../Components/HomePage10/SolutionSectionSlider";
import TeamSection from "../../Components/HomePage10/TeamSection";
import TestimonialSection from "../../Components/HomePage10/TestimonialSection";
import Footer10 from "../../Layouts/Footer10";
import Header10 from "../../Layouts/Header10";
import MobileHeaderSidebar from "../../Layouts/MobileHeader";

const HomePage10 = () => {
  document.body.className = "homepage10-body";

  return (
    <>
      <Header10 />
      <MobileHeaderSidebar />
      <Hero10Section />
      <Header10BottomArea />
      <About10SectionArea />
      <Service10SectionArea />
      <SolutionSectionSlider />
      <PricingSection />
      <TeamSection />
      <TestimonialSection />
      <Blog10SectionArea />
      <Cta10SectionArea />
      <Footer10 />
    </>
  );
};

export default HomePage10;
