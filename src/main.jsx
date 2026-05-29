import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  X,
  Layers3,
  Mail,
  Palette,
  PenTool,
  Sparkles
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import AIChatAssistant from "./components/AIChatAssistant.jsx";
import "./styles.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const projects = [
  {
    title: "AURELIA",
    type: "品牌视觉系统",
    year: "2026",
    summary: "为精品香氛品牌建立从标志、包装到线下陈列的完整视觉语言。",
    palette: ["#111111", "#d9c9aa", "#f6f1e8"],
    accent: "from-stone-950 via-stone-800 to-zinc-500",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=90"
  },
  {
    title: "MINO STUDIO",
    type: "展览主视觉",
    year: "2025",
    summary: "以网格、留白和动势线条构建现代艺术展览的海报与数字传播系统。",
    palette: ["#e6f0ff", "#275efe", "#fb5b54"],
    accent: "from-blue-600 via-sky-400 to-rose-400",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=90"
  },
  {
    title: "NORTHLINE",
    type: "数字产品视觉",
    year: "2025",
    summary: "为创意工具设计高识别度界面视觉、图标体系和官网资产规范。",
    palette: ["#0b1320", "#34d399", "#f9fafb"],
    accent: "from-emerald-400 via-teal-500 to-slate-900",
    image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=1600&q=90"
  }
];

const galleryImages = [
  ...projects.map((project) => ({
    title: project.title,
    subtitle: project.type,
    src: project.image
  })),
  {
    title: "TYPOGRAPHY",
    subtitle: "字体与版式",
    src: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1600&q=90"
  },
  {
    title: "BRAND MATERIAL",
    subtitle: "品牌物料",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90"
  },
  {
    title: "COLOR STUDY",
    subtitle: "色彩实验",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=90"
  },
  {
    title: "CREATIVE DESK",
    subtitle: "创意工作台",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=90"
  }
];

const skills = [
  "品牌识别",
  "海报与版式",
  "包装设计",
  "视觉系统",
  "数字界面视觉",
  "设计规范",
  "字体与网格",
  "创意提案"
];

const experience = [
  {
    period: "2023 - 现在",
    role: "自由视觉设计师",
    detail: "为消费品牌、文化项目和初创产品提供品牌视觉、传播物料与设计系统。"
  },
  {
    period: "2020 - 2023",
    role: "高级平面设计师",
    detail: "负责主视觉、包装、线上营销素材与跨渠道视觉一致性管理。"
  },
  {
    period: "2018 - 2020",
    role: "视觉设计师",
    detail: "参与品牌升级、活动视觉、社交媒体视觉和印刷品落地。"
  }
];

