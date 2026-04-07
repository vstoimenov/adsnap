export default async function handler(req, res) {
  const API_KEY = process.env.KIE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "taskId required" });
  try {
    const response = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const raw = await response.text();
    
    // Parse but handle huge responses
    let data;
    try { data = JSON.parse(raw); } catch { 
      return res.status(500).json({ error: "Parse error" }); 
    }
    
    if (data?.data) {
      const d = data.data;
      const status = d.state || d.status || "pending";
      
      let imageUrl = null;
      
      // Look for HTTP URLs first (preferred - small response)
      const urlPattern = /https?:\/\/[^\s"',\]})]+\.(png|jpg|jpeg|webp)/gi;
      const urls = raw.match(urlPattern);
      if (urls && urls.length > 0) {
        imageUrl = urls[urls.length - 1];
      }
      
      // If no URL found but has base64 images, create a data URI
      if (!imageUrl && status === "success") {
        if (d.param?.images?.[0]) {
          const b64 = d.param.images[0];
          if (b64.length < 5000000) {
            imageUrl = "data:image/png;base64," + b64;
          }
        }
      }
      
      // Return minimal response
      return res.status(200).json({
        code: 200,
        data: {
          status: status,
          output: imageUrl ? { image_url: imageUrl } : null
        }
      });
    }
    
    res.status(200).json({ code: data.code, data: { status: "pending" } });
  } catch (e) {
    res.status(500).json({ error: "Failed", details: e.message });
  }
}
