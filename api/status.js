export default async function handler(req, res) {
  const API_KEY = process.env.KIE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "taskId required" });
  try {
    const response = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    
    if (data?.data) {
      // Normalize state -> status
      if (data.data.state && !data.data.status) {
        data.data.status = data.data.state;
      }
      
      // Extract image URL from various possible locations
      let imageUrl = null;
      const d = data.data;
      
      if (d.output && typeof d.output === "string") {
        imageUrl = d.output;
      } else if (d.output?.image_url) {
        imageUrl = d.output.image_url;
      } else if (d.output?.url) {
        imageUrl = d.output.url;
      } else if (d.output?.images?.[0]) {
        imageUrl = d.output.images[0];
      } else if (d.images?.[0]) {
        imageUrl = d.images[0];
      } else if (d.resultUrl) {
        imageUrl = d.resultUrl;
      } else if (d.result?.images?.[0]) {
        imageUrl = d.result.images[0];
      } else if (d.result?.url) {
        imageUrl = d.result.url;
      }
      
      // If image is base64, convert to data URI
      if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
        imageUrl = "data:image/png;base64," + imageUrl;
      }
      
      // Set normalized output
      if (imageUrl) {
        data.data.output = { image_url: imageUrl };
      }
    }
    
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to check status", details: e.message });
  }
}
