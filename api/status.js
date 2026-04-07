export default async function handler(req, res) {
  const API_KEY = process.env.KIE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "taskId required" });
  try {
    const response = await fetch(
      "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=" + taskId,
      { headers: { Authorization: "Bearer " + API_KEY } }
    );
    const data = await response.json();
    const d = data.data || {};
    const state = d.state || d.status || "pending";

    // Find image URL or base64
    let img = null;

    // Try to find a URL in the whole response
    const str = JSON.stringify(data);
    const m = str.match(/https?:[^"'\s}]+(png|jpg|jpeg|webp)/i);
    if (m) img = m[0].replace(/\\\//g, "/");

    // If no URL, try base64 from param.images
    if (!img && state === "success" && d.param && d.param.images && d.param.images[0]) {
      img = "data:image/png;base64," + d.param.images[0].substring(0, 4000000);
    }

    return res.status(200).json({
      code: 200,
      data: { status: state, output: img ? { image_url: img } : null }
    });
  } catch (e) {
    return res.status(200).json({
      code: 200,
      data: { status: "pending", output: null }
    });
  }
}
