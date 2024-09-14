// File: components/Footer.tsx

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-4">
      <div className="container mx-auto text-center">
        <p>
          View the source code on{" "}
          <a
            href="https://github.com/ashish4x/unstopAssignment"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
