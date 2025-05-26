import { Check, Star, StarHalf } from 'lucide-react'
import "./landing.css";
import { useState } from 'react';
import Heroimg from "../../assets/images/cover/image.png";
import aprioImg from "../../assets/images/cover/Clients_img/aprio.png";
import githubImg from "../../assets/images/cover/Clients_img/github.png";
import stripeImg from "../../assets/images/cover/Clients_img/stripe.png";
import xeroImg from "../../assets/images/cover/Clients_img/xero.png";
import swatchGroupImg from "../../assets/images/cover/Clients_img/swatch_group.png";
import warbyParkerImg from "../../assets/images/cover/Clients_img/warby_parker.png";
import { Link } from 'react-router-dom';
import DarkGradientButton from '../../components/Button/DarkGradientButton';
import LandingFooter from '../../components/Landing/LandingFooter';
import { FaRocket, FaSignInAlt } from 'react-icons/fa';
import { Shield, Settings, Headphones, TrendingUp } from "lucide-react";


export default function LandingPage() {

  const [selectedCard, setSelectedCard] = useState(0); // State to manage selected card

  // Card data
  const cards = [
    {
      title: "Organize my own expenses",
      subtitle: null,
      icon: "💰",
    },
    {
      title: "Manage expenses for a small team",
      subtitle: "(1-9 employees)",
      icon: "🚀",
    },
    {
      title: "Control expenses for a larger organization",
      subtitle: "(10+ employees)",
      icon: "🦋",
    },
  ];

  const features = [
    {
      title: "Customization",
      desc: "Tailor our product to suit your needs Tailor our product to suit your needs.",
      icon: <Settings className="w-12 h-12 text-white" />,
    },
    {
      title: "Security",
      desc: "Your data is protected by the latest security measures.",
      icon: <Shield className="w-12 h-12 text-white" />,
    },
    {
      title: "Support",
      desc: "Tailor our product to suit your needs 24/7 customer support for all your inquiries.",
      icon: <Headphones className="w-12 h-12 text-white" />,
    },
    {
      title: "Performance",
      desc: "Experience blazing-fast performance with our product.",
      icon: <TrendingUp className="w-12 h-12 text-white" />,
    },    {
      title: "Customization",
      desc: "Tailor our product to suit your needs Tailor our product to suit your needs.",
      icon: <Settings className="w-12 h-12 text-white" />,
    },
    {
      title: "Security",
      desc: "Your data is protected by the latest security measures.",
      icon: <Shield className="w-12 h-12 text-white" />,
    },
  ];


  return (
    <>
      <div className="min-h-screen hero-img overflow-hidden">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-4xl font-bold text-[#0b2838]">VORANTY</div>
          <Link to="/login">
            <DarkGradientButton label="Sign In" icon={<FaSignInAlt className="h-5 w-5" />} />
          </Link>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-12 items-center ">
          <div className="space-y-8">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <h1 className="text-4xl md:text-5xl font-serif text-[#ffffff] leading-tight">
                Travel and expense, at the speed of chat.
              </h1>
            </div>

            {/* Features List */}
            <div className="space-y-5">
              {[
                "All inclusive. Manage expenses, book travel, reimburse employees, create expense reports, and send invoices.",
                "Corporate card. Cash back on all US purchases. Fraud protection.",
                "45+ integrations. Quickbooks, NetSuite, Sage Intacct, Xero, Workday, Gusto, and so much more.",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-[16px] font-medium text-[#ffffff]">
                  <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>

            {/* Selection Cards */}
            <div>
              <h2 className="text-white text-xl font-medium mb-4">I want to:</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCard(index)} // Set selected card state
                    className={`cursor-pointer relative p-6 rounded-lg text-center transition-all duration-300
                  ${selectedCard === index
                        ? "bg-[#37B5FF] text-white shadow-xl" // Selected: Light Blue
                        : "bg-[#0B2838] text-[#37B5FF] hover:bg-[#1C3D4C] hover:text-white"
                      }`}
                  >
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    {card.subtitle && (
                      <p className="text-sm mt-1">{card.subtitle}</p>
                    )}
                    {/* Small white circle for selected card */}
                    {selectedCard === index && (
                      <div className="mt-4 absolute top-0">
                        <div className="w-5 h-5 bg-white rounded-full mx-auto"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Get Started Form */}
            <div className="space-y-4 w-52">
              <Link to="/register">
                <DarkGradientButton label="Let's Get Started" icon={<FaRocket className="h-5 w-5" />} />
              </Link>

            </div>
          </div>

          {/* App Preview */}
          <div className="hidden lg:block">
            <div className=" rounded-lg w-[1029px] p-4 relative">
              <img
                src={Heroimg}
                alt="Voranty App Preview"
                className="rounded-lg img-hero"
              />
            </div>
          </div>
        </main>
      </div>

      <section className='p-14 bg-[#0B92C2]'>
        <div className="py-6 text-white">
          <h2 className="md:text-4xl text-3xl font-extrabold mb-14 text-center">Application <span className='text-[#071825]'>Metrics</span></h2>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6 max-lg:gap-12">
            <div className="text-center">
              <h3 className="text-4xl font-semibold">5.4<span className="text-[#071825]">M+</span></h3>
              <p className="text-2xl font-semibold text-[#071825] py-2">Total Users</p>
              <p className="mt-2 text-lg">The total number of registered users on the platform.</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-semibold">$80<span className="text-[#071825]">K</span></h3>
              <p className="text-2xl font-semibold text-[#071825] py-2">Revenue</p>
              <p className="mt-2 text-lg">The total revenue generated by the application.</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-semibold">100<span className="text-[#071825]">K</span></h3>
              <p className="text-2xl font-semibold text-[#071825] py-2">Engagement</p>
              <p className="mt-2 text-lg">The level of user engagement with the application's content and features.</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-semibold">99.9<span className="text-[#071825]">%</span></h3>
              <p className="text-2xl font-semibold text-[#071825] py-2">Server Uptime</p>
              <p className="mt-2 text-lg">The percentage of time the server has been operational and available.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='px-12 py-20 bg-[#0B92C2]'>
        <div className="px-4 sm:px-10">
          <div className=" max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl text-center mx-auto">
              <h2 className="md:text-4xl text-3xl font-extrabold mb-6 text-white">Our <span className='text-[#071825]'>Features</span></h2>
              <p className="mt-6 text-lg text-white">
                Qui elit labore in nisi dolore tempor anim laboris ipsum ad ad consequat id. Dolore et sint
                mollit in nisi tempor culpa consectetur.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto px-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row bg-[#102e3e] rounded-2xl p-4 sm:p-6 items-center hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-[#37b5ff] p-3 rounded-md flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                    {feature.icon}
                  </div>
                  <div className="text-white text-center sm:text-left">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Client */}
      <section className="bg-[#103b52] px-4 py-12 text-center">
        <p className="text-2xl md:text-3xl text-white font-serif">
          Join people using Voranty to streamline their expense management
        </p>
        <div className="clientBox flex justify-evenly flex-wrap mt-5">
          {/* <img className='' src={Clientimg} alt="" /> */}
          <div className="clientImgBox flex items-center">
            <img src={aprioImg} alt="Aprio" />
          </div>
          <div className="clientImgBox flex items-center">
            <img src={githubImg} alt="Github" />
          </div>
          <div className="clientImgBox flex items-center">
            <img src={stripeImg} alt="Stripe" />
          </div>
          <div className="clientImgBox flex items-center">
            <img src={xeroImg} alt="Xero" />
          </div>
          <div className="clientImgBox flex items-center">
            <img src={swatchGroupImg} alt="SwatchGroup" />
          </div>
          <div className="clientImgBox flex items-center">
            <img src={warbyParkerImg} alt="WarbyParker" />
          </div>
        </div>
      </section>

      <LandingFooter />
    </>
  )
}

