import { Link } from "react-router-dom";
import { FaCode, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer bg-base-300 text-base-content p-10 mt-auto border-t border-base-200">
            <aside>
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-2xl">
                    <FaCode />
                    <span>ZenCode</span>
                </div>
                <p>
                    ZenCode Coding Platform
                    <br />
                    Master Data Structures and Algorithms with AI support.
                </p>
                <p className="text-xs text-base-content/60 mt-2">
                    © {new Date().getFullYear()} ZenCode Inc. All rights reserved.
                </p>
            </aside>
            <nav>
                <h6 className="footer-title opacity-70">Platform</h6>
                <Link to="/" className="link link-hover">Home</Link>
                <Link to="/problems" className="link link-hover">Problems</Link>
                <Link to="/profile" className="link link-hover">Profile</Link>
            </nav>
            <nav>
                <h6 className="footer-title opacity-70">Socials</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                        <FaGithub />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                        <FaTwitter />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                        <FaLinkedin />
                    </a>
                </div>
            </nav>
        </footer>
    );
}

export default Footer;
