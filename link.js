(() => {
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // TikTok's in-app browser often refuses intent:// links, so keep the normal https link there.
  const isTikTok = /musical_ly|Bytedance|TikTok/i.test(ua);
  const q = new URLSearchParams(location.search);
  // bluff-labs.com/?s=tiktok  ->  shows up as utm_source=tiktok in Play Console (acquisition reports)
  const source = (q.get("s") || q.get("utm_source") || "").replace(/[^\w.-]/g, "").slice(0, 40) || "bluff-labs";
  const campaign = (q.get("c") || q.get("utm_campaign") || "").replace(/[^\w.-]/g, "").slice(0, 40);
  let ref = "utm_source=" + source + "&utm_medium=link_hub";
  if (campaign) ref += "&utm_campaign=" + campaign;

  document.querySelectorAll("[data-play]").forEach(a => {
    const pkg = a.dataset.play;
    const web = "https://play.google.com/store/apps/details?id=" + pkg + "&referrer=" + encodeURIComponent(ref);
    a.href = web;
    if (isAndroid && !isTikTok) {
      // Opens the Play Store app directly from Instagram / Chrome; falls back to the web page.
      a.href = "intent://details?id=" + pkg + "&referrer=" + encodeURIComponent(ref) +
        "#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=" + encodeURIComponent(web) + ";end";
    }
  });

  if (isIOS) document.querySelectorAll(".ios-note").forEach(n => n.hidden = false);

  // Keep ?s=... when switching language.
  document.querySelectorAll("[data-keep-query]").forEach(a => {
    const p = new URLSearchParams(location.search); p.set("lang", document.documentElement.lang === "tr" ? "en" : "tr");
    a.href = a.getAttribute("href") + "?" + p.toString();
  });

  const share = document.querySelector(".share");
  if (share) share.addEventListener("click", async () => {
    const url = location.origin + location.pathname;
    try {
      if (navigator.share && (isAndroid || isIOS)) { await navigator.share({ title: document.title, url }); return; }
      await navigator.clipboard.writeText(url);
      const old = share.textContent; share.textContent = share.dataset.copied;
      setTimeout(() => share.textContent = old, 1600);
    } catch (e) {}
  });
})();
