export default async function handler(req, res) {
  const API_KEY = process.env.KIE_API_KEY;
  const { taskId } = req.query;
  if (!API_KEY || !taskId) return res.status(400).send("Missing params");
  try {
    const r = await fetch(
      "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=" + taskId,
      { headers: { Authorization: "Bearer " + API_KEY } }
    );
    const data = await r.json();
    const d = data.data || {};
    const images = d.param?.images || d.output?.images || d.images || [];
    if (images[0]) {
      const buf = Buffer.from(images[0], "base64");
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(buf);
    }
    const url = d.resultUrl || d.output?.url || d.output?.image_url;
    if (url) return res.redirect(url);
    res.status(404).send("No image");
  } catch (e) {
    res.status(500).send("Error");
  }
}
