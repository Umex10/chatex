const fs = require('fs');

const path = '/home/umejr/IdeaProjects/chatex/frontend/src/app/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldFeatures = `            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 items-stretch"
            >
              {/* Feature 1 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Make a Shout</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                  Share your thoughts, daily updates, or creative ideas instantly with the world through Shouts. 
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Like & Comment</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Engage deeply with the content you love. Drop a like or start a rich discussion in the comments section.
                </p>
                <div className="w-full relative h-48 md:h-64 rounded-xl overflow-hidden mt-2 border border-gray-100 dark:border-gray-800">
                  <Image src="/comment.jpg" alt="Like and Comment Feature" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Share2 size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Reshouts & Quotes</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Found something awesome? Amplify it to your own audience with a single click, or add your own unique spin by quoting them directly on your feed.
                </p>
                <div className="w-full relative h-48 md:h-64 rounded-xl overflow-hidden mt-2 border border-gray-100 dark:border-gray-800">
                  <Image src="/reshout.jpg" alt="Reshouts and Quotes Feature" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Follow System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Build your network. Follow your favorite creators, friends, and trending topics to curate your personal feed.
                </p>
                <div className="w-full relative h-48 md:h-64 rounded-xl overflow-hidden mt-2 border border-gray-100 dark:border-gray-800">
                  <Image src="/followList.jpg" alt="Follow System Image" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </div>
              </motion.div>
            </motion.div>`;

const newFeatures = `            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-8 md:grid-cols-3 items-start"
            >
              {/* Feature 1: Like & Comment */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Heart size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-3 dark:text-white">Like & Comment</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mb-8 flex-1">
                  Engage deeply with the content you love. Drop a like or start a rich discussion in the comments section seamlessly.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-transform duration-700 group-hover:scale-[1.02]">
                  <Image src="/comment.jpg" alt="Like and Comment Feature" width={800} height={600} priority className="w-full h-auto object-contain" />
                </div>
              </motion.div>

              {/* Feature 2: Reshouts & Quotes */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Share2 size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-3 dark:text-white">Reshouts & Quotes</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mb-8 flex-1">
                  Found something awesome? Amplify it to your own audience or add your unique spin by quoting them on your feed.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-transform duration-700 group-hover:scale-[1.02]">
                  <Image src="/reshout.jpg" alt="Reshouts and Quotes Feature" width={800} height={600} priority className="w-full h-auto object-contain" />
                </div>
              </motion.div>

              {/* Feature 3: Follow System */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Users size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-3 dark:text-white">Follow System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mb-8 flex-1">
                  Build your network. Follow your favorite creators, friends, and trending topics to curate your personal feed.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-transform duration-700 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image src="/followList.jpg" alt="Follow System Image" width={800} height={600} priority className="w-full h-auto object-contain" />
                </div>
              </motion.div>
            </motion.div>`;

if(code.indexOf(oldFeatures) !== -1) {
    code = code.replace(oldFeatures, newFeatures);
    fs.writeFileSync(path, code);
    console.log("Successfully replaced old features section.");
} else {
    console.log("Could not find the exact oldFeatures block in the source code.");
}
