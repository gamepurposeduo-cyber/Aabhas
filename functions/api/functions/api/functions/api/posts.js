// ডাটাবেজ থেকে সমস্ত পোস্ট তুলে আনার কোড (GET)
export async function onRequestGet(context) {
  const kv = context.env.SOCIAL_KV;
  if (!kv) {
    return new Response("[]", { headers: { "Content-Type": "application/json" } });
  }
  const data = await kv.get("posts_list");
  return new Response(data || "[]", {
    headers: { "Content-Type": "application/json" }
  });
}

// নতুন পোস্ট ডাটাবেজে জমা করার কোড (POST)
export async function onRequestPost(context) {
  const kv = context.env.SOCIAL_KV;
  if (!kv) {
    return new Response(JSON.stringify({ success: false, error: "Database not bound" }), { status: 500 });
  }
  
  const { username, text } = await context.request.json();
  
  // আগের জমানো পোস্টগুলো রিড করা
  const currentData = await kv.get("posts_list");
  const posts = currentData ? JSON.parse(currentData) : [];
  
  // নতুন পোস্ট অবজেক্ট
  const newPost = {
    username,
    text,
    timestamp: Date.now()
  };
  posts.unshift(newPost); // নতুন পোস্টগুলো একদম উপরে দেখাবে
  
  // আপডেট হওয়া লিস্ট আবার ডাটাবেজে রাইট করা
  await kv.put("posts_list", JSON.stringify(posts));
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
