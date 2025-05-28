import Link from "next/link";
import React from "react";
import Layout from "../components/layout";

// Define the type for the social network card data
interface SocialNetwork {
  name: string;
  logo: string;
  points: string;
  url: string;
}

// Define the props for the SocialCard component
interface SocialCardProps {
  name: string;
  logo: string;
  points: string;
  url: string;
}

// Sample data for the cards
const socialNetworks: SocialNetwork[] = [
  {
    name: "Facebook",
    logo: "/facebook.svg", // Update with your logo path
    points: "500",
    url: "https://www.facebook.com",
  },
  {
    name: "X",
    logo: "/x.svg", // Update with your logo path
    points: "500",
    url: "https://www.x.com",
  },
  {
    name: "Instagram",
    logo: "/instagram.svg", // Update with your logo path
    points: "500",
    url: "https://www.instagram.com",
  },
  {
    name: "Tiktok",
    logo: "/tiktok.svg", // Update with your logo path
    points: "500",
    url: "https://www.instagram.com",
  },
  {
    name: "Telegram",
    logo: "/telegram.svg", // Update with your logo path
    points: "500",
    url: "https://www.instagram.com",
  },
];

const SocialCard: React.FC<SocialCardProps> = ({ name, logo, points, url }) => {
  return (
    <div className="flex items-center justify-between bg-base-100 text-white p-4 rounded-lg mb-4 w-full border-2 border-accent shadow-glow">
      {/* Logo Section */}
      <img src={logo} alt={`${name} logo`} className="w-8 h-8 mr-4" />

      {/* Points Section */}
      <div className="flex-1">
        <h3 className="font-bold">Follow GTL on {name}</h3>
        <p className="">+{points} GTL</p>
      </div>

      {/* Redirect Button */}
      <button
        onClick={() => window.open(url, "_blank")}
        className="btn btn-base-100 text-white border-2 border-accent shadow-glow"
      >
        Open
      </button>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Main content */}
        <div className="flex-grow">
          <div className="text-center p-5">
            <h1 className="text-3xl font-bold p-2">👣Join Us</h1>
            <p className="p-2">Join the GTL community on social media for the latest updates and exclusive bonuses! 🎁💸</p>
          </div>

          {/* Social Cards Section */}
          <div className="p-3">
            {socialNetworks.map((network, index) => (
              <SocialCard
                key={index}
                name={network.name}
                logo={network.logo}
                points={network.points}
                url={network.url}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
