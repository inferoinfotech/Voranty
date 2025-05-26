import React, { useEffect } from "react";

const ChatBotWidget = ({
  organizationId = "6c2b5198-442d-464c-afd0-6a07355a97be",
  templateId = "4c7f4451-4046-492e-af26-9b38ea01cf3b",
  integrationName = "manual_settings",
  productName = "chatbot",
}) => {
  useEffect(() => {
    // Inject the chatbot script
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "https://cdn.openwidget.com/openwidget.js";

    // Set up OpenWidget global variables
    window.__ow = window.__ow || {};
    window.__ow.organizationId = organizationId;
    window.__ow.template_id = templateId;
    window.__ow.integration_name = integrationName;
    window.__ow.product_name = productName;

    document.head.appendChild(script);

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, [organizationId, templateId, integrationName, productName]);

  return (
    <noscript>
      <div className="text-center p-4">
        You need to{" "}
        <a
          href="https://www.chatbot.com/help/chat-widget/enable-javascript-in-your-browser/"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-600 underline"
        >
          enable JavaScript
        </a>{" "}
        in order to use the AI chatbot tool powered by{" "}
        <a
          href="https://www.chatbot.com/"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-600 underline"
        >
          ChatBot
        </a>.
      </div>
    </noscript>
  );
};

export default ChatBotWidget;


