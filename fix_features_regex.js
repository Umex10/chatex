const fs = require('fs');

const path = '/home/umejr/IdeaProjects/chatex/frontend/src/app/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const startTag = '              whileInView="visible"';
const endTag = '        {/* Tech Stack Section */}';

const newFeatures = `              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-8 md:grid-cols-3 items-stretch max-w-6xl mx-auto w-full"
            >
              {/* Feature 1: Like & Comment */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-gray-50 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl shadow-sm hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Heart size={28} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Like & Comment</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6 flex-1">
                  Engage deeply with the content you love. Drop a like or start a rich discussion in the comments section seamlessly.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-700 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image src="/comment.jpg" alt="Like and Comment Feature" width={800} height={600} priority className="w-full h-auto object-contain" />
                </div>
              </motion.div>

              {/* Feature 2: Reshouts & Quotes */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-gray-50 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl shadow-sm hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Share2 size={28} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Reshouts & Quotes</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6 flex-1">
                  Found something awesome? Amplify it to your own audience or add your unique spin by quoting them on your feed.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-700 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image src="/reshout.jpg" alt="Reshouts and Quotes Feature" width={800} height={600} priority className="w-full h-auto object-contain" />
                </div>
              </motion.div>

              {/* Feature 3: Follow System */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-gray-50 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl shadow-sm hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Users size={28} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Follow System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6 flex-1">
                  Build your network. Follow your favorite creators, friends, and trending topics to curate your personal feed.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-700 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image src="/followList.jpg" alt="Follow System Image" width={800} height={600} priority className="w-full h-auto object-contain" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

`;

const startIdx = code.indexOf(startTag);
const endIdx = code.indexOf(endTag);

if (startIdx !== -1 && endIdx !== -1) {
    const finalCode = code.substring(0, startIdx) + newFeatures + code.substring(endIdx);
    fs.writeFileSync(path, finalCode);
    console.log("Replaced successfully via indexOf");
} else {
    console.log("Could not find startTag or endTag index. Start: ", startIdx, " End: ", endIdx);
}
