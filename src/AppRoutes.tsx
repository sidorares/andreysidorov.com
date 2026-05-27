import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import BlogIndex from "./pages/BlogIndex.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import ProjectsIndex from "./pages/ProjectsIndex.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import About from "./pages/About.tsx";
import TagIndex from "./pages/TagIndex.tsx";
import TagContentPage from "./pages/TagContentPage.tsx";
import NotFound from "./pages/NotFound.tsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/projects" element={<ProjectsIndex />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/tags/:tagname" element={<TagIndex />} />
      <Route path="/tags/:tagname/:slug" element={<TagContentPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
