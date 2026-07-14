/**
 * include.js — fetches shared header/footer partials and injects them.
 * Works on any static host served over http(s) (Netlify, Vercel, GitHub Pages,
 * S3, cPanel, etc). Each include target sets data-root to the relative path
 * back to the site root, so nested pages (e.g. /blog/post.html) resolve
 * partials correctly.
 */
(function () {
  function setActiveNav(root) {
    var current = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".nav__link").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var resolved = new URL(href, window.location.href).pathname.replace(/\/index\.html$/, "/");
      if (resolved === current || (resolved === "/" && (current === "/" || current === "/index.html"))) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function rewriteRoot(html, root) {
    // partials are authored with root-relative-style tokens: {{ROOT}}
    return html.split("{{ROOT}}").join(root);
  }

  function loadInto(el) {
    var name = el.getAttribute("data-include");
    var root = el.getAttribute("data-root") || "./";
    var url = root + "partials/" + name + ".html";
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + url);
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = rewriteRoot(html, root);
      })
      .catch(function (err) {
        console.error(err);
        el.innerHTML =
          '<div style="padding:14px 24px;background:#F6DEDA;color:#A23B2E;font-size:14px;">' +
          "Navigation failed to load. If you opened this file directly from disk, " +
          "please serve the site over a local web server (see README.md) or view it on its deployed URL." +
          "</div>";
      });
  }

  var includeEls = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
  Promise.all(includeEls.map(loadInto)).then(function () {
    setActiveNav();
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  });
})();
