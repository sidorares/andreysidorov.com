import { useParams } from "react-router-dom";
import { getPost, getProject } from "@/lib/content";
import NotFound from "./NotFound";
import BlogPost from "./BlogPost";
import ProjectPage from "./ProjectPage";

export default function TagContentPage() {
  const { tagname = "", slug = "" } = useParams();
  const tag = tagname.toLowerCase();

  const post = getPost(slug);
  if (post && post.frontmatter.tags?.includes(tag)) return <BlogPost />;

  const project = getProject(slug);
  if (project && project.frontmatter.tech?.includes(tag)) return <ProjectPage />;

  return <NotFound />;
}

