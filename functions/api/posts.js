export async function onRequestGet(context) {
  try {
    const postsData = await context.env.SOCIAL_KV.get("posts_list");
    const posts = postsData ? JSON.parse(postsData) : [];
    
    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { username, text } = await context.request.json();
    
    const postsData = await context.env.SOCIAL_KV.get("posts_list");
    const posts = postsData ? JSON.parse(postsData) : [];
    
    const newPost = {
      username,
      text,
      timestamp: Date.now()
    };
    
    posts.unshift(newPost);
    
    await context.env.SOCIAL_KV.put("posts_list", JSON.stringify(posts));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