function App() {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const heroY = useTransform(scrollYProgress, [0, 0.32], [0, -90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.35]);
  const activeImage = activeImageIndex === null ? null : galleryImages[activeImageIndex];

  const openImage = (imageTitle) => {
    const imageIndex = galleryImages.findIndex((image) => image.title === imageTitle);
    setActiveImageIndex(imageIndex >= 0 ? imageIndex : 0);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((index) => (index === null ? 0 : (index - 1 + galleryImages.length) % galleryImages.length));
  };

  const showNextImage = () => {
    setActiveImageIndex((index) => (index === null ? 0 : (index + 1) % galleryImages.length));
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 origin-left bg-ink"
        style={{ scaleX, width: "100%" }}
      />

      <nav className="fixed left-1/2 top-5 z-40 w-[min(92vw,980px)] -translate-x-1/2 rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-hairline backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4 text-sm">
          <a href="#top" className="font-semibold tracking-tight">
            Chen Visual
          </a>
          <div className="hidden items-center gap-7 text-mute md:flex">
            <a href="#work" className="nav-link">作品</a>
            <a href="#about" className="nav-link">关于</a>
            <a href="#experience" className="nav-link">经历</a>
          </div>
          <a
            href="mailto:hello@example.com"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition hover:scale-105"
            aria-label="发送邮件"
          >
            <Mail size={17} />
          </a>
        </div>
      </nav>

      <section id="top" className="relative overflow-hidden px-6 pb-24 pt-36 md:pb-32 md:pt-44">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-3xl">
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-2 text-sm text-mute backdrop-blur-xl"
            >
              <Sparkles size={15} />
              平面设计师 / 视觉设计师
            </motion.p>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-4xl text-balance text-6xl font-semibold leading-[0.98] tracking-normal md:text-8xl"
            >
              用安静而精准的视觉语言，建立品牌的第一印象。
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 max-w-2xl text-xl leading-8 text-mute md:text-2xl md:leading-9"
            >
              我专注品牌识别、版式系统、包装与数字视觉，把复杂信息整理成清晰、有质感、可延展的视觉体验。
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a href="#work" className="button-primary">
                查看作品
                <ArrowUpRight size={18} />
              </a>
              <a href="#about" className="button-ghost">
                了解更多
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative min-h-[520px]"
          >
            <div className="absolute right-0 top-0 h-[500px] w-full max-w-[470px] overflow-hidden rounded-[2rem] bg-zinc-950 shadow-soft">
              <div className="poster-grid" />
              <div className="absolute inset-x-8 top-8 flex items-center justify-between text-white/70">
                <span className="text-xs uppercase tracking-[0.3em]">Selected Identity</span>
                <PenTool size={18} />
              </div>
              <div className="absolute bottom-10 left-8 right-8 text-white">
                <p className="text-sm text-white/55">Brand / Editorial / Digital</p>
                <h2 className="mt-3 text-5xl font-semibold leading-none">Visual Direction</h2>
              </div>
              <div className="absolute left-10 top-24 h-52 w-52 rounded-full border border-white/30" />
              <div className="absolute right-8 top-28 h-44 w-32 bg-white" />
              <div className="absolute bottom-36 right-12 h-16 w-44 bg-[#f25c54]" />
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[300px] rounded-[1.5rem] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium">Design Index</span>
                <Layers3 size={18} />
              </div>
              <div className="space-y-4">
                {["Typography", "Color", "System"].map((item, index) => (
                  <div key={item}>
                    <div className="mb-2 flex justify-between text-xs text-mute">
                      <span>{item}</span>
                      <span>{92 - index * 6}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-ink"
                        style={{ width: `${92 - index * 6}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Section id="work" eyebrow="Selected Work" title="三个方向，构成完整的视觉表达。">
        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              onClick={() => openImage(project.title)}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/72 shadow-hairline backdrop-blur-xl"
            >
              <div className={`relative h-80 overflow-hidden bg-gradient-to-br ${project.accent}`}>
                <motion.img
                  src={project.image}
                  alt={project.title}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity"
                />
                <div className="absolute inset-6 border border-white/35" />
                <div className="absolute left-8 top-8 text-white/70">
                  <span className="text-xs uppercase tracking-[0.28em]">{project.year}</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: index === 1 ? -1 : 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-8 left-8 right-8 bg-white p-6 text-ink shadow-soft"
                >
                  <p className="text-sm text-mute">{project.type}</p>
                  <h3 className="mt-3 text-4xl font-semibold tracking-normal">{project.title}</h3>
                  <div className="mt-7 flex gap-2">
                    {project.palette.map((color) => (
                      <span
                        key={color}
                        className="h-6 w-6 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="p-7">
                <p className="leading-7 text-mute">{project.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="about" eyebrow="Profile" title="兼顾审美判断、系统思维与落地细节。">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="rounded-[1.75rem] bg-ink p-8 text-white shadow-soft"
          >
            <Palette className="mb-10" size={34} />
            <p className="text-3xl font-semibold leading-tight">
              我的设计方法从信息结构开始，最后落到每一个字距、色阶和材料触感。
            </p>
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-8">
              <Metric value="8+" label="年设计经验" />
              <Metric value="36" label="品牌项目" />
              <Metric value="12" label="行业覆盖" />
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid content-start gap-4 sm:grid-cols-2"
          >
            {skills.map((skill) => (
              <motion.div
                variants={fadeUp}
                key={skill}
                className="flex items-center gap-3 rounded-3xl border border-white/80 bg-white/70 p-5 shadow-hairline backdrop-blur-xl"
              >
                <BadgeCheck size={19} />
                <span className="font-medium">{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section id="experience" eyebrow="Experience" title="把风格变成方法，把方法变成稳定输出。">
        <div className="grid gap-5">
          {experience.map((item) => (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              key={item.period}
              className="grid gap-5 rounded-[1.5rem] border border-white/80 bg-white/72 p-6 shadow-hairline backdrop-blur-xl md:grid-cols-[180px_1fr_auto] md:items-center"
            >
              <p className="text-sm font-medium text-mute">{item.period}</p>
              <div>
                <h3 className="text-2xl font-semibold">{item.role}</h3>
                <p className="mt-2 leading-7 text-mute">{item.detail}</p>
              </div>
              <BriefcaseBusiness className="hidden text-mute md:block" size={24} />
            </motion.div>
          ))}
        </div>
      </Section>

      <section className="px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-soft md:p-12"
        >
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-mute">
                <Award size={17} />
                Available for selected projects
              </p>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                让下一个品牌视觉，在第一眼就被记住。
              </h2>
            </div>
            <a href="mailto:hello@example.com" className="button-primary w-fit">
              联系合作
              <ArrowUpRight size={18} />
            </a>
          </div>
        </motion.div>
      </section>

      {activeImage && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/82 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveImageIndex(null);
            }}
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-soft transition hover:scale-105"
            aria-label="关闭图片"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
            className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-ink shadow-soft transition hover:scale-105 md:left-8"
            aria-label="上一张图片"
          >
            <ChevronLeft size={26} />
          </button>

          <motion.figure
            key={activeImage.src}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="w-[min(92vw,1080px)] overflow-hidden rounded-[1.5rem] bg-white shadow-soft"
          >
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="max-h-[76vh] w-full object-cover"
            />
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm text-mute">{activeImage.subtitle}</p>
                <h3 className="text-2xl font-semibold">{activeImage.title}</h3>
              </div>
              <p className="text-sm text-mute">
                {activeImageIndex + 1} / {galleryImages.length}
              </p>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
            className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-ink shadow-soft transition hover:scale-105 md:right-8"
            aria-label="下一张图片"
          >
            <ChevronRight size={26} />
          </button>
        </motion.div>
      )}

      <AIChatAssistant />
    </main>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-mute">
            {eyebrow}
          </p>
          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/55">{label}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
