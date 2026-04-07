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
      const d = data.data;
      if (d.state && !d.status) d.status = d.state;
      
      let imageUrl = null;
      
      // Check all possible locations where Kie.ai puts the image
      if (d.param?.images?.[0]) imageUrl = d.param.images[0];
      else if (d.output?.images?.[0]) imageUrl = d.output.images[0];
      else if (d.output?.image_url) imageUrl = d.output.image_url;
      else if (d.output?.url) imageUrl = d.output.url;
      else if (d.images?.[0]) imageUrl = d.images[0];
      else if (d.result?.images?.[0]) imageUrl = d.result.images[0];
      else if (d.resultUrl) imageUrl = d.resultUrl;
      else if (typeof d.output === "string") imageUrl = d.output;
      
      // Convert base64 to data URI if needed
      if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
        imageUrl = "data:image/png;base64," + imageUrl;
      }
      
      if (imageUrl) {
        data.data.output = { image_url: imageUrl };
      }
    }
    
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed", details: e.message });
  }
}
