export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });

  try {
    // Extract video ID
    let videoId = null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) { videoId = m[1]; break; }
    }
    if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

    // Fetch oEmbed data
    const oembed = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    const data = await oembed.json();

    res.status(200).json({
      videoId,
      title: data.title || "",
      author: data.author_name || "",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch video info", details: e.message });
  }
}
