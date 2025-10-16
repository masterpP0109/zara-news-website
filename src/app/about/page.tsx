import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-700 leading-relaxed mb-6">
            Welcome to our news portal, your trusted source for comprehensive news coverage.
            We are committed to delivering accurate, timely, and unbiased news from around the world.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to keep you informed about the latest developments in politics,
            technology, sports, and more. We strive to provide in-depth analysis and diverse perspectives
            to help you understand the world better.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
