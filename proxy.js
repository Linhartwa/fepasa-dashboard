// proxy.js (serverless proxy usando Cloudflare Workers / Render / o local dev)
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get("endpoint");

    if (!endpoint) {
      return new Response("Missing endpoint parameter", { status: 400 });
    }

    const response = await fetch(`https://api.appsheet.com/api/v2/apps/${endpoint}`, {
      method: "GET",
      headers: {
        "ApplicationAccessKey": "AFmtp-tvFPE-EY23b-ZDc1p-2gmzw-RewnK-VMNyc-I8pTk",
        "Accept": "application/json"
      }
    });

    const data = await response.text();
    return new Response(data, {
      headers: { "Content-Type": "application/json" }
    });
  }
};
