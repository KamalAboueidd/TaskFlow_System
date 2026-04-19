import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-purple-950 via-blue-950 to-indigo-950 border-t border-white/10 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr] lg:items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              
            </h2>
            <p className="text-gray-300 max-w-2xl leading-7">
              TaskFlow is your productivity dashboard for focus, tasks, and daily planning.
            </p>
            <p className="text-sm text-gray-400">
              Contact us for support and updates .
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <p className="text-gray-300">Email: kamalaboueidd@gmail.com</p>
              <p className="text-gray-300">Phone: 01131281980</p>
              <p className="text-gray-300">WhatsApp: 01208481291</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
              <h3 className="text-lg font-semibold text-white mb-4">Follow</h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/201208481291" target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20">
                  <FaWhatsapp className="text-green-400" />
                </a>
                <a href="https://www.instagram.com/kamalalmasry" target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20">
                  <FaInstagram className="text-pink-400" />
                </a>
                <a href="https://www.linkedin.com/in/kamal-almorsy-31857a28a" target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20">
                  <FaLinkedin className="text-sky-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} All rights reserved • Developed by Eng Kamal Abou Eid
        </div>
      </div>
    </footer>
  );
}

export default Footer;
