import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface PostStats {
  views: number;
  likes: number;
}

export function usePostStats(slug: string) {
  const [stats, setStats] = useState<PostStats>({ views: 0, likes: 0 });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked_${slug}`) === "true");

    supabase
      .rpc("increment_views", { post_slug: slug })
      .then(({ data, error }) => {
        if (error) console.error("[views]", error);
        if (data?.[0]) setStats({ views: data[0].views, likes: data[0].likes });
      });
  }, [slug]);

  const handleLike = async () => {
    if (liked) {
      const { data, error } = await supabase.rpc("decrement_likes", {
        post_slug: slug,
      });
      if (error) { console.error("[likes]", error); return; }
      if (data?.[0]) {
        setStats({ views: data[0].views, likes: data[0].likes });
        setLiked(false);
        localStorage.removeItem(`liked_${slug}`);
      }
    } else {
      const { data, error } = await supabase.rpc("increment_likes", {
        post_slug: slug,
      });
      if (error) { console.error("[likes]", error); return; }
      if (data?.[0]) {
        setStats({ views: data[0].views, likes: data[0].likes });
        setLiked(true);
        localStorage.setItem(`liked_${slug}`, "true");
      }
    }
  };

  return { stats, liked, handleLike };
}
