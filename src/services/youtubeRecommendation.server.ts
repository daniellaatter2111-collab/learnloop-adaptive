import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const recommendationRequestSchema = z.object({
  title: z.string().min(1).max(160),
  subject: z.string().min(1).max(120),
  topic: z.string().min(1).max(160),
});

type YouTubeSearchResponse = {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: { title?: string };
  }>;
};

function searchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/**
 * Finds a focused YouTube lesson without exposing the API key to the browser.
 * When the optional key is absent, students still get a ready-to-open YouTube
 * search rather than losing the audiovisual recommendation altogether.
 */
export const findYouTubeRecommendation = createServerFn({ method: "POST" })
  .validator(recommendationRequestSchema)
  .handler(async ({ data }) => {
    const query = `${data.subject} ${data.topic || data.title} explained lesson`;
    const apiKey = process.env["YOUTUBE_API_KEY"];

    if (!apiKey) {
      return {
        title: `Watch: ${data.topic || data.title}`,
        url: searchUrl(query),
        isSearchFallback: true,
      };
    }

    try {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        maxResults: "1",
        q: query,
        key: apiKey,
        videoEmbeddable: "true",
        safeSearch: "strict",
      });
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
      const result = (await response.json()) as YouTubeSearchResponse;
      const video = result.items?.[0];

      if (response.ok && video?.id?.videoId && video.snippet?.title) {
        return {
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          isSearchFallback: false,
        };
      }
    } catch {
      // A recommendation should never prevent a teacher from sharing their material.
    }

    return {
      title: `Watch: ${data.topic || data.title}`,
      url: searchUrl(query),
      isSearchFallback: true,
    };
  });
