const fs = require('fs');

const path = '/home/umejr/IdeaProjects/chatex/frontend/src/app/page.tsx';
let data = fs.readFileSync(path, 'utf8');

const startStr = '        {/* Tech Stack Section */}';
const endStr = '        {/* CTA (About) Section */}';

const startIndex = data.indexOf(startStr);
const endIndex = data.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find start or end bounds for replacement');
  process.exit(1);
}

const replacement = `        {/* Tech Stack Section */}
        <section id="tech-stack" className="min-h-screen w-full flex flex-col justify-center py-20 px-6 relative overflow-hidden bg-gradient-to-tr from-purple-50 to-violet-100 dark:from-[#141414] dark:to-[#1f1a26]">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-violet-600 text-white rounded-2xl mb-6 shadow-lg shadow-violet-500/30">
                <Code2 size={32} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Architecture & Technology</h3>
              <p className="text-xl text-violet-600 dark:text-violet-400 font-medium">The comprehensive stack powering Chatex</p>
            </div>
              
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 dark:bg-[#262626]/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 dark:border-gray-700/50 shadow-[0_20px_50px_rgba(139,92,246,0.1)]"
            >
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto mb-12">
                Chatex is a full-stack social media application engineered entirely from scratch over <strong>two dedicated months</strong>. 
                My main objective was to create a modern, scalable platform that accurately mimics real-world enterprise architectures, proving my readiness for professional software engineering securely and confidently.
              </p>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Frontend Card */}
                <div className="bg-gradient-to-b from-white to-blue-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-900/5 group hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></span>
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">Frontend Ecosystem</h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>Next.js 14 & React:</strong> Fully responsive UI built with Tailwind CSS, Server Components, and polished with Framer Motion.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>State & Data:</strong> Managed globally utilizing Redux Toolkit (RTK) and heavily optimized using RTK Queries for catching/mutations.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>Testing:</strong> Extensive Unit & Integration testing through Vitest alongside automated End-to-End (E2E) testing via Playwright.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>Hosting:</strong> Seamlessly deployed and delivered on Vercel's global edge network.</span>
                    </li>
                  </ul>
                </div>

                {/* Backend Card */}
                <div className="bg-gradient-to-b from-white to-green-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-xl shadow-green-900/5 group hover:border-green-400 dark:hover:border-green-600 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]"></span>
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">Backend Architecture</h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Java Spring Boot:</strong> The robust engine powering the RESTful APIs with optimized querying via Spring Data JPA.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Security:</strong> Protected via a strictly defined Custom Security Filter Chain and stateless JWT-based authentication.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Testing:</strong> Bulletproof stability ensured through heavy JUnit testing and comprehensive Spring Boot Integration Tests.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Hosting:</strong> Running continuously in production via Railway deployment.</span>
                    </li>
                  </ul>
                </div>

                {/* DevOps & Flow Card */}
                <div className="bg-gradient-to-b from-white to-purple-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-xl shadow-purple-900/5 group hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"></span>
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">DevOps & Database</h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span>
                      <span><strong>Docker Containerization:</strong> Standardized and isolated environments using Docker & Docker Compose for testing/staging.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span>
                      <span><strong>Database Complexity:</strong> Leveraging PostgreSQL to accurately map the complex relational social graph (Follows, Reshouts, Comments).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span>
                      <span><strong>Engineering Mindset:</strong> Clean code architecture bridging independent frontend and backend infrastructures realistically.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

`;

const newData = data.substring(0, startIndex) + replacement + data.substring(endIndex);
fs.writeFileSync(path, newData);

console.log('Update Complete.');
