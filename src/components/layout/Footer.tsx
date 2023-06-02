import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col text-center gap-3 my-2">
      <div className="flex justify-center gap-8">
        <a
          href="https://www.github.com/hahusahin"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub size="1.5rem" />
        </a>
        <a
          href="https://www.twitter.com/hahusahin"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter size="1.5rem" />
        </a>
        <a
          href="https://www.instagram.com/hahusahin"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram size="1.5rem" />
        </a>
      </div>
      <p>{`© Copyright ${new Date().getFullYear()} Huseyin SAHIN`}</p>
    </footer>
  );
};

export default Footer;
