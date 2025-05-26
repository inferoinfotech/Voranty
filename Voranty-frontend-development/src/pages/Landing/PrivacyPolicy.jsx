import React from "react";
import { Link } from "react-router-dom";
import { Card, Collapse, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import DarkGradientButton from "@/components/Button/DarkGradientButton";
import LandingFooter from '@/components/Landing/LandingFooter';
import { FaHome } from "react-icons/fa";

const { Panel } = Collapse;
const { Title, Text } = Typography;

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071825] via-[#0D2435] to-[#071825] text-white  py-10 ">
      {/* Header */}
      <header className="container mx-auto flex justify-between items-center mb-12">
        <div className="text-4xl font-bold text-[#37B5FF] tracking-wide">VORANTY</div>
        <Link to="/">
          <DarkGradientButton label="Go to Home" icon={<FaHome className="h-5 w-5" />} />
        </Link>
      </header>

      {/* Main Content */}
      <div className="container mx-auto">
        <Card
          className="rounded-xl p-8"
          style={{
            background: "#0b92c2",
            border: "1px solid #37B5FF",
            boxShadow: "0 10px 10px 0 #0b92c20", // Custom shadow for the background
          }}

          title={
            <Title
              level={1}
              className="text-center text-[#071825]"
            >
              Privacy Policy
            </Title>
          }
          bordered={false}
        >
          <Collapse
            accordion
            bordered={false}
            expandIconPosition="end"
            style={{
              background: "transparent",
            }}
            className="rounded-xl p-2 pt-4"
          >
            {/* Section 1: Introduction */}
            <Panel
              header={<span className="text-xl">{'Introduction'}</span>}
              key="1"
              className=""
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <Text className="text-lg" style={{ color: "#d4e1f4" }}>
                This privacy policy applies to the Voranty web application (hereby referred to as "Application")
                developed by the Voranty Team (hereby referred to as "Service Provider") as a free service. This
                service is intended for use "AS IS".
              </Text>
            </Panel>

            {/* Section 2: Information Collection */}
            <Panel
              header={<span className="text-xl">{'Information Collection and Use'}</span>}
              key="2"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <Text className="text-lg" style={{ color: "#d4e1f4" }}>
                The Application collects information when you register, use its features, or interact with the web platform. This
                information may include but is not limited to:
              </Text>
              <ul className="list-disc list-inside pl-6 mt-3 text-lg text-[#d4e1f4]">
                <li>Your Internet Protocol (IP) address.</li>
                <li>Details about the pages you visit, the time and date of your visit, and time spent on those pages.</li>
                <li>Your browser type, version, and operating system.</li>
                <li>User-provided details such as email address, name, phone number, and warrenty details for your products.</li>
              </ul>
            </Panel>

            {/* Section 3: Information Collection */}
            <Panel
              header={<span className="text-xl">{'Third Party Access'}</span>}
              key="3"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <Text className="text-lg" style={{ color: "#d4e1f4" }}>
                Only aggregated, anonymized data is periodically transmitted to external services to improve the
                Application. The Service Provider may share information with third parties in the following scenarios:

              </Text>
              <ul className="list-disc list-inside pl-6 mt-3 text-lg text-[#d4e1f4]">
                <li>As required by law to comply with legal obligations</li>
                <li>To protect the rights and safety of users or others.</li>
                <li>With trusted service providers assisting in the Application’s operation, bound by confidentiality agreements.</li>
              </ul>
            </Panel>

            {/* Additional Panels */}
            {[
              // { header: "", key: "3", content: "Only aggregated, anonymized data is periodically transmitted to..." },
              { header: "Data Storage and Security", key: "4", content: "Data provided through the Application is stored securely in a cloud database managed using MongoDB. Authentication is handled using secure protocols, including JWT tokens for user sessions. The Service Provider implements strong encryption and access controls to safeguard data." },
              { header: "Cookies", key: "5", content: "The Application uses cookies to enhance functionality and improve user experience. Cookies help remember user sessions, preferences, and track site usage. Users can control cookie settings through their browser preferences." },
              { header: "Children", key: "6", content: "The Application does not knowingly collect information from individuals under the age of 13. If a parent or guardian becomes aware that their child has provided personal information, they should contact the Service Provider to take appropriate action." },
              { header: "Changes to Privacy Policy", key: "7", content: "This Privacy Policy may be updated periodically to reflect changes in practices or for operational, legal, or regulatory reasons. Users will be notified of any significant changes through the Application or via email." },
              { header: "Contact Us", key: "8", content: "If you have any questions regarding this Privacy Policy or the practices of the Application, please contact the Service Provider at support@voranty.com." },
            ].map(({ header, key, content }) => (
              <Panel
                header={<span className="text-xl">{header}</span>}
                key={key}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                <Text className="text-lg" style={{ color: "#d4e1f4" }}>{content}</Text>
              </Panel>
            ))}
          </Collapse>
        </Card>


        <footer className="text-center mt-8 pb-6">
          <Text className="text-sm text-[#d4e1f4]">
            This privacy policy was last updated on 2025-01-10.
          </Text>
        </footer>
      </div>

      <LandingFooter />
    </div>
  );
}
