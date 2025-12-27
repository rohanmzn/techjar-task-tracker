import React from 'react';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-3 z-10">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} Created by{" "}
                    <a
                        href="https://rohanmaharjan02.com.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 font-bold underline hover:text-violet-300 transition"
                    >
                        roharzan
                    </a>
                    &nbsp;using{" "}
                    <a
                        href="https://mockapi.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 font-bold underline hover:text-violet-300 transition"
                    >
                        mockapi.io
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;