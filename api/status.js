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
    
    // Normalize: Kie.ai uses "state" but our frontend expects "status"
    if (data?.data?.state && !data?.data?.status) {
      data.data.status = data.data.state;
    }
    
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to check status", details: e.message });
  }
}
